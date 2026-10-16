#!/usr/bin/env node
// Checks that commits in a range follow Conventional Commits (decisions/0014). Zero dependencies.
// Usage: node scripts/check-commits.mjs origin/main..HEAD

import { spawnSync } from 'node:child_process';

const TYPES = ['feat', 'fix', 'docs', 'chore', 'ci', 'test', 'refactor', 'perf', 'build', 'style', 'revert'];
const HEADER = new RegExp(`^(${TYPES.join('|')})(\\([a-z0-9/-]+\\))?!?: \\S`);

const range = process.argv[2];
if (!range) {
  console.error('Usage: node scripts/check-commits.mjs <base>..<head>');
  process.exit(1);
}
const log = spawnSync('git', ['log', '--no-merges', '--format=%h %s', range], { encoding: 'utf8' });
if (log.status !== 0) {
  console.error(log.stderr.trim());
  process.exit(1);
}
const commits = log.stdout.split('\n').filter(Boolean);
const bad = commits.filter((line) => !HEADER.test(line.slice(line.indexOf(' ') + 1)));
for (const line of bad) console.error(`✗ ${line}`);
if (bad.length > 0) {
  console.error(`Use "type(scope)!: summary" with a type from: ${TYPES.join(', ')}.`);
  process.exit(1);
}
console.log(`✓ ${commits.length} commit(s) follow Conventional Commits`);
