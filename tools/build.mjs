import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC = path.join(ROOT, 'public');

console.log('📦 Building public static distribution for Cloudflare Workers...');

fs.rmSync(PUBLIC, { recursive: true, force: true });
fs.mkdirSync(PUBLIC, { recursive: true });

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy index.html
fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(PUBLIC, 'index.html'));

// Copy directories
copyDir(path.join(ROOT, 'css'), path.join(PUBLIC, 'css'));
copyDir(path.join(ROOT, 'js'), path.join(PUBLIC, 'js'));
copyDir(path.join(ROOT, 'assets'), path.join(PUBLIC, 'assets'));

console.log('✓ Public distribution built successfully in ./public');
