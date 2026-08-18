// ===== TUSHER GAMING PROGRESSION & SOUND SYNTHESIS ENGINE =====

// Sound Synthesis Engine via Web Audio API (Zero External MP3 Assets Required!)
class SoundFXEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playHeadshot() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playMiss() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playCombo() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.15);
    });
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.3, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.35);
    });
  }

  playMechanicalSwitch(type = 'blue') {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'blue') {
      // Crisp clicky
      osc.type = 'square';
      osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
    } else if (type === 'red') {
      // Smooth linear thock
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
    } else if (type === 'brown') {
      // Tactile bump
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    } else {
      // Hall Effect Magnetic Rapid Trigger
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.03);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  playSpinTick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }
}

export const soundFX = new SoundFXEngine();

// ===== TUSHER GAMER XP & LEVELING SYSTEM =====
const RANKS = [
  { level: 1, title: 'Recruit', minXP: 0, badge: '🛡️', color: 'text-gray-400' },
  { level: 5, title: 'Scout', minXP: 500, badge: '⚡', color: 'text-blue-400' },
  { level: 10, title: 'Corporal', minXP: 1200, badge: '🎯', color: 'text-emerald-400' },
  { level: 15, title: 'Veteran', minXP: 2500, badge: '🔥', color: 'text-amber-400' },
  { level: 25, title: 'Master', minXP: 5000, badge: '💎', color: 'text-cyan-accent' },
  { level: 35, title: 'Grandmaster', minXP: 10000, badge: '👑', color: 'text-magenta-accent' },
  { level: 50, title: 'Apex Legend', minXP: 20000, badge: '🌟', color: 'text-gold-accent' },
];

export const ACHIEVEMENTS = [
  { id: 'first_blood', name: 'First Blood', desc: 'Played your first game in the Arcade', icon: 'crosshair', xp: 100 },
  { id: 'sharpshooter', name: 'Sharpshooter', desc: 'Achieved 90%+ accuracy in GridShot', icon: 'target', xp: 250 },
  { id: 'reflex_god', name: 'Reflex God', desc: 'Reacted under 180ms in Reflex Benchmark', icon: 'zap', xp: 300 },
  { id: 'score_50k', name: 'Arcade Champion', desc: 'Scored 50,000+ points and unlocked 10% promo voucher', icon: 'award', xp: 500 },
  { id: 'chroma_master', name: 'Chroma Master', desc: 'Tested all 7 RGB Chroma lighting modes in Loadout Lab', icon: 'palette', xp: 150 },
  { id: 'builder_elite', name: 'Setup Architect', desc: 'Built a full 8-piece gaming battle station', icon: 'cpu', xp: 250 },
  { id: 'switch_tester', name: 'Switch Connoisseur', desc: 'Tested all mechanical keyboard switch sounds', icon: 'volume-2', xp: 100 },
  { id: 'loot_goblin', name: 'Loot Goblin', desc: 'Opened your first Daily Cyber Mystery Crate', icon: 'gift', xp: 150 },
  { id: 'streak_3', name: 'Daily Devotee', desc: 'Maintained a 3-Day check-in streak', icon: 'calendar', xp: 300 },
  { id: 'wheel_spinner', name: 'Wheel of Fortune', desc: 'Spun the Cyber Lucky Wheel', icon: 'disc', xp: 100 },
  { id: 'sens_master', name: 'Aim Transporter', desc: 'Converted sensitivity across games', icon: 'sliders', xp: 150 },
  { id: 'crosshair_pro', name: 'Reticle Designer', desc: 'Created and copied a custom esports crosshair', icon: 'maximize', xp: 150 },
  { id: 'squad_recruiter', name: 'Squad Leader', desc: 'Posted in the Esports Squad Lounge', icon: 'users', xp: 200 },
  { id: 'soundboard_hype', name: 'Hype Master', desc: 'Triggered 5 soundboard voice lines', icon: 'radio', xp: 100 },
  { id: 'coupon_redeemer', name: 'Smart Saver', desc: 'Applied an Arcade or Rewards coupon at checkout', icon: 'tag', xp: 300 },
];

class TusherProgressionEngine {
  constructor() {
    this.xp = parseInt(localStorage.getItem('tg_gamer_xp') || '0');
    this.unlockedAchievements = JSON.parse(localStorage.getItem('tg_achievements') || '[]');
  }

  getXP() {
    return this.xp;
  }

  addXP(amount, reason = '') {
    this.xp += amount;
    localStorage.setItem('tg_gamer_xp', this.xp.toString());
    this.updateUI();

    if (reason) {
      this.showXPToast(`+${amount} XP: ${reason}`);
    }

    this.checkRankUp();
  }

