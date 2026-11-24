#!/usr/bin/env node
// Builds the GitHub Pages gallery in docs/ and the images the README uses.
//
//   tools/docker.sh node tools/build-gallery.mjs
//
// It writes:
//   docs/index.html            the gallery page (docs/assets/site.css and site.js are written by hand)
//   docs/styles/<id>/NN.webp   every demo slide, 640 px wide
//   docs/showcase/<id>.webp    the same cover slide in every style (tools/gallery/showcase.json)
//   docs/assets/social.png     a 1280×640 preview for GitHub and link previews
//   docs/assets/styles.gif     the showcase cover in every style, one after the other, for the README
//   docs/assets/fonts/         the page's fonts, copied from the plugin with their licenses
// Renders go to out/gallery/ first. It stops when a render has errors.

import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import gifenc from 'gifenc';

import { listStyles, render } from '../plugin/skills/swipe-styles/core/render.mjs';
import { launchBrowser } from '../plugin/skills/swipe-styles/core/runtime.mjs';

const { applyPalette, GIFEncoder, quantize } = gifenc; // gifenc is a CommonJS module

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = join(ROOT, 'plugin/skills/swipe-styles');
const DOCS = join(ROOT, 'docs');
const OUT = join(ROOT, 'out/gallery');
const SHOWCASE = join(ROOT, 'tools/gallery/showcase.json');
const REPO = 'https://github.com/shango-tek/swipe-styles';
const SITE = 'https://shango-tek.github.io/swipe-styles/';

// Gallery order (light and dark styles alternate) and the sentence each style suggests.
// A style that is not listed here is added at the end, with a generic sentence.
const STYLES = [
  ['swiss-grid', 'Make a LinkedIn carousel about why we stopped billing by the hour, in the Swiss Grid style.'],
  ['blueprint', 'Explain what happens when you open a website, as a Blueprint carousel.'],
  ['receipt', 'Break down what a coffee made at home really costs, in the Receipt style.'],
  ['notebook', 'Turn my study tips into a Notebook carousel for my students.'],
  ['pixel-quest', 'Make a German carousel about five small morning habits, in the Pixel Quest style.'],
  ['comic', 'Make a French carousel about three myths about sleep, in the Comic style.'],
  ['boarding-pass', 'Make a carousel about 48 hours in Lisbon, in German, in the Boarding Pass style.'],
  ['tarot', 'Make a Tarot carousel with five journaling questions for the evening.'],
  ['riso-zine', 'Make a Riso Zine carousel that invites people to our zine workshop.'],
  ['chat-thread', 'Turn the questions couples ask me into a Chat Thread carousel.'],
  ['varsity', 'Make a Varsity carousel with five warm-up moves for our run club.'],
  ['bauhaus', 'Make a French carousel with five composition lessons from the Bauhaus, in the Bauhaus style.'],
];

const LANGUAGES = { en: 'English', fr: 'French', de: 'German' };

const esc = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Plain text of a carousel field: no *emphasis* marks, no forced line breaks.
const plain = (text) => String(text ?? '').replace(/\*([^*\n]+)\*/g, '$1').replace(/\s*\n\s*/g, ' ').trim();

