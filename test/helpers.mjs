// Helpers shared by the tests. Not a test file itself (it does not end in .test.mjs).

import { execFile } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SKILL = join(ROOT, 'plugin/skills/swipe-styles');
export const STYLES = join(SKILL, 'styles');
export const FIXTURES = join(ROOT, 'test/fixtures');
const RENDER = join(SKILL, 'core/render.mjs');

// Runs the renderer as a user would, in a fresh temporary output folder.
export async function renderFile(file, args = []) {
  const out = await mkdtemp(join(tmpdir(), 'swipe-'));
  return new Promise((resolve) => {
    execFile(process.execPath, [RENDER, file, '--out', out, ...args], (error, stdout, stderr) => {
      resolve({ out, code: error ? error.code : 0, stdout, stderr });
    });
  });
}

export async function readReport(out) {
  return JSON.parse(await readFile(join(out, 'report.json'), 'utf8'));
}

// Width and height from the IHDR chunk of a PNG file.
export function pngSize(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

// Counts the page objects in a PDF (/Type /Page, but not /Type /Pages).
export function pdfPageCount(buffer) {
  return (buffer.toString('latin1').match(/\/Type\s*\/Page(?![a-zA-Z])/g) ?? []).length;
}
