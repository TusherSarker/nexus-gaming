import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/tusha/.gemini/antigravity/scratch/nexus-gaming';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const mobileBtnHtml = `
        <!-- Mobile Menu Toggle Button -->
        <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-xl bg-nexus-900/90 border border-white/10 text-text-secondary hover:text-cyan-accent transition-all" aria-label="Menu">
          <i data-lucide="menu" class="w-4 h-4 sm:w-5 sm:h-5"></i>
        </button>`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if mobile menu button is present
  if (!content.includes('id="mobile-menu-btn"')) {
    // Insert before closing tag of navbar right action container
    if (content.includes('id="navbarUserContainer"')) {
      content = content.replace(
        /(<div id="navbarUserContainer"[^>]*>[\s\S]*?<\/div>)/,
        `$1\n${mobileBtnHtml}`
      );
      console.log(`Added mobile-menu-btn to ${file} (after navbarUserContainer)`);
    } else if (content.includes('aria-label="Cart"')) {
      content = content.replace(
        /(<a [^>]*aria-label="Cart"[^>]*>[\s\S]*?<\/a>)/,
        `$1\n${mobileBtnHtml}`
      );
      console.log(`Added mobile-menu-btn to ${file} (after Cart)`);
    }
  }

  // If there is an old trapped mobile-menu inside header, remove it so mobile-nav.js creates the full body one
  if (content.includes('id="mobile-menu"') && content.includes('<header')) {
    const parts = content.split('<!-- Mobile Menu Drawer -->');
    if (parts.length > 1) {
      const subParts = parts[1].split('</header>');
      if (subParts.length > 1) {
        content = parts[0] + '</header>' + subParts.slice(1).join('</header>');
        console.log(`Removed trapped mobile-menu markup from header in ${file}`);
      }
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
});
console.log('All HTML files processed.');
