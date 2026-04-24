/**
 * Vercel: copies compiled Nest output next to the serverless entry so
 * `api/[...route].ts` can import `./nestdist/...` (not `../backend/src/...`, which
 * is never shipped to the function bundle).
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'backend', 'dist');
const dest = path.join(root, 'api', 'nestdist');

if (!fs.existsSync(src)) {
  console.error(
    '[vercel] backend/dist is missing. Run: npm run build --workspace backend'
  );
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.cpSync(src, dest, { recursive: true });
console.log('[vercel] Copied backend/dist -> api/nestdist');
