#!/usr/bin/env node
// Renders a carousel.json into PNG slides, one PDF and a report.json.
//
//   node render.mjs <carousel.json> [--out <dir>] [--style <id>] [--format <id>]
//
// Exit codes: 0 rendered without problems, 2 rendered but the report has errors
// (for example text that does not fit), 1 the carousel could not be rendered.

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(HERE, '..');
const STYLES = join(SKILL, 'styles');

export const TYPES = {
  cover: { required: ['title'], optional: ['kicker', 'subtitle'] },
  text: { required: ['body'], optional: ['title', 'kicker'] },
  points: { required: ['items'], optional: ['title', 'kicker'] },
  quote: { required: ['quote'], optional: ['author', 'role'] },
  stat: { required: ['value', 'label'], optional: ['note', 'kicker'] },
  image: { required: ['src'], optional: ['title', 'caption'] },
  cta: { required: ['title'], optional: ['text', 'action'] },
};

const BRAND_KEYS = ['name', 'handle', 'accent', 'logo'];
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const LANG = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i;
const REMOTE = /^https?:\/\//i;

export class CarouselError extends Error {
  constructor(problems) {
    super(`The carousel cannot be rendered:\n- ${problems.join('\n- ')}`);
    this.problems = problems;
  }
}

function isEmpty(value) {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function words(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

async function readJson(file, what) {
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch {
    throw new CarouselError([`Cannot read ${what}: ${file}`]);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new CarouselError([`${what} is not valid JSON (${file}): ${error.message}`]);
  }
}

export async function listStyles() {
  const entries = await readdir(STYLES, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && existsSync(join(STYLES, entry.name, 'style.json')))
    .map((entry) => entry.name)
    .sort();
}

export async function loadFormats() {
  return readJson(join(SKILL, 'core', 'formats.json'), 'formats.json');
}

// Checks the structure of a carousel. Returns a list of problems, empty when it is fine.
export function validate(carousel, { formats, styles }) {
  const problems = [];
  if (!carousel || typeof carousel !== 'object' || Array.isArray(carousel)) {
    return ['The carousel must be a JSON object.'];
  }

  if (!styles.includes(carousel.style)) {
    problems.push(`Unknown style "${carousel.style}". Available styles: ${styles.join(', ')}.`);
  }

  const formatId = carousel.format ?? 'instagram';
  const format = formats[formatId];
  if (!format) {
    problems.push(`Unknown format "${formatId}". Available formats: ${Object.keys(formats).join(', ')}.`);
  }

  if (carousel.lang !== undefined && !LANG.test(carousel.lang)) {
    problems.push(`"lang" must be a language code such as "en", "de" or "fr-CA", not "${carousel.lang}".`);
  }

  if (carousel.brand !== undefined) {
    const brand = carousel.brand;
    if (!brand || typeof brand !== 'object' || Array.isArray(brand)) {
      problems.push('"brand" must be an object with name, handle, accent and logo (all optional).');
    } else {
      for (const key of Object.keys(brand)) {
        if (!BRAND_KEYS.includes(key)) problems.push(`brand: unknown field "${key}". Allowed: ${BRAND_KEYS.join(', ')}.`);
      }
      if (brand.accent !== undefined && !HEX_COLOR.test(brand.accent)) {
        problems.push(`brand.accent must be a hex color such as "#E4002B", not "${brand.accent}".`);
      }
    }
  }

  const known = new Set(['style', 'format', 'lang', 'brand', 'slides', 'caption', 'hashtags', 'topic']);
  for (const key of Object.keys(carousel)) {
    if (!known.has(key)) problems.push(`Unknown top-level field "${key}". Allowed: ${[...known].join(', ')}.`);
  }

  if (!Array.isArray(carousel.slides) || carousel.slides.length === 0) {
    problems.push('"slides" must be a list with at least one slide.');
    return problems;
  }
  if (format && carousel.slides.length > format.maxSlides) {
    problems.push(`The carousel has ${carousel.slides.length} slides, but the "${formatId}" format allows at most ${format.maxSlides}.`);
  }

  carousel.slides.forEach((slide, i) => {
    const where = `Slide ${i + 1}`;
    const spec = TYPES[slide?.type];
    if (!spec) {
      problems.push(`${where}: unknown type "${slide?.type}". Use one of: ${Object.keys(TYPES).join(', ')}.`);
      return;
    }
    for (const key of spec.required) {
      if (isEmpty(slide[key])) problems.push(`${where} (${slide.type}): "${key}" is required.`);
    }
    const allowed = ['type', ...spec.required, ...spec.optional];
    for (const key of Object.keys(slide)) {
      if (!allowed.includes(key)) problems.push(`${where} (${slide.type}): unknown field "${key}". Allowed: ${allowed.join(', ')}.`);
    }
    for (const key of allowed) {
      if (key === 'type' || key === 'items' || slide[key] === undefined) continue;
      if (typeof slide[key] !== 'string' && typeof slide[key] !== 'number') {
        problems.push(`${where} (${slide.type}): "${key}" must be text.`);
      }
    }
    if (slide.type === 'points' && slide.items !== undefined) {
      if (!Array.isArray(slide.items)) {
        problems.push(`${where} (points): "items" must be a list.`);
      } else {
        slide.items.forEach((item, n) => {
          const ok =
            typeof item === 'string' ||
            (item && typeof item === 'object' && typeof item.text === 'string' && Object.keys(item).every((k) => k === 'text' || k === 'title'));
          if (!ok) problems.push(`${where} (points): item ${n + 1} must be text, or an object with "text" and an optional "title".`);
        });
      }
    }
  });

  return problems;
}

// Word and item limits from the style's style.json. They give warnings, not errors:
// the renderer still tries to fit the text.
function limitWarnings(carousel, limits = {}) {
  const warnings = [];
  carousel.slides.forEach((slide, i) => {
    for (const [key, limit] of Object.entries(limits)) {
      const [type, field] = key.split('.');
      if (slide.type !== type || slide[field] === undefined) continue;
      const value = slide[field];
      const where = `Slide ${i + 1} (${type})`;
      if (Array.isArray(value)) {
        if (limit.count && value.length > limit.count) {
          warnings.push({ slide: i + 1, type, kind: 'limit', message: `${where}: ${value.length} items; this style looks best with at most ${limit.count}.` });
        }
        value.forEach((item, n) => {
          const text = typeof item === 'string' ? item : `${item.title ?? ''} ${item.text ?? ''}`;
          if (limit.words && words(text) > limit.words) {
            warnings.push({ slide: i + 1, type, kind: 'limit', message: `${where}: item ${n + 1} has ${words(text)} words; keep it to ${limit.words}.` });
          }
        });
      } else if (limit.words && words(value) > limit.words) {
        warnings.push({ slide: i + 1, type, kind: 'limit', message: `${where}: "${field}" has ${words(value)} words; keep it to ${limit.words}.` });
      }
    }
  });
  return warnings;
}

function toUrl(src, baseDir, problems, where) {
  if (REMOTE.test(src)) return src;
  const file = resolve(baseDir, src);
  if (!existsSync(file)) {
    problems.push(`${where}: the file does not exist: ${file}`);
    return undefined;
  }
  return pathToFileURL(file).href;
}

function escapeAttr(text) {
  return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function deckHtml({ lang, format, styleDir, layouts, accent, data }) {
  const link = (file) => `<link rel="stylesheet" href="${pathToFileURL(file).href}">`;
  const vars = `--slide-w:${format.width}px;--slide-h:${format.height}px;${accent ? `--accent:${accent};` : ''}`;
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="${escapeAttr(lang)}">
<head>
<meta charset="utf-8">
${link(join(SKILL, 'core', 'base.css'))}
${link(join(styleDir, 'style.css'))}
<style>:root{${vars}}@page{size:${format.width}px ${format.height}px;margin:0}</style>
</head>
<body>
<main id="deck"></main>
${layouts}
<script type="application/json" id="swipe-data">${json}</script>
<script src="${pathToFileURL(join(SKILL, 'core', 'fill.js')).href}"></script>
</body>
</html>
`;
}

function launchOptions() {
  // SWIPE_BROWSER_CHANNEL=chrome uses the Chrome that is already installed,
  // instead of the Chromium that Playwright downloads.
  const channel = process.env.SWIPE_BROWSER_CHANNEL;
  return channel ? { channel } : {};
}

export async function render(file, options = {}) {
  const source = resolve(file);
  const baseDir = dirname(source);
  const carousel = await readJson(source, 'The carousel file');
  if (options.style) carousel.style = options.style;
  if (options.format) carousel.format = options.format;

  const formats = await loadFormats();
  const styles = await listStyles();
  const problems = validate(carousel, { formats, styles });
  if (problems.length > 0) throw new CarouselError(problems);

  const formatId = carousel.format ?? 'instagram';
  const format = formats[formatId];
  const styleDir = join(STYLES, carousel.style);
  const style = await readJson(join(styleDir, 'style.json'), 'style.json');
  const layouts = await readFile(join(styleDir, 'layouts.html'), 'utf8');

  for (const type of new Set(carousel.slides.map((slide) => slide.type))) {
    if (!layouts.includes(`data-type="${type}"`)) {
      problems.push(`The style "${carousel.style}" has no layout for "${type}" slides. It supports: ${style.types.join(', ')}.`);
    }
  }

  const brand = { ...(carousel.brand ?? {}) };
  if (brand.logo) brand.logo = toUrl(brand.logo, baseDir, problems, 'brand.logo');
  const slides = carousel.slides.map((slide, i) =>
    slide.type === 'image' ? { ...slide, src: toUrl(slide.src, baseDir, problems, `Slide ${i + 1} (image)`) } : slide,
  );
  if (problems.length > 0) throw new CarouselError(problems);

  const outDir = resolve(options.out ?? join(baseDir, 'slides'));
  const buildDir = join(outDir, '.swipe');
  await mkdir(buildDir, { recursive: true });
  for (const name of await readdir(outDir)) {
    if (/^slide-\d+\.png$/.test(name) || name === 'carousel.pdf' || name === 'report.json') await rm(join(outDir, name));
  }

  const deckFile = join(buildDir, 'deck.html');
  await writeFile(
    deckFile,
    deckHtml({ lang: carousel.lang ?? 'en', format, styleDir, layouts, accent: brand.accent, data: { slides, brand } }),
  );

  const { chromium } = await import('playwright');
  const browser = await chromium.launch(launchOptions());
  let result;
  const png = [];
  try {
    const page = await browser.newPage({ viewport: { width: format.width, height: format.height }, deviceScaleFactor: 1 });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(pathToFileURL(deckFile).href);
    await page.waitForFunction(() => window.__swipe?.ready === true, null, { timeout: 60_000 });
    result = await page.evaluate(() => window.__swipe);
    for (const message of pageErrors) result.errors.push({ kind: 'script', message });

    const nodes = page.locator('.slide');
    const count = await nodes.count();
    for (let i = 0; i < count; i++) {
      const name = `slide-${pad(i + 1)}.png`;
      await nodes.nth(i).screenshot({ path: join(outDir, name), animations: 'disabled' });
      png.push(name);
    }
    await page.pdf({
      path: join(outDir, 'carousel.pdf'),
      width: `${format.width}px`,
      height: `${format.height}px`,
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }

  const report = {
    ok: result.errors.length === 0,
    style: carousel.style,
    format: formatId,
    size: `${format.width}x${format.height}`,
    slides: png.length,
    errors: result.errors,
    warnings: [...limitWarnings(carousel, style.limits), ...result.warnings],
    files: { png, pdf: 'carousel.pdf' },
  };
  await writeFile(join(outDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  return { outDir, report };
}

const USAGE = `Usage: node render.mjs <carousel.json> [--out <dir>] [--style <id>] [--format <id>]

Renders the carousel into <dir> (default: a "slides" folder next to the file):
  slide-01.png, slide-02.png, ...   one PNG per slide
  carousel.pdf                      all slides, for a LinkedIn document post
  report.json                       errors and warnings to fix`;

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      out: { type: 'string' },
      style: { type: 'string' },
      format: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
  });
  if (values.help || positionals.length !== 1) {
    console.log(USAGE);
    process.exit(values.help ? 0 : 1);
  }

  try {
    const { outDir, report } = await render(positionals[0], values);
    console.log(`Rendered ${report.slides} slides (${report.style}, ${report.format} ${report.size}) to ${outDir}`);
    for (const error of report.errors) console.log(`ERROR    ${error.message}`);
    for (const warning of report.warnings) console.log(`warning  ${warning.message}`);
    process.exit(report.ok ? 0 : 2);
  } catch (error) {
    if (error instanceof CarouselError) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
