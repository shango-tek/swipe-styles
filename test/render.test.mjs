import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';

import { listStyles, validate } from '../plugin/skills/swipe-styles/core/render.mjs';
import { FIXTURES, pdfPageCount, pngSize, readReport, renderFile, SKILL } from './helpers.mjs';

test('renders one PNG per slide at the format size, a PDF with one page per slide, and a clean report', async () => {
  const { out, code, stdout } = await renderFile(join(FIXTURES, 'basic.json'));
  assert.equal(code, 0, stdout);

  const report = await readReport(out);
  assert.equal(report.ok, true);
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.files.png, ['slide-01.png', 'slide-02.png', 'slide-03.png']);
  for (const name of report.files.png) {
    assert.deepEqual(pngSize(await readFile(join(out, name))), { width: 1080, height: 1350 });
  }
  assert.equal(pdfPageCount(await readFile(join(out, 'carousel.pdf'))), 3);
});

test('writes the caption with hashtags, and an overview with all slides on one image', async () => {
  const { out, code, stdout } = await renderFile(join(FIXTURES, 'basic.json'));
  assert.equal(code, 0, stdout);
  const report = await readReport(out);
  assert.equal(report.files.caption, 'caption.txt');
  assert.equal(
    await readFile(join(out, 'caption.txt'), 'utf8'),
    'Three rules that ended our underpaid projects.\n\nSave this for your next quote.\n\n#designbusiness #pricing #freelancedesign\n',
  );
  // 3 thumbnails of 340x425 px side by side, 20 px apart, with 32 px padding.
  assert.deepEqual(pngSize(await readFile(join(out, report.files.overview))), { width: 1124, height: 489 });
});

test('--styles lists every style with what it suits', async () => {
  const { stdout } = await new Promise((resolve) => {
    execFile(process.execPath, [join(SKILL, 'core/render.mjs'), '--styles'], (error, out) => resolve({ error, stdout: out }));
  });
  for (const id of await listStyles()) assert.match(stdout, new RegExp(`^${id} \\(.+\\): .+ Suits: .+\\.$`, 'm'));
});

test('--format square renders 1080x1080 slides', async () => {
  const { out, code, stdout } = await renderFile(join(FIXTURES, 'basic.json'), ['--format', 'square']);
  assert.equal(code, 0, stdout);
  assert.deepEqual(pngSize(await readFile(join(out, 'slide-01.png'))), { width: 1080, height: 1080 });
});

test('applies the brand accent color', async () => {
  const { out, code } = await renderFile(join(FIXTURES, 'basic.json'));
  assert.equal(code, 0);
  const deck = await readFile(join(out, '.swipe/deck.html'), 'utf8');
  assert.match(deck, /--accent:#0F766E;/);
});

test('loads the brand logo from a path next to the carousel', async () => {
  const { out, code, stdout } = await renderFile(join(FIXTURES, 'brand-logo.json'));
  assert.equal(code, 0, stdout);
  assert.deepEqual((await readReport(out)).errors, []);
  const deck = await readFile(join(out, '.swipe/deck.html'), 'utf8');
  assert.match(deck, /"logo":"file:\/\/[^"]+\/square\.svg"/);
});

test('shrinks a long headline until it fits, without an error', async () => {
  const { out, code, stdout } = await renderFile(join(FIXTURES, 'long-title.json'));
  assert.equal(code, 0, stdout);
  const report = await readReport(out);
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.some((w) => w.kind === 'limit'), 'expected a word-limit warning');
});

test('reports text that cannot fit, with the slide and the field', async () => {
  const { out, code } = await renderFile(join(FIXTURES, 'overflow.json'));
  assert.equal(code, 2);
  const report = await readReport(out);
  assert.equal(report.ok, false);
  const error = report.errors.find((e) => e.kind === 'overflow');
  assert.ok(error, 'expected an overflow error');
  assert.equal(error.slide, 1);
  assert.ok(error.fields.includes('title'), `fields: ${error.fields}`);
});

test('hyphenates long German words so they fit', async () => {
  const { out, code, stdout } = await renderFile(join(FIXTURES, 'de.json'));
  assert.equal(code, 0, stdout);
  assert.deepEqual((await readReport(out)).errors, []);
});

test('renders a local image', async () => {
  const { out, code, stdout } = await renderFile(join(FIXTURES, 'image.json'));
  assert.equal(code, 0, stdout);
  assert.deepEqual((await readReport(out)).errors, []);
});

test('rejects an image file that does not exist', async () => {
  const { code, stderr } = await renderFile(join(FIXTURES, 'image-missing.json'));
  assert.equal(code, 1);
  assert.match(stderr, /Slide 1 \(image\): the file does not exist/);
});

test('rejects an invalid carousel and names each problem', async () => {
  const { code, stderr } = await renderFile(join(FIXTURES, 'invalid.json'));
  assert.equal(code, 1);
  assert.match(stderr, /Slide 1: unknown type "slide"/);
  assert.match(stderr, /Slide 2 \(cover\): "title" is required/);
  assert.match(stderr, /Slide 2 \(cover\): unknown field "subtitel"/);
  assert.match(stderr, /brand\.accent must be a hex color/);
});

test('validate() accepts a minimal carousel and refuses too many slides', () => {
  const formats = { instagram: { width: 1080, height: 1350, maxSlides: 20 } };
  const styles = ['swiss-grid'];
  const slide = { type: 'cover', title: 'Hello' };
  assert.deepEqual(validate({ style: 'swiss-grid', slides: [slide] }, { formats, styles }), []);

  const problems = validate({ style: 'swiss-grid', slides: Array(21).fill(slide) }, { formats, styles });
  assert.match(problems.join('\n'), /allows at most 20/);

  const captionProblems = validate({ style: 'swiss-grid', slides: [slide], caption: 7, hashtags: '#a #b' }, { formats, styles });
  assert.match(captionProblems.join('\n'), /"caption" must be text/);
  assert.match(captionProblems.join('\n'), /"hashtags" must be a list/);
});
