#!/usr/bin/env node
// Renders the demo carousel of every style (or of the styles named on the command line)
// into out/demos/<style>/ and puts all its slides on one contact sheet: out/demos/<style>.png
//
//   node tools/render-demos.mjs              all styles
//   node tools/render-demos.mjs swiss-grid   one style

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium } from 'playwright';

import { listStyles, render } from '../plugin/skills/swipe-styles/core/render.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STYLES = join(ROOT, 'plugin/skills/swipe-styles/styles');
const OUT = join(ROOT, 'out/demos');

const ids = process.argv.length > 2 ? process.argv.slice(2) : await listStyles();
let failed = false;

for (const id of ids) {
  const { outDir, report } = await render(join(STYLES, id, 'demo/carousel.json'), { out: join(OUT, id) });
  console.log(`${id}: ${report.slides} slides, ${report.errors.length} errors, ${report.warnings.length} warnings`);
  for (const error of report.errors) console.log(`  ERROR    ${error.message}`);
  for (const warning of report.warnings) console.log(`  warning  ${warning.message}`);
  if (!report.ok) failed = true;
  await contactSheet(id, outDir, report);
}

process.exit(failed ? 2 : 0);

async function contactSheet(id, outDir, report) {
  const [width, height] = report.size.split('x').map(Number);
  const thumb = 340;
  const images = report.files.png
    .map((name) => `<img src="${pathToFileURL(join(outDir, name)).href}" width="${thumb}" height="${Math.round((thumb * height) / width)}">`)
    .join('\n');
  const html = `<!doctype html><meta charset="utf-8">
<style>
  body { margin: 0; padding: 32px; background: #d6d6d6; font: 600 22px/1.2 sans-serif; width: ${4 * thumb + 3 * 20 + 64}px; }
  h1 { font: inherit; margin: 0 0 20px; }
  div { display: grid; grid-template-columns: repeat(4, ${thumb}px); gap: 20px; }
  img { display: block; box-shadow: 0 1px 3px rgb(0 0 0 / 0.25); }
</style>
<h1>${id}</h1>
<div>${images}</div>`;

  const file = join(outDir, '.swipe/sheet.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 4 * thumb + 3 * 20 + 64, height: 800 } });
    await page.goto(pathToFileURL(file).href);
    await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode())));
    await page.screenshot({ path: join(OUT, `${id}.png`), fullPage: true });
  } finally {
    await browser.close();
  }
}
