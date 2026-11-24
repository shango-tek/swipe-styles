#!/usr/bin/env node
// Renders the demo carousel of every style (or of the styles named on the command line)
// into out/demos/<style>/ and copies its overview (all slides on one sheet) to out/demos/<style>.png
//
//   node tools/render-demos.mjs              all styles
//   node tools/render-demos.mjs swiss-grid   one style

import { copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  await copyFile(join(outDir, report.files.overview), join(OUT, `${id}.png`));
}

process.exit(failed ? 2 : 0);
