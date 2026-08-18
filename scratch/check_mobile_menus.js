import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/tusha/.gemini/antigravity/scratch/nexus-gaming';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  const hasBtn = content.includes('id="mobile-menu-btn"') || content.includes("id='mobile-menu-btn'");
  const hasDrawer = content.includes('id="mobile-menu"') || content.includes("id='mobile-menu'");
  const drawerLinks = hasDrawer ? (content.split('id="mobile-menu"')[1]?.split('</header>')[0]?.match(/<a /g) || []).length : 0;
  console.log(`${file}: hasBtn=${hasBtn}, hasDrawer=${hasDrawer}, drawerLinks=${drawerLinks}`);
});
