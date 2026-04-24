/**
 * Vercel build: finds the monorepo root, then shared-types → backend → copy to api/nestdist.
 *
 * If Vercel's build folder is not the repo root, set env MONOREPO_ROOT (Vercel → Settings → Environment Variables):
 *   - "."  = current directory is the root (default)
 *   - ".." = monorepo root is one level above cwd
 *   - Or an absolute path if your layout needs it
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const WALK_MAX = 40;

function isMonorepoRoot(dir) {
  return (
    fs.existsSync(path.join(dir, 'backend', 'package.json')) &&
    fs.existsSync(path.join(dir, 'shared-types', 'package.json'))
  );
}

function resolvePathFromCwd(p) {
  if (!p || typeof p !== 'string') {
    return null;
  }
  const t = p.trim();
  if (t.length === 0) {
    return null;
  }
  return path.isAbsolute(t) ? path.normalize(t) : path.resolve(process.cwd(), t);
}

function walkUpToMonorepoRoot(startDir) {
  let dir = path.resolve(startDir);
  for (let i = 0; i < WALK_MAX; i++) {
    if (isMonorepoRoot(dir)) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return null;
    }
    dir = parent;
  }
  return null;
}

function safeListDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
}

function formatDirHint(cwd) {
  const entries = safeListDir(cwd);
  if (!entries) {
    return '(could not read cwd)';
  }
  const names = entries
    .map((d) => (d.isDirectory() ? `${d.name}/` : d.name))
    .slice(0, 50);
  return names.length > 0 ? names.join(', ') : '(empty)';
}

function findMonorepoRoot() {
  const cwd = process.cwd();
  const fromScripts = path.resolve(__dirname, '..');

  const envKeys = ['MONOREPO_ROOT', 'VERCEL_MONOREPO_ROOT', 'AI_FINANCE_MONOREPO_ROOT'];
  for (const key of envKeys) {
    const raw = process.env[key];
    if (raw === undefined || raw === '') {
      continue;
    }
    const candidate = resolvePathFromCwd(raw);
    if (candidate && isMonorepoRoot(candidate)) {
      console.log(`[vercel] Monorepo root from ${key}=${JSON.stringify(raw)} → ${candidate}`);
      return candidate;
    }
    if (candidate) {
      throw new Error(
        `[vercel] ${key}=${JSON.stringify(raw)} resolves to ${candidate}, but that folder is not a ` +
          'valid monorepo root (need `backend/package.json` and `shared-types/package.json`).'
      );
    }
  }

  const startPoints = new Set(
    [cwd, fromScripts, path.join(cwd, '..'), path.join(fromScripts, '..')].map((p) =>
      path.resolve(p)
    )
  );

  for (const start of startPoints) {
    const found = walkUpToMonorepoRoot(start);
    if (found) {
      return found;
    }
  }

  const hasBackend = fs.existsSync(path.join(cwd, 'backend', 'package.json'));
  const hasShared = fs.existsSync(path.join(cwd, 'shared-types', 'package.json'));
  const hint = `cwd contains backend/: ${hasBackend}, shared-types/: ${hasShared}. ` + `Top-level in cwd: ${formatDirHint(cwd)}`;

  throw new Error(
    '[vercel] Monorepo root not found (need a folder with both `backend/package.json` and `shared-types/package.json`).\n' +
      `  ${hint}\n` +
      '  Common causes:\n' +
      '  1) `backend/` or `shared-types/` were never committed/pushed to Git — run on your machine: `git status` and `git ls-files backend/package.json shared-types/package.json`.\n' +
      '  2) Vercel is connected to the wrong repository or branch.\n' +
      '  3) The app lives one directory above the Vercel "Root Directory" — set environment variable `MONOREPO_ROOT` to `..` (Vercel → Settings → Environment Variables → Production).\n' +
      `  (cwd=${cwd}, scripts parent=${fromScripts})`
  );
}

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', env: process.env, shell: false });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

const root = findMonorepoRoot();
console.log(`[vercel] Monorepo root: ${root}`);

run('npm', ['run', 'build', '--prefix', path.join(root, 'shared-types')], root);
run('npm', ['run', 'build', '--prefix', path.join(root, 'backend')], root);
run(process.execPath, [path.join(root, 'scripts', 'copy-nest-for-vercel.cjs')], root);
