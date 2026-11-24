// The plugin packaging: the marketplace, the plugin manifest, SKILL.md and the pinned Playwright version.

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { ROOT, SKILL } from './helpers.mjs';

const readJson = (file) => JSON.parse(readFileSync(join(ROOT, file), 'utf8'));
const skillText = () => readFileSync(join(SKILL, 'SKILL.md'), 'utf8');

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, 'SKILL.md starts with a frontmatter block');
  return Object.fromEntries(
    match[1].split('\n').map((line) => {
      const colon = line.indexOf(': ');
      return [line.slice(0, colon), line.slice(colon + 2)];
    }),
  );
}

test('the marketplace lists the plugin folder, and the names agree', () => {
  const market = readJson('.claude-plugin/marketplace.json');
  const plugin = readJson('plugin/.claude-plugin/plugin.json');
  assert.ok(market.owner?.name, 'the marketplace has an owner');
  assert.equal(market.plugins.length, 1);
  const [entry] = market.plugins;
  assert.equal(entry.name, plugin.name);
  assert.equal(entry.source, './plugin');
  assert.ok(existsSync(join(ROOT, entry.source, '.claude-plugin/plugin.json')));
  assert.match(plugin.version, /^\d+\.\d+\.\d+$/);
});

test('SKILL.md has a name and a description that loads as plain YAML', () => {
  const fields = frontmatter(skillText());
  assert.equal(fields.name, 'swipe-styles');
  assert.ok(fields.description.length >= 200 && fields.description.length <= 1024, `${fields.description.length} characters`);
  assert.doesNotMatch(fields.description, /[<>]|: /, 'no angle brackets, and no ": " that would break a plain YAML value');
});

test('every file that SKILL.md runs or reads exists', () => {
  const paths = [...skillText().matchAll(/\$\{CLAUDE_SKILL_DIR\}\/([^\s"`]+)/g)].map((match) => match[1]);
  assert.ok(paths.length >= 4, `found ${paths.length} paths`);
  for (const path of paths) {
    assert.ok(existsSync(join(SKILL, path.replace('<id>', 'swiss-grid'))), `${path} exists`);
  }
});

test('users, the project and the Docker image use the same Playwright version', () => {
  const pinned = JSON.parse(readFileSync(join(SKILL, 'runtime/package.json'), 'utf8')).dependencies.playwright;
  const lock = JSON.parse(readFileSync(join(SKILL, 'runtime/package-lock.json'), 'utf8'));
  assert.equal(readJson('package.json').dependencies.playwright, pinned);
  assert.equal(lock.packages['node_modules/playwright'].version, pinned);
  assert.equal(lock.packages['node_modules/playwright-core'].version, pinned);
  assert.ok(readFileSync(join(ROOT, 'tools/docker.sh'), 'utf8').includes(`playwright:v${pinned}-`), 'tools/docker.sh pins the same image');
});