function altText(slide, index, total) {
  const items = (slide.items ?? []).map((item) => (typeof item === 'string' ? item : [item.title, item.text].filter(Boolean).join(': ')));
  const parts = {
    cover: [slide.title, slide.subtitle],
    text: [slide.title, slide.body],
    points: [slide.title, ...items],
    quote: [slide.quote, slide.author],
    stat: [slide.value, slide.label],
    image: [slide.title, slide.caption],
    cta: [slide.title, slide.action],
  }[slide.type];
  const words = parts.filter(Boolean).map(plain).join('. ');
  return `Slide ${index + 1} of ${total}: ${words}`;
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function renderOrFail(file, options) {
  const { outDir, report } = await render(file, options);
  for (const warning of report.warnings) console.log(`  warning  ${warning.message}`);
  if (!report.ok) {
    for (const error of report.errors) console.log(`  ERROR    ${error.message}`);
    throw new Error(`${options.style ?? file} has render errors`);
  }
  return { outDir, report };
}

async function main() {
  const available = await listStyles();
  const order = [...STYLES.filter(([id]) => available.includes(id)), ...available.filter((id) => !STYLES.some(([s]) => s === id)).map((id) => [id])];

  await rm(join(DOCS, 'styles'), { recursive: true, force: true });
  await rm(join(DOCS, 'showcase'), { recursive: true, force: true });
  await mkdir(join(DOCS, 'assets/fonts'), { recursive: true });

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();

    // Draws an image (a data URL) onto a canvas of the given width and returns the canvas pixels or a WebP.
    const encodeWebp = async (png, width) => {
      const data = `data:image/png;base64,${png.toString('base64')}`;
      const url = await page.evaluate(
        async ({ data, width }) => {
          const img = new Image();
          img.src = data;
          await img.decode();
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = Math.round((width * img.naturalHeight) / img.naturalWidth);
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL('image/webp', 0.82);
        },
        { data, width },
      );
      return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
    };

    const styles = [];
    for (const [id, prompt] of order) {
      console.log(id);
      const style = await readJson(join(SKILL, 'styles', id, 'style.json'));
      const demoFile = join(SKILL, 'styles', id, 'demo/carousel.json');
      const demo = await readJson(demoFile);
      const { outDir, report } = await renderOrFail(demoFile, { out: join(OUT, 'demo', id) });

      await mkdir(join(DOCS, 'styles', id), { recursive: true });
      const slides = [];
      for (const [i, name] of report.files.png.entries()) {
        const file = `styles/${id}/${String(i + 1).padStart(2, '0')}.webp`;
        await writeFile(join(DOCS, file), await encodeWebp(await readFile(join(outDir, name)), 640));
        slides.push({ file, alt: altText(demo.slides[i], i, report.files.png.length) });
      }

      const show = await renderOrFail(SHOWCASE, { style: id, out: join(OUT, 'showcase', id) });
      const showcasePng = join(show.outDir, show.report.files.png[0]);
      await mkdir(join(DOCS, 'showcase'), { recursive: true });
      await writeFile(join(DOCS, 'showcase', `${id}.webp`), await encodeWebp(await readFile(showcasePng), 640));

      styles.push({
        id,
        name: style.name,
        summary: style.summary,
        suits: style.suits,
        prompt: prompt ?? `Make a carousel about your topic in the ${style.name} style.`,
        language: LANGUAGES[demo.lang] ?? demo.lang,
        slides,
        showcasePng,
      });
    }

    await copyFonts();
    await socialImage(browser, styles);
    await showcaseGif(page, styles);
    await writeFile(join(DOCS, 'index.html'), pageHtml(styles));
    await writeFile(join(DOCS, '.nojekyll'), '');
    await updateReadme(styles);
    console.log(`Gallery: ${styles.length} styles, ${styles.reduce((n, s) => n + s.slides.length, 0)} slides -> docs/`);
  } finally {
    await browser.close();
  }
}

async function copyFonts() {
  const fonts = [
    ['archivo/Archivo-Variable.ttf', 'Archivo-Variable.ttf'],
    ['archivo/OFL.txt', 'Archivo-OFL.txt'],
    ['ibm-plex-mono/IBMPlexMono-Regular.ttf', 'IBMPlexMono-Regular.ttf'],
    ['ibm-plex-mono/IBMPlexMono-Medium.ttf', 'IBMPlexMono-Medium.ttf'],
    ['ibm-plex-mono/OFL.txt', 'IBMPlexMono-OFL.txt'],
  ];
  for (const [from, to] of fonts) await copyFile(join(SKILL, 'fonts', from), join(DOCS, 'assets/fonts', to));
}

// 1280×640: the wordmark and a line on the left, two rows of showcase covers on the right.
async function socialImage(browser, styles) {
  const font = pathToFileURL(join(SKILL, 'fonts/archivo/Archivo-Variable.ttf')).href;
  const covers = styles.map((s) => `<img src="${pathToFileURL(s.showcasePng).href}" alt="">`).join('');
  const html = `<!doctype html><meta charset="utf-8"><style>
    @font-face { font-family: Archivo; src: url("${font}"); font-weight: 100 900; font-stretch: 62% 125%; }
    * { margin: 0; box-sizing: border-box; }
    body { width: 1280px; height: 640px; background: #dfe2e6; font-family: Archivo; display: flex; align-items: center; gap: 40px; padding: 0 48px; overflow: hidden; }
    .text { flex: 0 0 300px; }
    h1 { font-size: 64px; font-weight: 800; font-stretch: 112%; line-height: .92; letter-spacing: -.02em; }
    p { margin-top: 22px; font-size: 25px; line-height: 1.25; color: #3f454c; }
    .grid { display: grid; grid-template-columns: repeat(6, 132px); gap: 12px; transform: rotate(-4deg); }
    img { width: 132px; height: 165px; display: block; box-shadow: 0 1px 2px rgb(0 0 0 / .2), 0 10px 22px -12px rgb(0 0 0 / .45); }
  </style><div class="text"><h1>swipe-<br>styles</h1><p>Carousels in ${styles.length} styles, from one sentence.</p></div><div class="grid">${covers}</div>`;
  const file = join(OUT, 'social.html');
  await writeFile(file, html);
  const page = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map((img) => img.decode())]));
  await page.screenshot({ path: join(DOCS, 'assets/social.png') });
  await page.close();
}

