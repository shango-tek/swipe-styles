// Where the renderer finds Playwright, and which browser it starts.
//
// Installed as a Claude Code plugin, the skill has no node_modules of its own. scripts/setup.mjs
// installs the Playwright version pinned in runtime/package.json into a data folder and writes
// config.json there with the browser to use:
//
//   $SWIPE_STYLES_HOME, or ~/.cache/swipe-styles ($XDG_CACHE_HOME/swipe-styles when set)
//     runtime/node_modules/playwright
//     config.json   { "playwright": "1.65.1", "channel": "chrome" }   (no channel: Playwright's Chromium)
//
// In a checkout of the repository, Playwright comes from the project's own node_modules instead.

import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const SETUP_SCRIPT = join(SKILL, 'scripts', 'setup.mjs');

// Exit code of render.mjs and setup.mjs --check when the one-time setup is needed.
export const SETUP_EXIT = 3;

export class SetupNeeded extends Error {
  constructor(reason) {
    super(`${reason}\nRun the one-time setup: node "${SETUP_SCRIPT}"`);
    this.reason = reason;
  }
}

export function pinnedVersion() {
  return JSON.parse(readFileSync(join(SKILL, 'runtime', 'package.json'), 'utf8')).dependencies.playwright;
}

export function homeDir() {
  if (process.env.SWIPE_STYLES_HOME) return resolve(process.env.SWIPE_STYLES_HOME);
  return join(process.env.XDG_CACHE_HOME || join(homedir(), '.cache'), 'swipe-styles');
}

export const runtimeDir = () => join(homeDir(), 'runtime');
export const configFile = () => join(homeDir(), 'config.json');

// The Playwright version installed in the data folder, or undefined.
export function installedVersion() {
  const file = join(runtimeDir(), 'node_modules', 'playwright', 'package.json');
  if (!existsSync(file)) return undefined;
  return JSON.parse(readFileSync(file, 'utf8')).version;
}

export function readConfig() {
  try {
    return JSON.parse(readFileSync(configFile(), 'utf8'));
  } catch {
    return {};
  }
}

export async function loadPlaywright() {
  const installed = installedVersion();
  if (installed) {
    const pinned = pinnedVersion();
    if (installed !== pinned) {
      throw new SetupNeeded(`Playwright ${installed} is installed, but this version of swipe-styles needs ${pinned}.`);
    }
    return createRequire(join(runtimeDir(), 'package.json'))('playwright');
  }
  try {
    return await import('playwright');
  } catch (error) {
    if (error?.code === 'ERR_MODULE_NOT_FOUND' && /'playwright'/.test(error.message)) {
      throw new SetupNeeded('Playwright is not installed yet.');
    }
    throw error;
  }
}

// SWIPE_BROWSER_CHANNEL=chrome starts the Google Chrome that is installed on the computer,
// whatever setup chose.
export function launchOptions() {
  const channel = process.env.SWIPE_BROWSER_CHANNEL || readConfig().channel;
  return channel ? { channel } : {};
}

const MISSING_BROWSER = /Executable doesn't exist|distribution '[^']+' is not found/i;

export async function launchBrowser(options = launchOptions()) {
  const { chromium } = await loadPlaywright();
  try {
    return await chromium.launch(options);
  } catch (error) {
    if (MISSING_BROWSER.test(error.message)) {
      const which = options.channel ? `The browser "${options.channel}"` : "Playwright's Chromium";
      throw new SetupNeeded(`${which} is not installed.`);
    }
    throw error;
  }
}
