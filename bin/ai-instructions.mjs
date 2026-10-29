#!/usr/bin/env node
// ai-instructions: keeps the shared-rules block in a project's AGENTS.md up to date.
// Zero dependencies, Node 18+. decisions/0002 explains why it works this way.

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf8')).version;
const RULES_DIR = join(PKG_ROOT, 'rules');
const CWD = process.cwd();

const CONFIG_FILE = '.ai-instructions.json';
// init starts from core and adds a layer when package.json shows its stack (decisions/0012).
const DETECTED_LAYERS = [
  { layer: 'stacks/react', matches: (dep) => ['react', 'react-dom', 'next'].includes(dep) },
  { layer: 'stacks/vue', matches: (dep) => ['vue', 'nuxt'].includes(dep) },
  { layer: 'design/osnova', matches: (dep) => /(^|\/)osnova(-|$)/.test(dep) },
];
const BEGIN = '<!-- ai-instructions:begin -->';
const END = '<!-- ai-instructions:end -->';
const SETTINGS_FILE = '.claude/settings.json';
// Order matters: the "!" rule carves .env.example back out of the rules before it.
const DENY_RULES = ['Read(.env)', 'Read(.env.*)', 'Read(!.env.example)'];
const LINE_BUDGET = 200; // Claude Code's guidance for a single instruction file
// Claude Code resolves @imports relative to the file that contains them.
const CLAUDE_FILES = [
  { file: 'CLAUDE.md', importLine: '@AGENTS.md', pattern: /(^|\s)@(\.\/)?AGENTS\.md(\s|$)/m },
  { file: '.claude/CLAUDE.md', importLine: '@../AGENTS.md', pattern: /(^|\s)@\.\.\/AGENTS\.md(\s|$)/m },
];

const HELP = `ai-instructions v${VERSION}

Usage:
  ai-instructions init [--layers a,b]   Create ${CONFIG_FILE} (core plus detected layers), then sync
  ai-instructions sync                  Regenerate the shared-rules block and companion files
  ai-instructions sync --check          Exit 1 if anything is out of date (for CI)
  ai-instructions layers                List the available rule layers
  ai-instructions personal [--install]  Print your personal preferences, or install them into ~/.claude/CLAUDE.md

In a project, sync writes only: the block between the ai-instructions markers in AGENTS.md,
the version in ${CONFIG_FILE}, a CLAUDE.md when none exists, and the .env deny rules in
${SETTINGS_FILE}. Everything else is yours.`;

const say = (symbol, message) => console.log(`${symbol} ${message}`);
const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exit(1);
};
const read = (path) => readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const readJson = (path) => {
  try {
    return JSON.parse(read(path));
  } catch (error) {
    return fail(`${relative(CWD, path) || path} is not valid JSON (${error.message}).`);
  }
};

function listLayers(dir = RULES_DIR) {
  return readdirSync(dir)
    .flatMap((entry) => {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) return listLayers(path);
      return entry.endsWith('.md') ? [relative(RULES_DIR, path).slice(0, -3).split(sep).join('/')] : [];
    })
    .sort();
}

function assertLayers(layers) {
  const known = listLayers();
  const unknown = layers.filter((layer) => !known.includes(layer));
  if (unknown.length > 0) fail(`Unknown layer(s): ${unknown.join(', ')}. Available: ${known.join(', ')}.`);
}

function loadConfig() {
  const path = join(CWD, CONFIG_FILE);
  if (!existsSync(path)) fail(`No ${CONFIG_FILE} in ${CWD}. Run \`ai-instructions init\` first.`);
  const config = readJson(path);
  if (!Array.isArray(config.layers) || config.layers.length === 0) {
    fail(`${CONFIG_FILE}: "layers" must be a non-empty list.`);
  }
  assertLayers(config.layers);
  return config;
}

