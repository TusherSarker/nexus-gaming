import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES_DIR = path.join(__dirname, '..', 'public', 'categories');
if (!fs.existsSync(CATEGORIES_DIR)) {
  fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
}

// 20 High-Definition Vector Game Logos & Badges
const GAME_LOGOS = {
  'pubg-mobile': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="pubg-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="50%" stop-color="#0c0a09"/>
      <stop offset="100%" stop-color="#292524"/>
    </linearGradient>
    <linearGradient id="pubg-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="pubg-orange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </linearGradient>
    <filter id="pubg-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#F59E0B" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#pubg-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#pubg-gold)" stroke-width="2" stroke-opacity="0.3"/>
  <circle cx="100" cy="100" r="75" fill="#F59E0B" fill-opacity="0.06"/>
  
  <!-- Level 3 Spetsnaz Helmet Silhouette -->
  <g filter="url(#pubg-glow)">
    <!-- Helmet Dome -->
    <path d="M55 95 C55 58 72 42 100 42 C128 42 145 58 145 95 C145 118 138 132 100 135 C62 132 55 118 55 95 Z" fill="#292524" stroke="url(#pubg-gold)" stroke-width="3"/>
    <!-- Visor Guard Plate -->
    <path d="M48 88 L152 88 L146 112 L54 112 Z" fill="#1c1917" stroke="url(#pubg-gold)" stroke-width="2.5"/>
    <!-- Visor Slit (Golden Glass) -->
    <rect x="62" y="94" width="76" height="10" rx="2" fill="url(#pubg-gold)"/>
    <!-- Helmet Rivets & Ear Protectors -->
    <circle cx="50" cy="98" r="4" fill="#FBBF24"/>
    <circle cx="150" cy="98" r="4" fill="#FBBF24"/>
    <!-- Chin Strap -->
    <path d="M70 128 L100 142 L130 128" fill="none" stroke="#78716c" stroke-width="3" stroke-linecap="round"/>
  </g>
  
  <!-- PUBG MOBILE Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="url(#pubg-orange)" stroke="#FED7AA" stroke-width="1"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="12" letter-spacing="1.5">PUBG MOBILE</text>
  </g>
</svg>`,

  'cod-mobile': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="cod-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="cod-hazard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EAB308"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>
    <filter id="cod-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#EAB308" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#cod-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#cod-hazard)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Tactical Crosshair Background -->
  <circle cx="100" cy="90" r="55" fill="none" stroke="#EAB308" stroke-width="1" stroke-opacity="0.2" stroke-dasharray="6,4"/>
  <line x1="100" y1="28" x2="100" y2="45" stroke="#EAB308" stroke-width="2" stroke-opacity="0.6"/>
  <line x1="100" y1="135" x2="100" y2="152" stroke="#EAB308" stroke-width="2" stroke-opacity="0.6"/>
  <line x1="38" y1="90" x2="55" y2="90" stroke="#EAB308" stroke-width="2" stroke-opacity="0.6"/>
  <line x1="145" y1="90" x2="162" y2="90" stroke="#EAB308" stroke-width="2" stroke-opacity="0.6"/>

  <!-- Ghost Skull Emblem -->
  <g filter="url(#cod-glow)">
    <!-- Skull Cranium -->
    <path d="M68 65 C68 45 80 38 100 38 C120 38 132 45 132 65 C132 82 136 98 126 112 C120 120 114 125 100 125 C86 125 80 120 74 112 C64 98 68 82 68 65 Z" fill="#1e293b" stroke="url(#cod-hazard)" stroke-width="2.5"/>
    <!-- Eye Sockets -->
    <path d="M78 72 Q86 68 92 78 Q84 86 78 72 Z" fill="#020617"/>
    <path d="M122 72 Q114 68 108 78 Q116 86 122 72 Z" fill="#020617"/>
    <!-- Nose Cavity -->
    <polygon points="100,82 95,94 105,94" fill="#020617"/>
    <!-- Tactical Skull Teeth -->
    <rect x="85" y="105" width="6" height="12" rx="1" fill="url(#cod-hazard)"/>
    <rect x="94" y="105" width="5" height="14" rx="1" fill="url(#cod-hazard)"/>
    <rect x="101" y="105" width="5" height="14" rx="1" fill="url(#cod-hazard)"/>
    <rect x="109" y="105" width="6" height="12" rx="1" fill="url(#cod-hazard)"/>
    <!-- Headset -->
    <path d="M58 75 C52 75 52 95 58 95 Z" fill="url(#cod-hazard)"/>
    <path d="M142 75 C148 75 148 95 142 95 Z" fill="url(#cod-hazard)"/>
    <path d="M58 78 C58 48 72 32 100 32 C128 32 142 48 142 78" fill="none" stroke="url(#cod-hazard)" stroke-width="3"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#020617" stroke="url(#cod-hazard)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#EAB308" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="12" letter-spacing="1.5">COD MOBILE</text>
  </g>
</svg>`,

  'efootball': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="efoot-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#075985"/>
    </linearGradient>
    <linearGradient id="efoot-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </linearGradient>
    <filter id="efoot-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#38BDF8" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#efoot-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="#38BDF8" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Dynamic Soccer Ball with Speed Waves -->
  <g filter="url(#efoot-glow)">
    <circle cx="100" cy="85" r="46" fill="#FFFFFF" stroke="#0284c7" stroke-width="2"/>
    <!-- Ball Hexagons -->
    <polygon points="100,70 114,80 109,96 91,96 86,80" fill="#0369a1"/>
    <polygon points="100,50 108,60 92,60" fill="#0369a1"/>
    <polygon points="132,70 124,78 135,88" fill="#0369a1"/>
    <polygon points="68,70 76,78 65,88" fill="#0369a1"/>
    <polygon points="120,110 112,102 125,98" fill="#0369a1"/>
    <polygon points="80,110 88,102 75,98" fill="#0369a1"/>
    <!-- Speed Motion Arcs -->
    <path d="M42 60 C30 85 45 125 75 138" fill="none" stroke="url(#efoot-yellow)" stroke-width="4" stroke-linecap="round"/>
    <path d="M158 60 C170 85 155 125 125 138" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
  </g>
  
  <!-- eFootball Text Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#0c4a6e" stroke="url(#efoot-yellow)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Trebuchet MS', sans-serif" font-weight="900" font-size="13" letter-spacing="1">eFootball™</text>
  </g>
</svg>`,

  'free-fire': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="ff-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#450a0a"/>
      <stop offset="50%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#292524"/>
    </linearGradient>
    <linearGradient id="ff-flame" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F97316"/>
      <stop offset="50%" stop-color="#EF4444"/>
      <stop offset="100%" stop-color="#DC2626"/>
    </linearGradient>
    <linearGradient id="ff-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <filter id="ff-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="7" flood-color="#EF4444" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#ff-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#ff-flame)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Burning Knife & Fire Crest -->
  <g filter="url(#ff-glow)">
    <!-- Fire Flame Aura -->
    <path d="M100 28 C115 50 145 68 145 98 C145 125 125 142 100 145 C75 142 55 125 55 98 C55 68 85 50 100 28 Z" fill="url(#ff-flame)" opacity="0.25"/>
    <path d="M100 45 C110 62 130 78 130 100 C130 118 115 132 100 134 C85 132 70 118 70 100 C70 78 90 62 100 45 Z" fill="url(#ff-flame)"/>
    <!-- Inner Golden Core Flame -->
    <path d="M100 65 C106 78 116 90 116 104 C116 116 108 124 100 126 C92 124 84 116 84 104 C84 90 94 78 100 65 Z" fill="url(#ff-gold)"/>
    <!-- Dagger Silhouette -->
    <polygon points="100,50 104,95 100,115 96,95" fill="#FFFFFF"/>
    <rect x="92" y="115" width="16" height="4" rx="2" fill="#FBBF24"/>
    <rect x="97" y="119" width="6" height="12" rx="1" fill="#78716c"/>
  </g>
  
  <!-- FREE FIRE Text Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="url(#ff-flame)" stroke="#FDE047" stroke-width="1.2"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="12" letter-spacing="2">FREE FIRE</text>
  </g>
</svg>`,

  'mobile-legends': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="ml-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#172554"/>
    </linearGradient>
    <linearGradient id="ml-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#EAB308"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>
    <linearGradient id="ml-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <filter id="ml-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#EAB308" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#ml-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#ml-gold)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Celestial Wings & Crown Crest -->
  <g filter="url(#ml-glow)">
    <!-- Dragon Wing Left -->
    <path d="M98 75 C80 50 45 48 35 68 C45 82 60 92 98 108 Z" fill="url(#ml-blue)"/>
    <path d="M98 88 C75 75 52 82 45 96 C60 105 75 110 98 118 Z" fill="url(#ml-blue)" opacity="0.7"/>
    <!-- Dragon Wing Right -->
    <path d="M102 75 C120 50 155 48 165 68 C155 82 140 92 102 108 Z" fill="url(#ml-blue)"/>
    <path d="M102 88 C125 75 148 82 155 96 C140 105 125 110 102 118 Z" fill="url(#ml-blue)" opacity="0.7"/>
    <!-- Central Mythic Sword & Crown -->
    <polygon points="100,32 106,75 100,135 94,75" fill="url(#ml-gold)"/>
    <path d="M85 70 L100 48 L115 70 L125 60 L100 95 L75 60 Z" fill="url(#ml-gold)" stroke="#78350f" stroke-width="1"/>
    <!-- Center Radiant Diamond Gem -->
    <polygon points="100,68 110,80 100,92 90,80" fill="#38BDF8"/>
  </g>
  
  <!-- MLBB Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#1e1b4b" stroke="url(#ml-gold)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FDE047" font-family="'Trebuchet MS', sans-serif" font-weight="900" font-size="12" letter-spacing="1">MLBB • BANG BANG</text>
  </g>
</svg>`,

  'valorant': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="val-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="val-red" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF4655"/>
      <stop offset="100%" stop-color="#DC2626"/>
    </linearGradient>
    <filter id="val-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#FF4655" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#val-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#val-red)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Iconic Valorant 'V' Radianite Shards -->
  <g filter="url(#val-glow)">
    <!-- Left Shard -->
    <path d="M52 48 L96 48 L96 98 L74 128 L52 128 Z" fill="url(#val-red)"/>
    <!-- Right Shard -->
    <path d="M104 98 L148 48 L148 78 L126 128 L104 128 Z" fill="url(#val-red)"/>
  </g>
  
  <!-- VALORANT Text Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#0f172a" stroke="url(#val-red)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="13" letter-spacing="3">VALORANT</text>
  </g>
</svg>`,

  'fortnite': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="fn-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b0764"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="fn-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
    <filter id="fn-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#818CF8" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#fn-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#fn-blue)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Fortnite Bold 'F' Emblem -->
  <g filter="url(#fn-glow)">
    <path d="M68 38 L136 38 L136 62 L98 62 L98 82 L128 82 L128 104 L98 104 L98 142 L68 142 Z" fill="url(#fn-blue)" stroke="#FFFFFF" stroke-width="2"/>
    <!-- V-Buck Coin Icon Top Right -->
    <circle cx="145" cy="55" r="18" fill="#FBBF24" stroke="#D97706" stroke-width="2"/>
    <text x="145" y="62" text-anchor="middle" fill="#78350F" font-family="'Arial Black', sans-serif" font-weight="900" font-size="18">V</text>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#1e1b4b" stroke="url(#fn-blue)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="13" letter-spacing="2">FORTNITE</text>
  </g>
</svg>`,

  'league-of-legends': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="lol-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#042f2e"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="lol-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#CA8A04"/>
      <stop offset="100%" stop-color="#A16207"/>
    </linearGradient>
    <filter id="lol-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#CA8A04" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#lol-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#lol-gold)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Iconic LoL 'L' Crest & Hextech Gem -->
  <g filter="url(#lol-glow)">
    <!-- Golden Winged Shield -->
    <path d="M60 45 C60 45 100 35 140 45 C140 95 125 130 100 145 C75 130 60 95 60 45 Z" fill="#0f172a" stroke="url(#lol-gold)" stroke-width="3"/>
    <!-- Iconic LoL 'L' -->
    <path d="M85 58 L105 58 L105 108 L128 108 L128 124 L85 124 Z" fill="url(#lol-gold)"/>
    <!-- Hextech Crystal -->
    <polygon points="100,45 108,55 100,65 92,55" fill="#22D3EE"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#042f2e" stroke="url(#lol-gold)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FDE047" font-family="'Times New Roman', serif" font-weight="900" font-size="11" letter-spacing="1">LEAGUE OF LEGENDS</text>
  </g>
</svg>`,

  'apex-legends': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="apex-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#431407"/>
      <stop offset="50%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#0c0a09"/>
    </linearGradient>
    <linearGradient id="apex-orange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3A00"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
    <filter id="apex-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="7" flood-color="#FF3A00" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#apex-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#apex-orange)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Iconic Apex Predator Arrowhead Logo -->
  <g filter="url(#apex-glow)">
    <!-- Left Blade -->
    <path d="M100 38 L54 135 L76 135 L100 78 Z" fill="url(#apex-orange)"/>
    <!-- Right Blade -->
    <path d="M100 38 L146 135 L124 135 L100 78 Z" fill="url(#apex-orange)"/>
    <!-- Center Diamond Core -->
    <polygon points="100,90 114,120 100,132 86,120" fill="#FFFFFF"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#1c1917" stroke="url(#apex-orange)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="12" letter-spacing="2">APEX LEGENDS</text>
  </g>
</svg>`,

  'genshin-impact': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="genshin-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#312e81"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="genshin-star" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#67E8F9"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
    <filter id="genshin-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#67E8F9" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#genshin-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#genshin-star)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Primogem 4-Pointed Star -->
  <g filter="url(#genshin-glow)">
    <!-- 4-Pointed Stellar Crystal -->
    <path d="M100 32 Q100 85 148 95 Q100 105 100 152 Q100 105 52 95 Q100 85 100 32 Z" fill="url(#genshin-star)"/>
    <!-- Inner Core Facets -->
    <polygon points="100,55 125,95 100,130 75,95" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="100" cy="95" r="8" fill="#FDE047"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#1e1b4b" stroke="url(#genshin-star)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Trebuchet MS', sans-serif" font-weight="900" font-size="11" letter-spacing="1.5">GENSHIN IMPACT</text>
  </g>
</svg>`,

  'roblox': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="roblox-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
    <linearGradient id="roblox-silver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#94A3B8"/>
    </linearGradient>
    <filter id="roblox-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#FFFFFF" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#roblox-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.3"/>
  
  <!-- Iconic Tilted Roblox Cube -->
  <g transform="rotate(-15 100 85)" filter="url(#roblox-glow)">
    <!-- Outer 3D Square -->
    <rect x="62" y="47" width="76" height="76" rx="14" fill="url(#roblox-silver)" stroke="#09090b" stroke-width="2"/>
    <!-- Inner Hollow Square -->
    <rect x="86" y="71" width="28" height="28" rx="5" fill="#09090b"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#18181b" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="13" letter-spacing="3">ROBLOX</text>
  </g>
</svg>`,

  'minecraft': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="mc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532d"/>
      <stop offset="50%" stop-color="#052e16"/>
      <stop offset="100%" stop-color="#1c1917"/>
    </linearGradient>
    <filter id="mc-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#22C55E" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#mc-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="#22C55E" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- 3D Isometric Grass Block -->
  <g filter="url(#mc-glow)">
    <!-- Top Grass Plane -->
    <polygon points="100,38 148,62 100,86 52,62" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
    <!-- Left Dirt Face -->
    <polygon points="52,62 100,86 100,136 52,112" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <!-- Right Dirt Face -->
    <polygon points="100,86 148,62 148,112 100,136" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    <!-- Creeper Face Pixels -->
    <rect x="68" y="80" width="10" height="10" fill="#14532d"/>
    <rect x="84" y="80" width="10" height="10" fill="#14532d"/>
    <rect x="74" y="90" width="14" height="16" fill="#14532d"/>
    <rect x="68" y="106" width="6" height="12" fill="#14532d"/>
    <rect x="88" y="106" width="6" height="12" fill="#14532d"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#052e16" stroke="#22C55E" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="12" letter-spacing="2">MINECRAFT</text>
  </g>
</svg>`,

  'clash-of-clans': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="coc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="50%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#1c1917"/>
    </linearGradient>
    <linearGradient id="coc-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="coc-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#F59E0B" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#coc-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#coc-gold)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Crossed Battle Axes & Barbarian Crown -->
  <g filter="url(#coc-glow)">
    <!-- Left Axe Handle & Blade -->
    <line x1="45" y1="135" x2="155" y2="45" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <path d="M135 35 C155 35 165 55 145 75 Z" fill="#94A3B8" stroke="#334155" stroke-width="2"/>
    <!-- Right Axe Handle & Blade -->
    <line x1="155" y1="135" x2="45" y2="45" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <path d="M65 35 C45 35 35 55 55 75 Z" fill="#94A3B8" stroke="#334155" stroke-width="2"/>
    <!-- Barbarian King Crown -->
    <path d="M70 115 L78 72 L92 88 L100 62 L108 88 L122 72 L130 115 Z" fill="url(#coc-gold)" stroke="#78350f" stroke-width="2"/>
    <!-- Glowing Ruby Gems -->
    <circle cx="100" cy="100" r="6" fill="#EF4444"/>
    <circle cx="82" cy="100" r="4" fill="#3B82F6"/>
    <circle cx="118" cy="100" r="4" fill="#3B82F6"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#451a03" stroke="url(#coc-gold)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FDE047" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="11" letter-spacing="1">CLASH OF CLANS</text>
  </g>
</svg>`,

  'brawl-stars': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="bs-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="bs-star" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <filter id="bs-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#FDE047" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#bs-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#bs-star)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Brawl Stars Iconic Star Badge -->
  <g filter="url(#bs-glow)">
    <!-- Star Body -->
    <polygon points="100,32 118,72 162,72 126,98 140,140 100,114 60,140 74,98 38,72 82,72" fill="url(#bs-star)" stroke="#78350f" stroke-width="3"/>
    <!-- Cartoon Skull Center -->
    <circle cx="100" cy="88" r="22" fill="#FFFFFF" stroke="#1c1917" stroke-width="2"/>
    <circle cx="92" cy="84" r="5" fill="#1c1917"/>
    <circle cx="108" cy="84" r="5" fill="#1c1917"/>
    <polygon points="100,90 97,98 103,98" fill="#1c1917"/>
    <rect x="94" y="102" width="4" height="6" rx="1" fill="#1c1917"/>
    <rect x="102" y="102" width="4" height="6" rx="1" fill="#1c1917"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#1e3a8a" stroke="url(#bs-star)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="12" letter-spacing="1.5">BRAWL STARS</text>
  </g>
</svg>`,

  'ea-fc-mobile': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="fc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532d"/>
      <stop offset="50%" stop-color="#052e16"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
    <linearGradient id="fc-volt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A3E635"/>
      <stop offset="100%" stop-color="#84CC16"/>
    </linearGradient>
    <filter id="fc-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#A3E635" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#fc-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#fc-volt)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- EA SPORTS FC Iconic Triangle -->
  <g filter="url(#fc-glow)">
    <!-- Futuristic Inverted Triangle -->
    <polygon points="100,138 48,45 152,45" fill="#022c22" stroke="url(#fc-volt)" stroke-width="4"/>
    <polygon points="100,118 64,55 136,55" fill="none" stroke="url(#fc-volt)" stroke-width="2" stroke-opacity="0.6"/>
    <!-- FC Monogram -->
    <text x="100" y="85" text-anchor="middle" fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="28" letter-spacing="1">FC</text>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#052e16" stroke="url(#fc-volt)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#A3E635" font-family="'Trebuchet MS', sans-serif" font-weight="900" font-size="11" letter-spacing="1">EA SPORTS FC™</text>
  </g>
</svg>`,

  'cs2': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="cs-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="cs-split" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
    <filter id="cs-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#F97316" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#cs-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="#F97316" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- CS2 Silhouette Operator with Rifle -->
  <g filter="url(#cs-glow)">
    <circle cx="100" cy="50" r="14" fill="#F97316"/>
    <!-- Torso & Rifle Silhouette -->
    <path d="M78 72 L122 72 L128 128 L112 140 L100 105 L88 140 L72 128 Z" fill="#F97316"/>
    <path d="M90 76 L152 64 L158 74 L120 88" fill="#F97316"/>
    <rect x="145" y="60" width="12" height="4" fill="#F97316"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#0f172a" stroke="#F97316" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="13" letter-spacing="2">COUNTER-STRIKE 2</text>
  </g>
</svg>`,

  'gta-online': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="gta-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="50%" stop-color="#022c22"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
    <linearGradient id="gta-green" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="gta-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#34D399" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#gta-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#gta-green)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Roman Numeral V with Dollar Engraving -->
  <g filter="url(#gta-glow)">
    <path d="M62 45 L85 45 L100 115 L115 45 L138 45 L112 138 L88 138 Z" fill="url(#gta-green)" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="100" y="85" text-anchor="middle" fill="#FFFFFF" font-family="'Pricedown', 'Impact', sans-serif" font-weight="900" font-size="28">$</text>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#022c22" stroke="url(#gta-green)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#34D399" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="12" letter-spacing="1.5">GTA ONLINE</text>
  </g>
</svg>`,

  'overwatch-2': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="ow-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="ow-orange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB923C"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
    <filter id="ow-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#FB923C" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#ow-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#ow-orange)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Iconic Overwatch Symbol with '2' -->
  <g filter="url(#ow-glow)">
    <!-- Top Arc (Orange) -->
    <path d="M68 55 C80 42 120 42 132 55 L120 70 C112 62 88 62 80 70 Z" fill="url(#ow-orange)"/>
    <!-- Bottom Wings (Silver) -->
    <path d="M58 78 C52 95 60 120 80 132 L92 118 C80 110 74 92 78 78 Z" fill="#CBD5E1"/>
    <path d="M142 78 C148 95 140 120 120 132 L108 118 C120 110 126 92 122 78 Z" fill="#CBD5E1"/>
    <!-- Superscript '2' -->
    <text x="145" y="58" fill="url(#ow-orange)" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="28">2</text>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#0f172a" stroke="url(#ow-orange)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#FFFFFF" font-family="'Trebuchet MS', sans-serif" font-weight="900" font-size="12" letter-spacing="1">OVERWATCH 2</text>
  </g>
</svg>`,

  'rocket-league': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="rl-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0369a1"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="rl-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <filter id="rl-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#38BDF8" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#rl-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#rl-cyan)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Rocket League Shield & Turbo Battle Car -->
  <g filter="url(#rl-glow)">
    <!-- Tournament Shield -->
    <path d="M55 45 L145 45 L145 95 C145 125 100 148 100 148 C100 148 55 125 55 95 Z" fill="#0f172a" stroke="url(#rl-cyan)" stroke-width="2.5"/>
    <!-- Octane Battle-Car Silhouette -->
    <path d="M68 95 L82 82 L118 82 L132 95 L128 108 L72 108 Z" fill="#38BDF8"/>
    <!-- Wheels -->
    <circle cx="78" cy="108" r="7" fill="#F97316"/>
    <circle cx="122" cy="108" r="7" fill="#F97316"/>
    <!-- Turbo Flame -->
    <polygon points="65,95 50,92 56,98 48,102 65,98" fill="#F97316"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#0f172a" stroke="url(#rl-cyan)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#38BDF8" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="12" letter-spacing="1">ROCKET LEAGUE</text>
  </g>
</svg>`,

  'cod-warzone': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="wz-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="50%" stop-color="#0c0a09"/>
      <stop offset="100%" stop-color="#18181b"/>
    </linearGradient>
    <linearGradient id="wz-amber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="wz-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#F59E0B" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="200" height="200" rx="36" fill="url(#wz-bg)"/>
  <rect x="3" y="3" width="194" height="194" rx="33" fill="none" stroke="url(#wz-amber)" stroke-width="2" stroke-opacity="0.4"/>
  
  <!-- Warzone Gas Mask & Skull -->
  <g filter="url(#wz-glow)">
    <!-- Gas Mask Skull -->
    <path d="M68 62 C68 45 80 38 100 38 C120 38 132 45 132 62 C132 85 138 105 125 120 C115 130 100 135 100 135 C100 135 85 130 75 120 C62 105 68 85 68 62 Z" fill="#292524" stroke="url(#wz-amber)" stroke-width="2.5"/>
    <!-- Gas Goggles -->
    <circle cx="82" cy="72" r="12" fill="#0c0a09" stroke="url(#wz-amber)" stroke-width="2"/>
    <circle cx="118" cy="72" r="12" fill="#0c0a09" stroke="url(#wz-amber)" stroke-width="2"/>
    <!-- Gas Filter Canister -->
    <circle cx="100" cy="108" r="15" fill="#1c1917" stroke="url(#wz-amber)" stroke-width="2"/>
    <line x1="90" y1="108" x2="110" y2="108" stroke="url(#wz-amber)" stroke-width="2"/>
  </g>
  
  <!-- Banner -->
  <g transform="translate(100, 166)">
    <rect x="-65" y="-14" width="130" height="22" rx="6" fill="#0c0a09" stroke="url(#wz-amber)" stroke-width="1.5"/>
    <text x="0" y="2" text-anchor="middle" fill="#F59E0B" font-family="'Impact', 'Arial Black', sans-serif" font-weight="900" font-size="12" letter-spacing="2">WARZONE</text>
  </g>
</svg>`
};

for (const [slug, svgContent] of Object.entries(GAME_LOGOS)) {
  const filePath = path.join(CATEGORIES_DIR, `${slug}.svg`);
  fs.writeFileSync(filePath, svgContent.trim(), 'utf8');
  console.log(`Generated logo: public/categories/${slug}.svg`);
}

console.log('✅ Successfully generated all 20 game logos in public/categories/!');
