#!/usr/bin/env node
// Runs the CLI against throwaway projects. Zero dependencies.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(ROOT, 'bin', 'ai-instructions.mjs');
const VERSION = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
const dirs = [];

const run = (cwd, ...args) => spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
const runWithHome = (home, ...args) =>
  spawnSync(process.execPath, [CLI, ...args], { cwd: home, encoding: 'utf8', env: { ...process.env, HOME: home, USERPROFILE: home } });
const read = (dir, file) => readFileSync(join(dir, file), 'utf8');
const write = (dir, file, content) => {
  mkdirSync(dirname(join(dir, file)), { recursive: true });
  writeFileSync(join(dir, file), content);
};
const tempDir = () => {
  const dir = mkdtempSync(join(tmpdir(), 'ai-instructions-'));
  dirs.push(dir);
  return dir;
};
function project(files = {}, pkg = { name: 'demo-app' }) {
  const dir = tempDir();
  if (pkg) write(dir, 'package.json', JSON.stringify(pkg));
  for (const [file, content] of Object.entries(files)) write(dir, file, content);
  return dir;
}
const ok = (result) => assert.equal(result.status, 0, result.stdout + result.stderr);

const tests = {
  'init creates all four files and is in sync'() {
    const dir = project();
    ok(run(dir, 'init'));
    const agents = read(dir, 'AGENTS.md');
    assert.match(agents, /^# demo-app\n/);
    assert.match(agents, /<!-- ai-instructions:begin -->[\s\S]*### Working agreement[\s\S]*<!-- ai-instructions:end -->\n$/);
    assert.doesNotMatch(agents, /### React|### Osnova/);
    assert.match(read(dir, 'CLAUDE.md'), /^@AGENTS\.md\n/);
    assert.deepEqual(JSON.parse(read(dir, '.ai-instructions.json')), { layers: ['core'], version: VERSION });
    assert.deepEqual(JSON.parse(read(dir, '.claude/settings.json')).permissions.deny, ['Read(.env)', 'Read(.env.*)', 'Read(!.env.example)']);
    ok(run(dir, 'sync', '--check'));
  },

  'init adds the layers it detects in package.json'() {
    const dir = project({}, { name: 'web', dependencies: { react: '19', '@aleksandar381radosavljevic/osnova-react': '1' } });
    const result = run(dir, 'init');
    ok(result);
    assert.match(result.stdout, /Detected react in package\.json: adding stacks\/react/);
    assert.deepEqual(JSON.parse(read(dir, '.ai-instructions.json')).layers, ['core', 'stacks/react', 'design/osnova']);
    assert.match(read(dir, 'AGENTS.md'), /### React[\s\S]*### Osnova/);
  },

  'init works without package.json'() {
    const dir = project({}, null);
    ok(run(dir, 'init'));
    assert.match(read(dir, 'AGENTS.md'), new RegExp(`^# ${basename(dir)}\n`));
    ok(run(dir, 'sync', '--check'));
  },

  'sync pins the running version and refuses to downgrade'() {
    const legacy = project({ '.ai-instructions.json': '{ "layers": ["core"] }' });
    ok(run(legacy, 'sync'));
    assert.equal(JSON.parse(read(legacy, '.ai-instructions.json')).version, VERSION);
    const old = project({ '.ai-instructions.json': '{ "layers": ["core"], "version": "0.0.1" }' });
    ok(run(old, 'sync'));
    assert.equal(run(old, 'sync', '--check').status, 0);
    const old2 = project({ '.ai-instructions.json': '{ "layers": ["core"], "version": "0.0.1" }' });
    assert.equal(run(old2, 'sync', '--check').status, 1);
    const ahead = project({ '.ai-instructions.json': '{ "layers": ["core"], "version": "99.0.0" }' });
    const result = run(ahead, 'sync');
    assert.equal(result.status, 1);
    assert.match(result.stderr, /pins ai-instructions v99\.0\.0/);
  },

  'personal --install writes a block into ~/.claude/CLAUDE.md and keeps the rest'() {
    const home = tempDir();
    write(home, '.claude/CLAUDE.md', '# My notes\n');
    ok(runWithHome(home, 'personal', '--install'));
    const first = read(home, '.claude/CLAUDE.md');
    assert.match(first, /^# My notes\n\n<!-- ai-instructions:begin -->[\s\S]*Serbian[\s\S]*<!-- ai-instructions:end -->\n$/);
    ok(runWithHome(home, 'personal', '--install'));
    assert.equal(read(home, '.claude/CLAUDE.md'), first);
    assert.match(run(home, 'personal').stdout, /Serbian/);
  },

  'pack-skills zips every skill with the version stamped'() {
    const out = tempDir();
    ok(spawnSync(process.execPath, [join(ROOT, 'scripts', 'pack-skills.mjs'), '--out', out, 'adr'], { encoding: 'utf8' }));
    const archive = readFileSync(join(out, 'adr.zip'));
    assert.equal(archive.readUInt32LE(0), 0x04034b50);
    const nameLength = archive.readUInt16LE(26);
    assert.equal(archive.subarray(30, 30 + nameLength).toString(), 'adr/SKILL.md');
    const body = inflateRawSync(archive.subarray(30 + nameLength, 30 + nameLength + archive.readUInt32LE(18))).toString();
    assert.match(body, /^---\nname: adr\n/);
    assert.ok(body.includes(`metadata:\n  version: "${VERSION}"\n---\n`), body.slice(0, 400));
  },

  '--layers picks layers'() {
    const dir = project();
    ok(run(dir, 'init', '--layers', 'core'));
    const agents = read(dir, 'AGENTS.md');
    assert.match(agents, /### Working agreement/);
    assert.doesNotMatch(agents, /### React/);
  },

  'sync is idempotent and keeps project edits'() {
    const dir = project();
    ok(run(dir, 'init'));
    const edited = read(dir, 'AGENTS.md').replace('Purpose: TODO', 'Purpose: invoices for freelancers');
    write(dir, 'AGENTS.md', edited);
    ok(run(dir, 'sync'));
    assert.equal(read(dir, 'AGENTS.md'), edited);
  },

  '--check fails when the block was edited by hand, and sync repairs it'() {
    const dir = project();
    ok(run(dir, 'init'));
    write(dir, 'AGENTS.md', read(dir, 'AGENTS.md').replace('### Definition of done', '### Definition of done (tweaked)'));
    assert.equal(run(dir, 'sync', '--check').status, 1);
    ok(run(dir, 'sync'));
    ok(run(dir, 'sync', '--check'));
  },

  'an existing AGENTS.md keeps its content and gets the block appended'() {
    const dir = project({ 'AGENTS.md': '# Mine\n\n- keep me\n', '.ai-instructions.json': '{ "layers": ["core"] }' });
    ok(run(dir, 'sync'));
    const agents = read(dir, 'AGENTS.md');
    assert.match(agents, /^# Mine\n\n- keep me\n\n<!-- ai-instructions:begin -->/);
  },

  'existing settings are preserved and only missing deny rules are added'() {
    const settings = { model: 'opus', permissions: { allow: ['Bash(npm run *)'], deny: ['Read(.env)'] } };
    const dir = project({ '.claude/settings.json': JSON.stringify(settings) });
    ok(run(dir, 'init'));
    const next = JSON.parse(read(dir, '.claude/settings.json'));
    assert.equal(next.model, 'opus');
    assert.deepEqual(next.permissions.allow, ['Bash(npm run *)']);
    assert.deepEqual(next.permissions.deny, ['Read(.env)', 'Read(.env.*)', 'Read(!.env.example)']);
  },

  'a CLAUDE.md without the import is left alone but fails --check'() {
    const dir = project({ 'CLAUDE.md': '# Claude notes\n' });
    const result = run(dir, 'init');
    ok(result);
    assert.match(result.stdout, /doesn't import AGENTS\.md/);
    assert.equal(read(dir, 'CLAUDE.md'), '# Claude notes\n');
    assert.equal(run(dir, 'sync', '--check').status, 1);
  },

  '.claude/CLAUDE.md needs the ../ import'() {
    const dir = project({ '.claude/CLAUDE.md': '@AGENTS.md\n' });
    ok(run(dir, 'init'));
    assert.equal(run(dir, 'sync', '--check').status, 1);
    write(dir, '.claude/CLAUDE.md', '@../AGENTS.md\n');
    ok(run(dir, 'sync', '--check'));
  },

  'unknown layers and broken markers are rejected'() {
    const unknown = project({ '.ai-instructions.json': '{ "layers": ["nope"] }' });
    assert.equal(run(unknown, 'sync').status, 1);
    const broken = project({ 'AGENTS.md': '<!-- ai-instructions:begin -->\nhalf a block\n', '.ai-instructions.json': '{ "layers": ["core"] }' });
    assert.equal(run(broken, 'sync').status, 1);
  },

  'sync without a config tells you to run init'() {
    const result = run(project(), 'sync');
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Run `ai-instructions init` first/);
  },
};

let failed = 0;
for (const [name, test] of Object.entries(tests)) {
  try {
    test();
    console.log(`✓ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`✗ ${name}\n  ${error.message.split('\n').join('\n  ')}`);
  }
}
for (const dir of dirs) rmSync(dir, { recursive: true, force: true });
process.exit(failed > 0 ? 1 : 0);
