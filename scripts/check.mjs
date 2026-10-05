#!/usr/bin/env node
// Self-check for this repo; CI runs it on every push. Zero dependencies.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const rel = (path) => relative(ROOT, path) || '.';
const read = (path) => readFileSync(path, 'utf8').replace(/\r\n/g, '\n');

// Agent Skills spec: anything else makes claude.ai reject the upload (decisions/0003).
const SPEC_KEYS = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const SKILL_NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RULES_BUDGET = 100; // lines for all layers together (decisions/0004)
const ADR_FILE = /^\d{4}-[a-z0-9]+(-[a-z0-9]+)*\.md$/;
const ADR_STATUS = /^- Status: (Proposed|Accepted|Deprecated|Superseded by \d{4})$/m;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    if (entry === 'node_modules' || entry === '.git') return [];
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

// Minimal frontmatter reader: top-level `key: value` lines; indented lines (e.g. metadata) are skipped.
function frontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const close = text.indexOf('\n---\n', 3);
  if (close === -1) return null;
  const fields = {};
  for (const line of text.slice(4, close).split('\n')) {
    if (!line.trim() || /^\s/.test(line)) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) return { invalid: line };
    fields[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return { fields, body: text.slice(close + 5) };
}

function checkSkills() {
  const dir = join(ROOT, 'skills');
  const names = readdirSync(dir).filter((entry) => statSync(join(dir, entry)).isDirectory());
  for (const name of names) {
    const file = join(dir, name, 'SKILL.md');
    if (!existsSync(file)) {
      errors.push(`${rel(join(dir, name))}: missing SKILL.md`);
      continue;
    }
    const parsed = frontmatter(read(file));
    if (!parsed) {
      errors.push(`${rel(file)}: must start with YAML frontmatter ("---" on line 1)`);
      continue;
    }
    if (parsed.invalid) {
      errors.push(`${rel(file)}: can't read frontmatter line "${parsed.invalid}"`);
      continue;
    }
    const { fields, body } = parsed;
    for (const key of Object.keys(fields)) {
      if (!SPEC_KEYS.has(key)) errors.push(`${rel(file)}: "${key}" isn't an Agent Skills field; claude.ai would reject the upload`);
    }
    if (fields.name !== name) errors.push(`${rel(file)}: name "${fields.name ?? ''}" must match its folder "${name}"`);
    if (!SKILL_NAME.test(name) || name.length > 64) errors.push(`${rel(file)}: name must be lowercase words joined by single hyphens, max 64 characters`);
    if (/claude|anthropic/i.test(name)) errors.push(`${rel(file)}: name can't contain "claude" or "anthropic"`);
    const description = fields.description ?? '';
    if (!description) errors.push(`${rel(file)}: description is required`);
    if (description.length > 1024) errors.push(`${rel(file)}: description is ${description.length} characters; max 1024`);
    if (/[<>]/.test(description)) errors.push(`${rel(file)}: no angle brackets in the description`);
    if (description && !/\bUse\b/.test(description)) warnings.push(`${rel(file)}: description should say when to use the skill`);
    const lines = body.split('\n').length;
    if (lines > 500) warnings.push(`${rel(file)}: ${lines} lines; keep SKILL.md under 500 and move detail into referenced files`);
    for (const [, target] of body.matchAll(/\]\(([^)\s#]+)\)/g)) {
      if (!/^[a-z]+:/.test(target) && !existsSync(join(dir, name, target))) errors.push(`${rel(file)}: broken link ${target}`);
    }
  }
  return names.length;
}

function checkRules() {
  const files = walk(join(ROOT, 'rules')).filter((file) => file.endsWith('.md'));
  let total = 0;
  for (const file of files) {
    const text = read(file);
    if (!text.startsWith('### ')) errors.push(`${rel(file)}: must start with a "### " heading (layers are nested under "## Shared rules")`);
    if (text.includes('ai-instructions:begin') || text.includes('ai-instructions:end')) errors.push(`${rel(file)}: must not contain block markers`);
    total += text.trim().split('\n').length;
  }
  if (total > RULES_BUDGET) {
    errors.push(`rules/: all layers together are ${total} lines; the budget is ${RULES_BUDGET}. Remove or merge rules (decisions/0004).`);
  }
  return { count: files.length, total };
}

function checkDecisions() {
  const dir = join(ROOT, 'decisions');
  const files = readdirSync(dir).filter((file) => file.endsWith('.md'));
  for (const file of files) {
    if (!ADR_FILE.test(file)) errors.push(`decisions/${file}: name it NNNN-kebab-title.md`);
    if (!ADR_STATUS.test(read(join(dir, file)))) errors.push(`decisions/${file}: needs a "- Status: Proposed|Accepted|Deprecated|Superseded by NNNN" line`);
  }
  return files.length;
}

function checkRelease() {
  const { version } = JSON.parse(read(join(ROOT, 'package.json')));
  if (!new RegExp(`^## ${version.replace(/\./g, '\\.')}\\b`, 'm').test(read(join(ROOT, 'CHANGELOG.md')))) {
    errors.push(`CHANGELOG.md: no "## ${version}" entry for the version in package.json`);
  }
  for (const file of walk(ROOT).filter((path) => path.endsWith('.md'))) {
    if (read(file).includes('github:OWNER/')) warnings.push(`${rel(file)}: replace OWNER with your GitHub username`);
  }
  return version;
}

const skills = checkSkills();
const rules = checkRules();
const decisions = checkDecisions();
const version = checkRelease();

for (const warning of warnings) console.log(`! ${warning}`);
for (const error of errors) console.error(`✗ ${error}`);
if (errors.length > 0) process.exit(1);
console.log(
  `✓ v${version}: ${skills} skills, ${rules.count} rule layers (${rules.total}/${RULES_BUDGET} lines), ${decisions} decisions`,
);
