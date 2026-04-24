/**
 * Vercel build: finds the monorepo root (so this works no matter what cwd Vercel uses),
 * then builds shared-types → backend → copies dist to api/nestdist.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function isMonorepoRoot(dir) {
  return (
    fs.existsSync(path.join(dir, 'backend', 'package.json')) &&
    fs.existsSync(path.join(dir, 'shared-types', 'package.json'))
  );
}

function walkUpToMonorepoRoot(startDir) {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 16; i++) {
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

function findMonorepoRoot() {
  const startPoints = new Set(
    [process.cwd(), path.resolve(__dirname, '..')].map((p) => path.resolve(p))
  );

  for (const start of startPoints) {
    const found = walkUpToMonorepoRoot(start);
    if (found) {
      return found;
    }
  }

  const cwd = process.cwd();
  const fromScripts = path.resolve(__dirname, '..');
  throw new Error(
    '[vercel] Monorepo root not found (need `backend/package.json` and `shared-types/package.json` in the same folder). ' +
      `Looked from cwd=${cwd} and from=${fromScripts}.\n` +
      'Fix: Vercel → Project → Settings → General → Root Directory = repository root (empty or "."), ' +
      'and connect a Git project that includes `backend/`, `shared-types/`, `api/`, and `scripts/`. ' +
      'A repo that only contains one app (e.g. only `backend/`) will not work with this build.'
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
