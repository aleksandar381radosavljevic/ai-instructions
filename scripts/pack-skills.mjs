#!/usr/bin/env node
// Zips each skill for upload to the Claude account and stamps metadata.version (decisions/0012). Zero dependencies.
// Usage: npm run pack-skills [-- name ...] [-- --out dir]

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_DIR = join(ROOT, 'skills');
const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const outDir = outIndex === -1 ? join(ROOT, 'dist', 'skills') : resolve(args[outIndex + 1]);
const wanted = outIndex === -1 ? args : args.filter((_, index) => index !== outIndex && index !== outIndex + 1);
const available = readdirSync(SKILLS_DIR).filter((entry) => statSync(join(SKILLS_DIR, entry)).isDirectory());
const names = wanted.length > 0 ? wanted : available;

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buffer) => {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

// Adds `version` under `metadata`, creating the field when the skill has none.
function stamp(skillMd) {
  const text = skillMd.replace(/\r\n/g, '\n');
  const close = text.indexOf('\n---\n', 3);
  const head = text.slice(0, close).split('\n');
  const metadata = head.findIndex((line) => /^metadata:\s*$/.test(line));
  if (metadata === -1) head.push('metadata:', `  version: "${version}"`);
  else head.splice(metadata + 1, 0, `  version: "${version}"`);
  return head.join('\n') + text.slice(close);
}

// Minimal deflate zip. A fixed timestamp (1980-01-01) keeps the output reproducible.
function zip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBytes = Buffer.from(name, 'utf8');
    const compressed = deflateRawSync(data);
    const fields = (header) => {
      header.writeUInt16LE(8, 8); // deflate
      header.writeUInt16LE(0, 10); // time
      header.writeUInt16LE(0x21, 12); // date: 1980-01-01
      header.writeUInt32LE(crc32(data), 14);
      header.writeUInt32LE(compressed.length, 18);
      header.writeUInt32LE(data.length, 22);
      header.writeUInt16LE(nameBytes.length, 26);
    };
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    fields(local);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    fields(central.subarray(2));
    central.writeUInt32LE(offset, 42);
    locals.push(local, nameBytes, compressed);
    centrals.push(central, nameBytes);
    offset += local.length + nameBytes.length + compressed.length;
  }
  const directory = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, directory, end]);
}

function files(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

mkdirSync(outDir, { recursive: true });
for (const name of names) {
  if (!available.includes(name)) {
    console.error(`✗ No skill named ${name}. Available: ${available.join(', ')}.`);
    process.exit(1);
  }
  const dir = join(SKILLS_DIR, name);
  const entries = files(dir)
    .sort()
    .map((path) => {
      const inner = relative(dir, path).split(sep).join('/');
      const data = inner === 'SKILL.md' ? Buffer.from(stamp(readFileSync(path, 'utf8'))) : readFileSync(path);
      return { name: `${name}/${inner}`, data };
    });
  writeFileSync(join(outDir, `${name}.zip`), zip(entries));
  console.log(`✓ ${relative(process.cwd(), join(outDir, `${name}.zip`)) || name} (v${version})`);
}
console.log('Upload the zips of the skills you changed in the skills settings on claude.ai.');
