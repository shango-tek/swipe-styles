#!/usr/bin/env node
// One-time setup for the swipe-styles renderer, once per computer.
//
//   node setup.mjs                      install what is missing and pick a browser
//   node setup.mjs --check              only check: exit 0 when rendering works, 3 when setup is needed
//   node setup.mjs --browser chrome     use the Google Chrome that is installed on this computer
//   node setup.mjs --browser chromium   use Playwright's Chromium, and download it when it is missing
//
// It writes only to its data folder, ~/.cache/swipe-styles (or $SWIPE_STYLES_HOME):
//   runtime/      the Playwright version pinned in ../runtime/package-lock.json (npm ci --ignore-scripts)
//   config.json   the browser to use
// Browser, by default: Playwright's Chromium when it is already installed, otherwise Google Chrome
// when it is on this computer, otherwise Playwright downloads its headless Chromium
// (about 100 MB, 300 MB on disk, into Playwright's own cache folder).
//
// Exit codes: 0 ready, 1 setup failed, 3 (--check only) setup is needed.

import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import {
  configFile,
  homeDir,
  installedVersion,
  launchBrowser,
  launchOptions,
  loadPlaywright,
  pinnedVersion,
  runtimeDir,
  SETUP_EXIT,
  SetupNeeded,
} from '../core/runtime.mjs';

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MIN_NODE = 20;

const BROWSERS = {
  chromium: { label: "Playwright's Chromium", options: {} },
  chrome: { label: 'Google Chrome', options: { channel: 'chrome' } },
};

const USAGE = `Usage: node setup.mjs [--check] [--browser auto|chromium|chrome]

Installs Playwright ${pinnedVersion()} into ${homeDir()}
and picks the browser that renders the slides.
  --check     only check; exit 0 when rendering works, 3 when setup is needed
  --browser   auto (default): Playwright's Chromium if installed, else Google Chrome, else download Chromium
              chromium: Playwright's Chromium, downloaded when missing
              chrome: the Google Chrome installed on this computer`;

function fail(message) {
  console.error(`Setup failed: ${message}`);
  process.exit(1);
}

function firstLine(text) {
  return String(text).split('\n').find((line) => line.trim()) ?? '';
}

function labelFor(options) {
  if (!options.channel) return BROWSERS.chromium.label;
  return options.channel === 'chrome' ? BROWSERS.chrome.label : `the "${options.channel}" browser`;
}

function checkNode() {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < MIN_NODE) {
    fail(`Node.js ${process.versions.node} is too old. Install Node.js ${MIN_NODE} or newer: https://nodejs.org`);
  }
}

// Starts the browser and renders a tiny page. Returns { ok, reason }.
async function tryBrowser(options) {
  let browser;
  try {
    browser = await launchBrowser(options);
    const page = await browser.newPage();
    await page.setContent('<p>ok</p>');
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error instanceof SetupNeeded ? error.reason : firstLine(error.message) };
  } finally {
    await browser?.close().catch(() => {});
  }
}

function installPlaywright(pinned) {
  const dir = runtimeDir();
  console.log(`Installing Playwright ${pinned} into ${dir} ...`);
  mkdirSync(dir, { recursive: true });
  for (const name of ['package.json', 'package-lock.json']) {
    copyFileSync(join(SKILL, 'runtime', name), join(dir, name));
  }
  // npm ci installs exactly the versions and hashes in the lock file; --ignore-scripts runs no install scripts.
  const npm = spawnSync('npm', ['ci', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', '--loglevel=error'], {
    cwd: dir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (npm.error?.code === 'ENOENT') fail(`npm was not found. Install Node.js ${MIN_NODE} or newer (it includes npm): https://nodejs.org`);
  if (npm.status !== 0) fail('npm could not install Playwright. Check the internet connection (or the npm proxy settings) and run setup again.');
}

function downloadChromium() {
  console.log("Downloading Playwright's headless Chromium (about 100 MB, 300 MB on disk; this can take a few minutes) ...");
  const cli = join(runtimeDir(), 'node_modules', 'playwright', 'cli.js');
  const run = spawnSync(process.execPath, [cli, 'install', '--only-shell', 'chromium'], { stdio: 'inherit' });
  if (run.status !== 0) fail('the Chromium download did not finish. Check the internet connection and run setup again.');
}

function saveConfig(pinned, options) {
  mkdirSync(homeDir(), { recursive: true });
  const config = { playwright: pinned, ...(options.channel ? { channel: options.channel } : {}) };
  writeFileSync(configFile(), `${JSON.stringify(config, null, 2)}\n`);
}

async function check() {
  checkNode();
  try {
    await loadPlaywright();
  } catch (error) {
    if (!(error instanceof SetupNeeded)) throw error;
    console.log(`Setup needed: ${error.reason}`);
    process.exit(SETUP_EXIT);
  }
  const options = launchOptions();
  const result = await tryBrowser(options);
  if (!result.ok) {
    console.log(`Setup needed: ${result.reason}`);
    process.exit(SETUP_EXIT);
  }
  console.log(`Ready: Playwright ${installedVersion() ?? '(from this project)'} with ${labelFor(options)}.`);
}

async function setup(wanted) {
  checkNode();
  const pinned = pinnedVersion();
  console.log(`Data folder: ${homeDir()}`);

  if (installedVersion() === pinned) {
    console.log(`Playwright ${pinned} is installed.`);
  } else {
    installPlaywright(pinned);
  }

  const candidates = wanted === 'auto' ? [BROWSERS.chromium, BROWSERS.chrome] : [BROWSERS[wanted]];
  for (const candidate of candidates) {
    const result = await tryBrowser(candidate.options);
    if (result.ok) {
      saveConfig(pinned, candidate.options);
      console.log(`${candidate.label} is already on this computer, so no browser was downloaded.`);
      return candidate.label;
    }
    console.log(`${candidate.label}: not usable (${result.reason})`);
  }

  if (wanted === 'chrome') fail('Google Chrome was not found. Install it, or run setup with --browser chromium.');
  downloadChromium();
  const result = await tryBrowser(BROWSERS.chromium.options);
  if (!result.ok) fail(`Chromium was downloaded but does not start: ${result.reason}`);
  saveConfig(pinned, BROWSERS.chromium.options);
  console.log("Playwright's headless Chromium was downloaded into Playwright's cache folder.");
  return BROWSERS.chromium.label;
}

async function main() {
  let values;
  try {
    ({ values } = parseArgs({
      options: {
        check: { type: 'boolean' },
        browser: { type: 'string', default: 'auto' },
        help: { type: 'boolean', short: 'h' },
      },
    }));
  } catch (error) {
    console.error(`${error.message}\n\n${USAGE}`);
    process.exit(1);
  }
  if (values.help) {
    console.log(USAGE);
    return;
  }
  if (!['auto', 'chromium', 'chrome'].includes(values.browser)) {
    console.error(`Unknown browser "${values.browser}".\n\n${USAGE}`);
    process.exit(1);
  }

  if (values.check) {
    await check();
    return;
  }

  const label = await setup(values.browser);
  console.log(`Ready: Playwright ${pinnedVersion()} with ${label}.`);
  if (process.env.SWIPE_BROWSER_CHANNEL) {
    console.log(`Note: SWIPE_BROWSER_CHANNEL=${process.env.SWIPE_BROWSER_CHANNEL} is set and wins over this choice.`);
  }
}

await main();
