#!/usr/bin/env node
/* global process */
/**
 * check-no-neon.js
 * Scans src/** for any remaining neon-green references and exits non-zero if found.
 * Patterns: #39ff14, brand-neon, rgba(57, 255, 20
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PATTERNS = [/#39ff14/i, /brand-neon/, /rgba\(\s*57\s*,\s*255\s*,\s*20/];
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css']);

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else if (EXTENSIONS.has(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

const srcDir = resolve(__dirname, '..', 'src');
const files = walk(srcDir);
let found = false;

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    for (const pattern of PATTERNS) {
      if (pattern.test(lines[i])) {
        console.error(`[check:no-neon] ${file}:${i + 1}: ${lines[i].trim()}`);
        found = true;
      }
    }
  }
}

if (found) {
  console.error('\ncheck:no-neon FAILED — remove all neon-green references before merging.');
  process.exit(1);
} else {
  console.log('check:no-neon passed — no neon-green references found.');
}