// Negative when a is older than b. Versions are plain x.y.z.
const compareVersions = (a, b) => {
  const [x, y] = [a, b].map((version) => version.split('.').map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

function readPackageJson() {
  const path = join(CWD, 'package.json');
  return existsSync(path) ? readJson(path) : null;
}

// A web project in the root or one folder down (src/Api/Api.csproj) means an ASP.NET Core API (decisions/0017).
function findWebCsproj(dir = CWD, depth = 0) {
  for (const entry of readdirSync(dir)) {
    if (['node_modules', 'bin', 'obj', '.git'].includes(entry)) continue;
    const path = join(dir, entry);
    if (entry.endsWith('.csproj') && /Sdk="Microsoft\.NET\.Sdk\.Web"/.test(read(path))) return relative(CWD, path);
    if (depth < 2 && statSync(path).isDirectory()) {
      const found = findWebCsproj(path, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

function detectLayers() {
  const pkg = readPackageJson() ?? {};
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies });
  const layers = ['core'];
  const csproj = findWebCsproj();
  if (csproj) {
    layers.push('stacks/dotnet');
    say('•', `Detected an ASP.NET Core project (${csproj}): adding stacks/dotnet`);
  }
  for (const { layer, matches } of DETECTED_LAYERS) {
    const dep = deps.find(matches);
    if (dep) {
      layers.push(layer);
      say('•', `Detected ${dep} in package.json: adding ${layer}`);
    }
  }
  return layers;
}

// Replaces the marked block in a file's text, or appends it. null means the markers are broken.
function withBlock(current, block) {
  const start = current.indexOf(BEGIN);
  const end = current.indexOf(END);
  if (start === -1 && end === -1) return `${current.trimEnd()}\n\n${block}\n`;
  if (start === -1 || end === -1 || end < start) return null;
  return current.slice(0, start) + block + current.slice(end + END.length);
}

function renderBlock(layers) {
  const rules = layers.map((layer) => read(join(RULES_DIR, `${layer}.md`)).trim()).join('\n\n');
  return [
    BEGIN,
    '<!-- Generated by ai-instructions; do not edit inside this block. Change the ai-instructions repo, then run `ai-instructions sync`. -->',
    `## Shared rules (ai-instructions v${VERSION})`,
    '',
    'Project rules in this file and in nested AGENTS.md files take precedence over these shared rules. If two rules conflict, ask.',
    '',
    rules,
    END,
  ].join('\n');
}

function projectName() {
  return readPackageJson()?.name || basename(CWD);
}

function nextAgentsMd(current, block) {
  if (current === null) {
    const template = read(join(PKG_ROOT, 'templates', 'AGENTS.md')).replace('{{PROJECT_NAME}}', projectName());
    return `${template.trimEnd()}\n\n${block}\n`;
  }
  return (
    withBlock(current, block) ??
    fail('AGENTS.md has a broken ai-instructions block. Restore or delete both markers, then run sync again.')
  );
}

function nextSettings(current) {
  const settings = current ?? {};
  const deny = Array.isArray(settings.permissions?.deny) ? settings.permissions.deny : [];
  const missing = DENY_RULES.filter((rule) => !deny.includes(rule));
  if (missing.length === 0) return null;
  settings.permissions = { ...settings.permissions, deny: [...deny, ...missing] };
  return settings;
}

// Works out every change without touching the disk, so `--check` and `sync` share one code path.
function plan() {
  const config = loadConfig();
  const { layers } = config;
  const changes = [];
  const problems = [];
  const layerList = `v${VERSION}: ${layers.join(', ')}`;

  if (config.version && compareVersions(VERSION, config.version) < 0) {
    fail(`This project pins ai-instructions v${config.version}; you're running v${VERSION}. Run v${config.version} or newer.`);
  }
  if (config.version !== VERSION) {
    changes.push({
      file: CONFIG_FILE,
      content: `${JSON.stringify({ ...config, version: VERSION }, null, 2)}\n`,
      note: config.version ? `Upgraded ${CONFIG_FILE} from v${config.version} to v${VERSION}` : `Pinned v${VERSION} in ${CONFIG_FILE}`,
    });
  }

  const agentsPath = join(CWD, 'AGENTS.md');
  const agentsNow = existsSync(agentsPath) ? read(agentsPath) : null;
  const agentsNext = nextAgentsMd(agentsNow, renderBlock(layers));
  if (agentsNext !== agentsNow) {
    changes.push({
      file: 'AGENTS.md',
      content: agentsNext,
      note: agentsNow === null ? `Created AGENTS.md (shared rules ${layerList})` : `Updated shared rules in AGENTS.md (${layerList})`,
    });
  }
  const lines = agentsNext.trimEnd().split('\n').length;
  if (lines > LINE_BUDGET) {
    problems.push({
      warnOnly: true,
      message: `AGENTS.md is ${lines} lines; keep it under ${LINE_BUDGET}. Move folder-specific rules into nested AGENTS.md files.`,
    });
  }

  const present = CLAUDE_FILES.filter(({ file }) => existsSync(join(CWD, file)));
  if (present.length === 0) {
    changes.push({
      file: 'CLAUDE.md',
      content: read(join(PKG_ROOT, 'templates', 'CLAUDE.md')),
      note: 'Created CLAUDE.md (imports AGENTS.md)',
    });
  }
  for (const { file, importLine, pattern } of present) {
    if (!pattern.test(read(join(CWD, file)))) {
      problems.push({
        message: `${file} doesn't import AGENTS.md, so Claude Code reads it instead of AGENTS.md. Add "${importLine}" as its first line.`,
      });
    }
  }

  const settingsPath = join(CWD, SETTINGS_FILE);
  const settingsNow = existsSync(settingsPath) ? readJson(settingsPath) : null;
  const settingsNext = nextSettings(settingsNow);
  if (settingsNext) {
    changes.push({
      file: SETTINGS_FILE,
      content: `${JSON.stringify(settingsNext, null, 2)}\n`,
      note: `${settingsNow ? 'Updated' : 'Created'} ${SETTINGS_FILE} (Claude can't read .env files)`,
    });
  }

  return { layers, changes, problems };
}

function sync({ check }) {
  const { layers, changes, problems } = plan();
  if (check) {
    for (const change of changes) say('✗', `${change.file} is out of date. Run \`ai-instructions sync\`.`);
  } else {
    for (const change of changes) {
      const path = join(CWD, change.file);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, change.content);
      say('✓', change.note);
    }
  }
  for (const problem of problems) say(check && !problem.warnOnly ? '✗' : '!', problem.message);

  const failing = check ? changes.length + problems.filter((problem) => !problem.warnOnly).length : 0;
  if (failing > 0) process.exit(1);
  if (changes.length === 0 && problems.length === 0) {
    say('✓', `In sync with ai-instructions v${VERSION} (${layers.join(', ')}).`);
  }
}

function init(args) {
  const path = join(CWD, CONFIG_FILE);
  if (existsSync(path)) {
    say('•', `${CONFIG_FILE} already exists; keeping its layers.`);
  } else {
    const index = args.findIndex((arg) => arg === '--layers' || arg.startsWith('--layers='));
    let layers;
    if (index !== -1) {
      const value = args[index].includes('=') ? args[index].split('=')[1] : args[index + 1];
      if (!value || value.startsWith('--')) fail('--layers needs a comma-separated list, e.g. --layers core,stacks/react');
      layers = value.split(',').map((layer) => layer.trim()).filter(Boolean);
    } else {
      layers = detectLayers();
    }
    assertLayers(layers);
    writeFileSync(path, `${JSON.stringify({ layers, version: VERSION }, null, 2)}\n`);
    say('✓', `Created ${CONFIG_FILE} (${layers.join(', ')})`);
  }
  sync({ check: false });
  console.log('\nNext: fill in the "This project" section of AGENTS.md, then commit the generated files.');
}

// Personal rules follow the user, not the project (decisions/0012). Claude Code loads ~/.claude/CLAUDE.md everywhere.
function personal({ install }) {
  const text = read(join(PKG_ROOT, 'personal', 'preferences.md')).trim();
  if (!install) {
    console.log(text);
    return;
  }
  const path = join(homedir(), '.claude', 'CLAUDE.md');
  const block = [
    BEGIN,
    `<!-- Generated by ai-instructions v${VERSION} from personal/preferences.md; do not edit inside this block. -->`,
    text,
    END,
  ].join('\n');
  const current = existsSync(path) ? read(path) : null;
  const next = current === null ? `${block}\n` : withBlock(current, block);
  if (next === null) fail(`${path} has a broken ai-instructions block. Restore or delete both markers, then try again.`);
  if (next === current) {
    say('✓', `${path} is up to date (v${VERSION}).`);
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, next);
  say('✓', `${current === null ? 'Created' : 'Updated'} ${path} (personal preferences v${VERSION})`);
}

const [command, ...args] = process.argv.slice(2);
switch (command) {
  case 'init':
    init(args);
    break;
  case 'sync':
    sync({ check: args.includes('--check') });
    break;
  case 'layers':
    console.log(listLayers().join('\n'));
    break;
  case 'personal':
    personal({ install: args.includes('--install') });
    break;
  case '--version':
  case '-v':
    console.log(VERSION);
    break;
  case undefined:
  case 'help':
  case '--help':
  case '-h':
    console.log(HELP);
    break;
  default:
    console.error(HELP);
    fail(`Unknown command: ${command}`);
}
