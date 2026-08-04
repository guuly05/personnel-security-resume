import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const srcSvg = path.join(publicDir, 'favicon.svg');

if (fs.existsSync(srcSvg)) {
  const svgContent = fs.readFileSync(srcSvg, 'utf8');
  const files = [
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'favicon.ico'
  ];

  files.forEach(f => {
    fs.writeFileSync(path.join(publicDir, f), svgContent);
  });
  console.log('Favicons successfully placed in public directory!');
} else {
  console.error('favicon.svg not found!');
}
