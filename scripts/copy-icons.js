/**
 * Eseguito dopo `ng build`: copia `public/tailwind-icons/*.svg` nel pacchetto già emesso in dist.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'public', 'tailwind-icons');
const destDir = path.join(root, 'dist', 'angular-tailwind-components', 'tailwind-icons');

if (!fs.existsSync(srcDir)) {
  console.error('Missing directory:', srcDir);
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });
let n = 0;
for (const name of fs.readdirSync(srcDir)) {
  if (!name.endsWith('.svg')) continue;
  fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
  n++;
}
console.log(`copy-icons: copied ${n} SVG(s) → dist/angular-tailwind-components/tailwind-icons`);
