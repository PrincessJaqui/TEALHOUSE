#!/usr/bin/env node
/**
 * TEALHOUSE build gate.
 *
 * Runs before vite build. Fails the build on the error classes that have
 * shipped broken to production before. Do not remove this gate.
 *
 *   TS2304 / TS2552  undefined identifier          a missing import white-screened production
 *   TS2448 / TS2454  used before declaration       temporal dead zone, shipped twice
 *   TS17001          duplicate JSX attribute       last one silently wins
 *   TS2300           duplicate identifier          usually a double import
 *
 * Also blocks two things specific to this repo:
 *   - Figma Make versioned import specifiers  (from "sonner@2.0.3")
 *   - Deno / jsr specifiers inside src/       (they must live in supabase/functions/)
 */

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

const BLOCKING_TS_CODES = new Set([
  'TS2304', // cannot find name
  'TS2552', // cannot find name, did you mean
  'TS2448', // block-scoped variable used before declaration
  'TS2454', // variable used before being assigned
  'TS17001', // duplicate JSX attribute
  'TS2300', // duplicate identifier
]);

const failures = [];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry === 'assets') continue;
      out.push(...walk(full));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(SRC);

// 1. Figma Make versioned specifiers and Deno specifiers inside src/
const VERSIONED = /from\s+["'](?:@[\w.-]+\/)?[\w.-]+@\d+\.\d+\.\d+["']/;
const JSR = /from\s+["']jsr:/;
const NPM_PREFIX = /from\s+["']npm:/;

for (const file of files) {
  const rel = relative(ROOT, file);
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (VERSIONED.test(line)) {
      failures.push(
        `${rel}:${i + 1}  Figma versioned import specifier. Use a bare specifier.\n    ${line.trim()}`
      );
    }
    if (JSR.test(line) || NPM_PREFIX.test(line)) {
      failures.push(
        `${rel}:${i + 1}  Deno specifier inside src/. Edge function code belongs in supabase/functions/.\n    ${line.trim()}`
      );
    }
  });
}

// 2. TypeScript diagnostics, filtered to the blocking classes
let tscOutput = '';
try {
  execFileSync('npx', ['tsc', '--noEmit', '--pretty', 'false'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
} catch (err) {
  tscOutput = `${err.stdout || ''}${err.stderr || ''}`;
}

if (tscOutput) {
  for (const line of tscOutput.split('\n')) {
    const match = line.match(/error (TS\d+):/);
    if (match && BLOCKING_TS_CODES.has(match[1])) {
      failures.push(`${line.trim()}`);
    }
  }
}

if (failures.length > 0) {
  console.error('\nBuild gate failed. ' + failures.length + ' blocking issue(s):\n');
  for (const f of failures) console.error('  ' + f + '\n');
  console.error('Every check in this gate exists because something shipped broken.\n');
  process.exit(1);
}

console.log('Build gate passed. ' + files.length + ' source files checked.');