// The showcase cover in every style, 1.2 s each, with the style's name under it.
async function showcaseGif(page, styles) {
  const width = 432;
  const coverHeight = 540;
  const band = 64;
  const font = await readFile(join(SKILL, 'fonts/archivo/Archivo-Variable.ttf'));
  await page.evaluate(async (fontData) => {
    const bytes = Uint8Array.from(atob(fontData), (c) => c.charCodeAt(0));
    const face = new FontFace('GalleryArchivo', bytes, { weight: '100 900' });
    document.fonts.add(await face.load());
  }, font.toString('base64'));

  const gif = GIFEncoder();
  for (const style of styles) {
    const data = `data:image/png;base64,${(await readFile(style.showcasePng)).toString('base64')}`;
    const rgba = await page.evaluate(
      async ({ data, name, width, coverHeight, band }) => {
        const img = new Image();
        img.src = data;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = coverHeight + band;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, coverHeight);
        ctx.fillStyle = '#dfe2e6';
        ctx.fillRect(0, coverHeight, width, band);
        ctx.fillStyle = '#000';
        ctx.font = '700 30px GalleryArchivo';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, 20, coverHeight + band / 2 + 1);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let binary = '';
        for (let i = 0; i < pixels.length; i += 0x8000) binary += String.fromCharCode(...pixels.subarray(i, i + 0x8000));
        return btoa(binary);
      },
      { data, name: style.name, width, coverHeight, band },
    );
    const pixels = new Uint8Array(Buffer.from(rgba, 'base64'));
    const palette = quantize(pixels, 256);
    gif.writeFrame(applyPalette(pixels, palette), width, coverHeight + band, { palette, delay: 1200 });
  }
  gif.finish();
  await writeFile(join(DOCS, 'assets/styles.gif'), gif.bytes());
}

// Replaces the table between <!-- styles:start --> and <!-- styles:end --> in README.md.
async function updateReadme(styles) {
  const file = join(ROOT, 'README.md');
  const readme = await readFile(file, 'utf8');
  const start = '<!-- styles:start -->';
  const end = '<!-- styles:end -->';
  if (!readme.includes(start) || !readme.includes(end)) throw new Error('README.md has no styles:start/styles:end markers');
  const rows = styles.map(
    (s) =>
      `| <a href="${SITE}#${s.id}"><img src="docs/showcase/${s.id}.webp" width="96" alt="${esc(s.name)}"></a> | **[${s.name}](${SITE}#${s.id})**<br>${s.summary} | ${s.suits.join(', ')} |`,
  );
  const table = ['| | style | suits |', '|---|---|---|', ...rows].join('\n');
  const before = readme.slice(0, readme.indexOf(start) + start.length);
  const after = readme.slice(readme.indexOf(end));
  await writeFile(file, `${before}\n${table}\n${after}`);
}

function strip(slides, label, { eager = false } = {}) {
  const figures = slides
    .map(
      (s) =>
        `<li><img src="${s.file}" alt="${esc(s.alt)}" width="640" height="800" loading="${eager ? 'eager' : 'lazy'}" decoding="async">${
          s.caption ? `<span>${esc(s.caption)}</span>` : ''
        }</li>`,
    )
    .join('\n          ');
  return `<div class="strip" data-strip>
        <ul class="strip-track" tabindex="0" aria-label="${esc(label)}">
          ${figures}
        </ul>
      </div>`;
}

