/**
 * Vercel build: finds the monorepo root (so this works no matter what cwd Vercel uses),
 * then builds shared-types → backend → copies dist to api/nestdist.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function findMonorepoRoot() {
  let dir = path.resolve(__dirname, '..');
  for (let i = 0; i < 12; i++) {
    const backendPkg = path.join(dir, 'backend', 'package.json');
    const sharedPkg = path.join(dir, 'shared-types', 'package.json');
    const apiEntry = path.join(dir, 'api', '[...route].ts');
    if (
      fs.existsSync(backendPkg) &&
      fs.existsSync(sharedPkg) &&
      fs.existsSync(apiEntry)
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  throw new Error(
    '[vercel] Monorepo root not found (expected backend/, shared-types/, and api/[...route].ts). ' +
      'In Vercel → Project → Settings → General, set "Root Directory" to the repository root (leave empty or "."), ' +
      'not a subfolder like api/ or backend/.'
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
