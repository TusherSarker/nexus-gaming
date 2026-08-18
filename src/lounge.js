// ===== TUSHER GAMING ESPORTS SQUAD LOUNGE & SOUNDBOARD ENGINE =====
import './style.css';
import { soundFX, progression } from './xp-engine.js';
import { getCartCount } from './cart-store.js';

// Pre-seeded verified squad posts
const DEFAULT_SQUAD_POSTS = [
  { id: 1, tag: 'Soul_Reaper99', game: 'PUBG Mobile', rank: 'Conqueror Tier', msg: 'Need 2 aggressive fraggers with 4+ KD for Erangel tier push tonight. Mic required! (UID: 512994821)', time: '2 mins ago' },
  { id: 2, tag: 'Nobru_Fanatic', game: 'Free Fire', rank: 'Grandmaster', msg: 'Looking for 4v4 Clash Squad sniper for Tusher tournament bracket. Add me fast (UID: 521992144)', time: '8 mins ago' },
  { id: 3, tag: 'Ghost_Sniper', game: 'Call of Duty: Mobile', rank: 'Legendary 10K+', msg: 'Search & Destroy squad recruiting 1 SMG rusher. Join Discord room 4 (UID: 519283741)', time: '15 mins ago' },
  { id: 4, tag: 'Messi_Master', game: 'eFootball 2026', rank: 'Division 1', msg: 'Looking for 2v2 Co-Op partner for tonight\'s Champions Cup! (UID: 8192831)', time: '22 mins ago' },
];

// 12 Esports Soundboard Clips
const SOUNDBOARD_CLIPS = [
  { id: 'headshot', name: 'Headshot Crit', icon: 'crosshair', color: 'text-cyan-accent', freq: 1600, type: 'triangle' },
  { id: 'booyah', name: 'Booyah Horn', icon: 'trophy', color: 'text-amber-400', freq: 520, type: 'sawtooth' },
  { id: 'bomb', name: 'Bomb Planted', icon: 'alert-triangle', color: 'text-red-400', freq: 300, type: 'square' },
  { id: 'airdrop', name: 'Air Drop Siren', icon: 'package', color: 'text-blue-400', freq: 880, type: 'sine' },
  { id: 'multikill', name: 'Mega Kill', icon: 'zap', color: 'text-magenta-accent', freq: 1100, type: 'sawtooth' },
  { id: 'victory', name: 'Victory Stinger', icon: 'award', color: 'text-gold-accent', freq: 740, type: 'sine' },
  { id: 'caster', name: 'Caster Hype', icon: 'radio', color: 'text-emerald-400', freq: 650, type: 'triangle' },
  { id: 'sniper', name: 'Sniper Fire', icon: 'target', color: 'text-cyan-accent', freq: 2200, type: 'square' },
  { id: 'flashbang', name: 'Flash Tinnitus', icon: 'sun', color: 'text-gray-300', freq: 3500, type: 'sine' },
  { id: 'defuse', name: 'Defuse Code', icon: 'shield', color: 'text-emerald-400', freq: 950, type: 'square' },
  { id: 'respawn', name: 'Respawn Chime', icon: 'refresh-cw', color: 'text-blue-400', freq: 440, type: 'triangle' },
  { id: 'critical', name: 'Critical Hit', icon: 'sparkles', color: 'text-magenta-accent', freq: 1400, type: 'sawtooth' },
];

let soundPlayCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  renderSquadFeed();
  renderSoundboard();

  progression.updateUI();
  updateCartBadge();
});

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ===== SQUAD FEED =====
function getSquadPosts() {
  const stored = localStorage.getItem('tg_squad_posts');
  if (stored) {
    return JSON.parse(stored);
  }
  return DEFAULT_SQUAD_POSTS;
}

function renderSquadFeed() {
  const container = document.getElementById('squadFeedContainer');
  if (!container) return;

  const posts = getSquadPosts();
  container.innerHTML = posts.map(p => `
    <div class="p-4 rounded-2xl bg-nexus-950 border border-white/5 space-y-2 hover:border-cyan-accent/30 transition-all">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-cyan-accent/20 text-cyan-accent font-bold text-xs flex items-center justify-center font-mono">
            ${p.tag.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span class="font-bold text-white text-xs">${p.tag}</span>
            <span class="text-[10px] text-gray-400 ml-1.5">• ${p.game} (${p.rank})</span>
          </div>
        </div>
        <span class="text-[10px] font-mono text-gray-500">${p.time || 'Just now'}</span>
      </div>
      <p class="text-xs text-gray-300 leading-relaxed pl-9">${p.msg}</p>
    </div>
  `).join('');
}

window.postSquadNeed = function() {
  const tag = document.getElementById('squadTag').value.trim();
  const game = document.getElementById('squadGame').value;
  const rank = document.getElementById('squadRank').value.trim();
  const msg = document.getElementById('squadMsg').value.trim();

  if (!tag || !rank || !msg) return;

  const posts = getSquadPosts();
  const newPost = {
    id: Date.now(),
    tag,
    game,
    rank,
    msg,
    time: 'Just now',
  };

  posts.unshift(newPost);
  localStorage.setItem('tg_squad_posts', JSON.stringify(posts));

  soundFX.playFanfare();
  progression.unlockAchievement('squad_recruiter');
  progression.addXP(200, 'Squad Recruitment Published');

  document.getElementById('squadPostForm').reset();
  renderSquadFeed();
};

// ===== SOUNDBOARD ENGINE =====
function renderSoundboard() {
  const grid = document.getElementById('soundboardGrid');
  if (!grid) return;

  grid.innerHTML = SOUNDBOARD_CLIPS.map(clip => `
    <button class="soundboard-btn p-3 rounded-2xl bg-nexus-950 border border-white/5 hover:border-magenta-accent/40 text-left transition-all group flex flex-col justify-between h-20" data-clip="${clip.id}">
      <div class="flex items-center justify-between w-full">
        <i data-lucide="${clip.icon}" class="w-4 h-4 ${clip.color}"></i>
        <span class="text-[9px] font-mono text-gray-500 uppercase">SFX</span>
      </div>
      <span class="text-xs font-bold text-white group-hover:text-magenta-accent transition-colors block truncate">${clip.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.soundboard-btn').forEach(btn => {
    btn.onclick = () => {
      const clipId = btn.dataset.clip;
      const clip = SOUNDBOARD_CLIPS.find(c => c.id === clipId);
      if (!clip) return;

      playProceduralSFX(clip.freq, clip.type);
      soundPlayCount++;

      btn.classList.add('scale-95', 'border-magenta-accent');
      setTimeout(() => btn.classList.remove('scale-95', 'border-magenta-accent'), 150);

      if (soundPlayCount >= 5) {
        progression.unlockAchievement('soundboard_hype');
      }
    };
  });

  if (window.lucide) lucide.createIcons();
}

function playProceduralSFX(baseFreq, type) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}
