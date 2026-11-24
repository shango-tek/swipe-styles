// Checks every style in styles/: its files, its layouts and its demo carousel.

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';

import { listStyles, TYPES } from '../plugin/skills/swipe-styles/core/render.mjs';
import { readReport, renderFile, SKILL, STYLES } from './helpers.mjs';

const styles = await listStyles();

test('there is at least one style', () => {
  assert.ok(styles.length > 0);
});

for (const id of styles) {
  const dir = join(STYLES, id);

  test(`${id}: has its files, a layout for every slide type, and licensed fonts`, async () => {
    for (const file of ['style.json', 'style.css', 'layouts.html', 'STYLE.md', 'demo/carousel.json']) {
      assert.ok(existsSync(join(dir, file)), `missing ${file}`);
    }
    const style = JSON.parse(await readFile(join(dir, 'style.json'), 'utf8'));
    assert.equal(style.id, id);
    assert.deepEqual([...style.types].sort(), Object.keys(TYPES).sort());

    const layouts = await readFile(join(dir, 'layouts.html'), 'utf8');
    for (const type of style.types) assert.match(layouts, new RegExp(`data-type="${type}"`), `no layout for ${type}`);

    for (const font of style.fonts) {
      assert.ok(existsSync(join(SKILL, font.folder, 'OFL.txt')), `no license file for ${font.family}`);
    }
  });

  test(`${id}: the demo uses every slide type and renders without errors`, async () => {
    const demo = join(dir, 'demo/carousel.json');
    const carousel = JSON.parse(await readFile(demo, 'utf8'));
    assert.equal(carousel.style, id);
    assert.deepEqual([...new Set(carousel.slides.map((s) => s.type))].sort(), Object.keys(TYPES).sort());

    const { out, code, stdout } = await renderFile(demo);
    assert.equal(code, 0, stdout);
    const report = await readReport(out);
    assert.deepEqual(report.errors, []);
    assert.equal(report.slides, carousel.slides.length);
  });
}
