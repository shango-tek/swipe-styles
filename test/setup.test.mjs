// First-run behavior. These tests copy the skill out of the project, so that it has no node_modules
// above it, like a plugin that Claude Code installed. They need no network: they check that a missing
// or outdated setup is reported with exit code 3 and the setup command, instead of a crash.

import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { before, test } from 'node:test';

import { FIXTURES, SKILL } from './helpers.mjs';

const CAROUSEL = join(FIXTURES, 'basic.json');
let installed;

before(async () => {
  installed = join(await mkdtemp(join(tmpdir(), 'swipe-plugin-')), 'swipe-styles');
  await cp(SKILL, installed, { recursive: true });
});

const emptyHome = () => mkdtemp(join(tmpdir(), 'swipe-home-'));

function run(script, args, env = {}) {
  return new Promise((resolve) => {
    execFile(process.execPath, [script, ...args], { env: { ...process.env, ...env } }, (error, stdout, stderr) => {
      resolve({ code: error ? error.code : 0, stdout, stderr });
    });
  });
}

test('an installed plugin without setup asks for the setup instead of crashing', async () => {
  const out = await mkdtemp(join(tmpdir(), 'swipe-out-'));
  const result = await run(join(installed, 'core/render.mjs'), [CAROUSEL, '--out', out], { SWIPE_STYLES_HOME: await emptyHome() });
  assert.equal(result.code, 3, result.stderr);
  assert.match(result.stderr, /Playwright is not installed yet/);
  assert.match(result.stderr, /Run the one-time setup: node ".*scripts\/setup\.mjs"/);
});

test('setup --check reports that the setup is needed', async () => {
  const result = await run(join(installed, 'scripts/setup.mjs'), ['--check'], { SWIPE_STYLES_HOME: await emptyHome() });
  assert.equal(result.code, 3, result.stdout + result.stderr);
  assert.match(result.stdout, /Setup needed: Playwright is not installed yet/);
});

test('a Playwright version other than the pinned one asks for the setup again', async () => {
  const home = await emptyHome();
  const fake = join(home, 'runtime/node_modules/playwright');
  await mkdir(fake, { recursive: true });
  await writeFile(join(fake, 'package.json'), '{ "name": "playwright", "version": "0.0.1" }');
  const result = await run(join(installed, 'core/render.mjs'), [CAROUSEL], { SWIPE_STYLES_HOME: home });
  assert.equal(result.code, 3, result.stderr);
  assert.match(result.stderr, /Playwright 0\.0\.1 is installed, but this version of swipe-styles needs \d+\.\d+\.\d+/);
});

test('a configured browser that is not installed asks for the setup', async () => {
  const home = await emptyHome();
  await writeFile(join(home, 'config.json'), '{ "channel": "chrome" }');
  const out = await mkdtemp(join(tmpdir(), 'swipe-out-'));
  const result = await run(join(SKILL, 'core/render.mjs'), [CAROUSEL, '--out', out], { SWIPE_STYLES_HOME: home });
  assert.equal(result.code, 3, result.stderr);
  assert.match(result.stderr, /The browser "chrome" is not installed/);
});

test('setup --check passes in this project, where Playwright and its Chromium are installed', async () => {
  const result = await run(join(SKILL, 'scripts/setup.mjs'), ['--check'], { SWIPE_STYLES_HOME: await emptyHome() });
  assert.equal(result.code, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Ready: Playwright \(from this project\) with Playwright's Chromium/);
});
