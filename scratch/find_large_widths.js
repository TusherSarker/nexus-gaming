import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/tusha/.gemini/antigravity/scratch/nexus-gaming';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const matches = line.match(/w-\[(\d+)px\]/g);
    if (matches) {
      matches.forEach(m => {
        const num = parseInt(m.replace('w-[', '').replace('px]', ''));
        if (num > 300) {
          console.log(`${file}:${idx + 1} -> ${m} in line: ${line.trim().slice(0, 100)}`);
        }
      });
    }
  });
});