  getCurrentRank() {
    let current = RANKS[0];
    for (const r of RANKS) {
      if (this.xp >= r.minXP) {
        current = r;
      } else {
        break;
      }
    }
    return current;
  }

  getNextRank() {
    const current = this.getCurrentRank();
    const currentIndex = RANKS.findIndex(r => r.level === current.level);
    return RANKS[currentIndex + 1] || null;
  }

  getRankProgressPercent() {
    const current = this.getCurrentRank();
    const next = this.getNextRank();
    if (!next) return 100;
    const progress = (this.xp - current.minXP) / (next.minXP - current.minXP);
    return Math.min(Math.max(Math.round(progress * 100), 0), 100);
  }

  unlockAchievement(id) {
    if (this.unlockedAchievements.includes(id)) return;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;

    this.unlockedAchievements.push(id);
    localStorage.setItem('tg_achievements', JSON.stringify(this.unlockedAchievements));
    this.addXP(ach.xp, `Achievement: ${ach.name}`);
    soundFX.playFanfare();
    this.showAchievementModal(ach);
  }

  checkRankUp() {
    const current = this.getCurrentRank();
    const lastNotifiedLevel = parseInt(localStorage.getItem('tg_last_rank_level') || '1');
    if (current.level > lastNotifiedLevel) {
      localStorage.setItem('tg_last_rank_level', current.level.toString());
      soundFX.playFanfare();
      this.showRankUpModal(current);
    }
  }

  showXPToast(msg) {
    let toast = document.getElementById('xpToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'xpToast';
      toast.className = 'fixed top-24 right-6 z-50 pointer-events-none transition-all duration-300 transform translate-y-2 opacity-0';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="px-4 py-2 rounded-xl glass-strong border border-cyan-accent/40 shadow-glow-cyan-sm flex items-center gap-2 text-xs font-mono font-bold text-cyan-accent">
        <span class="w-2 h-2 rounded-full bg-cyan-accent animate-ping"></span>
        <span>${msg}</span>
      </div>
    `;

    toast.classList.remove('translate-y-2', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-2', 'opacity-0');
    }, 2500);
  }

  showAchievementModal(ach) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in';
    modal.innerHTML = `
      <div class="glass-strong rounded-3xl p-8 max-w-sm w-full text-center border border-gold-accent/40 shadow-2xl space-y-4 animate-scale-up">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center text-3xl">
          🏆
        </div>
        <div>
          <div class="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">ACHIEVEMENT UNLOCKED</div>
          <h3 class="font-heading font-bold text-2xl text-white mt-1">${ach.name}</h3>
          <p class="text-xs text-gray-300 mt-1">${ach.desc}</p>
        </div>
        <div class="p-3 rounded-xl bg-nexus-900 border border-white/5 text-xs font-mono text-cyan-accent font-bold">
          +${ach.xp} XP AWARDED
        </div>
        <button onclick="this.closest('.fixed').remove()" class="btn-primary w-full !py-2.5 !rounded-xl text-xs font-bold">
          Awesome!
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showRankUpModal(rank) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in';
    modal.innerHTML = `
      <div class="glass-strong rounded-3xl p-8 max-w-sm w-full text-center border border-cyan-accent/40 shadow-2xl space-y-4 animate-scale-up">
        <div class="w-16 h-16 rounded-2xl bg-cyan-accent/20 border border-cyan-accent/40 text-cyan-accent mx-auto flex items-center justify-center text-3xl animate-bounce">
          ${rank.badge}
        </div>
        <div>
          <div class="text-[10px] font-mono uppercase tracking-widest text-cyan-accent font-bold">RANK LEVEL UP!</div>
          <h3 class="font-heading font-bold text-3xl text-white mt-1">Level ${rank.level}</h3>
          <p class="text-sm font-semibold ${rank.color} mt-0.5">${rank.title}</p>
        </div>
        <p class="text-xs text-gray-400">You've unlocked higher esports prestige and special discounts across Tusher Gaming!</p>
        <button onclick="this.closest('.fixed').remove()" class="btn-primary w-full !py-2.5 !rounded-xl text-xs font-bold">
          Claim Prestige
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  updateUI() {
    const xpBadges = document.querySelectorAll('.user-xp-display');
    const rankBadges = document.querySelectorAll('.user-rank-display');
    const xpProgressBars = document.querySelectorAll('.user-xp-progress');

    const rank = this.getCurrentRank();
    const percent = this.getRankProgressPercent();

    xpBadges.forEach(el => el.textContent = `${this.xp} XP`);
    rankBadges.forEach(el => el.textContent = `Lv.${rank.level} ${rank.title}`);
    xpProgressBars.forEach(el => el.style.width = `${percent}%`);
  }
}

export const progression = new TusherProgressionEngine();
