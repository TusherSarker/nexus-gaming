import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/tusha/.gemini/antigravity/scratch/nexus-gaming';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  const scripts = content.match(/<script[^>]*src="([^"]+)"[^>]*>/g) || [];
  const moduleScripts = content.match(/<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*>/g) || [];
  console.log(`${file}: scripts=${scripts.length}, modules=${moduleScripts.join(', ')}`);
});