function pageHtml(styles) {
  const count = styles.length;
  const install = '/plugin marketplace add shango-tek/swipe-styles\n/plugin install swipe-styles@swipe-styles';
  const showcase = styles.map((s) => ({ file: `showcase/${s.id}.webp`, alt: `The cover slide in the ${s.name} style`, caption: s.name }));
  const index = styles.map((s) => `<a href="#${s.id}">${esc(s.name)}</a>`).join('\n        ');
  const sections = styles
    .map(
      (s) => `
    <article class="style" id="${s.id}">
      <div class="style-text">
        <h3>${esc(s.name)}</h3>
        <p class="summary">${esc(s.summary)}</p>
        <p class="suits"><strong>Suits</strong> ${esc(s.suits.join(', '))}.</p>
        <div class="try">
          <p class="try-text">${esc(s.prompt)}</p>
          <button class="copy" type="button" data-copy="${esc(s.prompt)}">Copy</button>
        </div>
        <p class="meta">Demo in ${esc(s.language)}, ${s.slides.length} slides. <a href="${REPO}/blob/main/plugin/skills/swipe-styles/styles/${s.id}/STYLE.md">How to write for it</a></p>
      </div>
      ${strip(s.slides, `${s.name} demo carousel`)}
    </article>`,
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>swipe-styles: carousel styles for Claude Code</title>
  <meta name="description" content="An open-source Claude Code plugin: ${count} designed styles for Instagram and LinkedIn carousels. Say one sentence, get PNG slides, a PDF and a caption.">
  <meta property="og:title" content="swipe-styles: carousels in ${count} styles, from one sentence">
  <meta property="og:description" content="An open-source Claude Code plugin for Instagram and LinkedIn carousels.">
  <meta property="og:image" content="${SITE}assets/social.png">
  <meta property="og:url" content="${SITE}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='3' y='5' width='17' height='22' fill='%23000'/%3E%3Crect x='12' y='5' width='17' height='22' fill='%23dfe2e6' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="assets/site.css">
</head>
<body>
  <header class="top">
    <a class="mark" href="#top">swipe-styles</a>
    <nav aria-label="Page">
      <a href="#styles">Styles</a>
      <a href="#how">How it works</a>
      <a href="${REPO}">GitHub</a>
    </nav>
  </header>

  <main id="top">
    <section class="hero">
      <div class="hero-text">
        <h1>Carousels in ${count === 12 ? 'twelve' : count} styles, from one sentence.</h1>
        <p class="lede">swipe-styles is an open-source plugin for Claude Code. Describe your post, and it writes the slides, renders them as Instagram images and a LinkedIn PDF, and checks that every line fits.</p>
        <div class="install">
          <pre><code>${esc(install)}</code></pre>
          <button class="copy" type="button" data-copy="${esc(install)}">Copy</button>
        </div>
      </div>
      <figure class="showcase">
      ${strip(showcase, 'The same cover slide in every style', { eager: true })}
        <figcaption>The same cover slide in every style.</figcaption>
      </figure>
    </section>

    <section class="how" id="how">
      <h2>How it works</h2>
      <ol class="steps">
        <li>
          <h3>Install the plugin</h3>
          <p>Run the two commands above in Claude Code. The first carousel sets up Playwright (about 20&nbsp;MB) and uses the Chrome on your computer, or downloads a headless Chromium.</p>
        </li>
        <li>
          <h3>Say one sentence</h3>
          <p class="example">“Make an Instagram carousel about my sourdough mistakes in the Notebook style.”</p>
          <p>Claude picks an angle, writes the slides in your language, renders them and fixes any text that does not fit.</p>
        </li>
        <li>
          <h3>Post it</h3>
          <ul class="files">
            <li><code>slide-01.png</code> and onwards, 1080&nbsp;×&nbsp;1350, for Instagram</li>
            <li><code>carousel.pdf</code> for a LinkedIn document post</li>
            <li><code>caption.txt</code> with the caption and hashtags</li>
          </ul>
        </li>
      </ol>
    </section>

    <section class="styles" id="styles">
      <h2>The styles</h2>
      <p class="intro">Each style is a set of layouts for seven slide types: cover, text, points, quote, number, picture and call to action. Your handle, color and logo go on every one. The demos below are in English, French and German.</p>
      <nav class="index" aria-label="Styles">
        ${index}
      </nav>
${sections}
    </section>

    <section class="notes">
      <h2>Good to know</h2>
      <dl>
        <div><dt>Your brand</dt><dd>Add your handle, accent color and logo. Each style shows them in its own way and keeps text readable on your color.</dd></div>
        <div><dt>Any language</dt><dd>The layouts contain no fixed words. Long German and French words are hyphenated.</dd></div>
        <div><dt>Sizes</dt><dd>4:5 (1080&nbsp;×&nbsp;1350) for Instagram and LinkedIn, or square (1080&nbsp;×&nbsp;1080).</dd></div>
        <div><dt>Checked</dt><dd>The renderer reports text that does not fit, with the slide and the field, and Claude rewrites it.</dd></div>
        <div><dt>Runs on your computer</dt><dd>Rendering happens locally with Playwright. Nothing is uploaded and nothing is posted for you.</dd></div>
        <div><dt>Needs</dt><dd>Claude Code and Node.js 20 or newer.</dd></div>
      </dl>
    </section>
  </main>

  <footer class="foot">
    <p>MIT license. The fonts are open-source (SIL Open Font License); each keeps its license file. <a href="${REPO}">Source on GitHub</a>.</p>
  </footer>
  <script src="assets/site.js" defer></script>
</body>
</html>
`;
}

await main();
