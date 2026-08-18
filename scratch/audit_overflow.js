import fs from 'fs';

const html = fs.readFileSync('C:/Users/tusha/.gemini/antigravity/scratch/nexus-gaming/index.html', 'utf-8');

// Check all unclosed tags
const tags = ['div', 'section', 'main', 'header', 'nav', 'footer'];
tags.forEach(tag => {
  const opens = (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
  const closes = (html.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
  console.log(`${tag}: open=${opens}, close=${closes}, diff=${opens - closes}`);
});

// Check fixed widths in HTML
const fixedWidths = html.match(/w-\[\d+px\]/g) || [];
console.log('Fixed widths:', [...new Set(fixedWidths)]);

const minWidths = html.match(/min-w-\[\d+px\]/g) || [];
console.log('Min widths:', [...new Set(minWidths)]);
