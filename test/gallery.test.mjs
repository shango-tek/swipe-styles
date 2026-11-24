// The gallery in docs/ and the styles table in README.md are built by tools/build-gallery.mjs.
// These tests fail when they are out of date (for example after adding a style), or when the page
// links to a file that does not exist. Fix: tools/docker.sh npm run gallery

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { listStyles } from '../plugin/skills/swipe-styles/core/render.mjs';
import { ROOT } from './helpers.mjs';

const DOCS = join(ROOT, 'docs');
const styles = await listStyles();
const page = () => readFileSync(join(DOCS, 'index.html'), 'utf8');

test('the gallery has a section for every style', () => {
  const html = page();
  for (const id of styles) assert.match(html, new RegExp(`<article class="style" id="${id}">`), `no section for ${id}`);
});

test('every local file the gallery uses exists', () => {
  const links = [...page().matchAll(/(?:src|href)="([^"#:]+)"/g)].map((match) => match[1]);
  const css = readFileSync(join(DOCS, 'assets/site.css'), 'utf8');
  const fonts = [...css.matchAll(/url\("([^"]+)"\)/g)].map((match) => `assets/${match[1]}`);
  assert.ok(links.length > 50, `found ${links.length} links`);
  for (const file of [...links, ...fonts]) assert.ok(existsSync(join(DOCS, file)), `missing docs/${file}`);
});

test('the README lists every style and its images exist', () => {
  const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
  const table = readme.slice(readme.indexOf('<!-- styles:start -->'), readme.indexOf('<!-- styles:end -->'));
  for (const id of styles) assert.ok(table.includes(`docs/showcase/${id}.webp`), `README has no row for ${id}`);
  for (const [, file] of readme.matchAll(/(?:src="|\]\()(docs\/[^")]+)/g)) {
    assert.ok(existsSync(join(ROOT, file)), `README links to missing ${file}`);
  }
});
