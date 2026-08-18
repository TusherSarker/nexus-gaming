// ===== TUSHER GAMING DAILY REWARDS & CYBER WHEEL ENGINE =====
import './style.css';
import { soundFX, progression } from './xp-engine.js';
import { getCartCount } from './cart-store.js';
import { initUniversalMobileNav } from './mobile-nav.js';
import { initAuthModal, updateNavbarUserUI } from './auth-modal.js';

// 7-Day Streak Rewards Configuration
const STREAK_REWARDS = [
  { day: 1, reward: '5% Top-Up Coupon', icon: 'tag', desc: '5% Off PUBG UC / Diamonds', claimed: false },
  { day: 2, reward: '+100 Tusher XP', icon: 'zap', desc: 'Prestige Level Boost', claimed: false },
  { day: 3, reward: '10% Hardware Coupon', icon: 'cpu', desc: '10% Off Keyboards/Mice', claimed: false },
  { day: 4, reward: 'Extra Wheel Spin', icon: 'disc', desc: '+1 Free Spin Token', claimed: false },
  { day: 5, reward: '60 UC / 100 Diamond Entry', icon: 'gift', desc: 'Weekly Raffle Ticket', claimed: false },
  { day: 6, reward: '+300 Tusher XP', icon: 'flame', desc: 'VIP Progression Boost', claimed: false },
  { day: 7, reward: 'Legendary 20% Crate Voucher', icon: 'crown', desc: 'Max 20% Off Storewide', claimed: false },
];

// Wheel Sectors
const WHEEL_SECTORS = [
  { label: '5% OFF', color: '#0a0e17', textColor: '#00f0ff', code: 'WHEEL-5', discount: 5 },
  { label: '+100 XP', color: '#111827', textColor: '#22c55e', xp: 100 },
  { label: '10% OFF', color: '#0a0e17', textColor: '#ff2d78', code: 'WHEEL-10', discount: 10 },
  { label: 'EXTRA SPIN', color: '#111827', textColor: '#ffd700', extraSpin: true },
  { label: '15% OFF', color: '#0a0e17', textColor: '#00f0ff', code: 'WHEEL-15', discount: 15 },
  { label: '+300 XP', color: '#111827', textColor: '#22c55e', xp: 300 },
  { label: '20% OFF', color: '#0a0e17', textColor: '#ffd700', code: 'WHEEL-20', discount: 20 },
  { label: 'BONUS UC', color: '#111827', textColor: '#ff2d78', code: 'WHEEL-UC60', discount: 8 },
];

let streakCount = parseInt(localStorage.getItem('tg_streak_count') || '1');
let isSpinning = false;
let wheelAngle = 0;
let wheelCanvas, wheelCtx;

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  initUniversalMobileNav();
  initAuthModal();
  updateNavbarUserUI();

  wheelCanvas = document.getElementById('wheelCanvas');
  if (wheelCanvas) {
    wheelCtx = wheelCanvas.getContext('2d');
    drawWheel();
  }

  renderStreakDays();
  initCrateUnboxing();
  initSpinWheel();
  renderLootBag();

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

// ===== 7-DAY STREAK LADDER =====
function renderStreakDays() {
  const container = document.getElementById('streakDaysContainer');
  if (!container) return;

  document.getElementById('streakCountText').textContent = `${streakCount} Day${streakCount > 1 ? 's' : ''}`;

  container.innerHTML = STREAK_REWARDS.map((item, idx) => {
    const isCurrent = idx + 1 === streakCount;
    const isUnlocked = idx + 1 <= streakCount;

    return `
      <div class="p-4 rounded-2xl ${isCurrent ? 'bg-amber-500/15 border-2 border-amber-500/50 shadow-glow-cyan-sm' : isUnlocked ? 'bg-nexus-950/80 border border-emerald-500/30' : 'bg-nexus-950/40 border border-white/5 opacity-60'} text-center space-y-2 transition-all">
        <div class="text-[10px] font-mono ${isCurrent ? 'text-amber-400 font-bold' : 'text-gray-400'} uppercase">Day ${item.day}</div>
        <div class="text-2xl">${idx === 6 ? '👑' : isUnlocked ? '🎁' : '🔒'}</div>
        <h4 class="font-bold text-white text-xs leading-tight">${item.reward}</h4>
        <span class="text-[10px] text-gray-400 block">${item.desc}</span>
        ${isCurrent ? `<span class="inline-block px-2 py-0.5 rounded bg-amber-500 text-nexus-900 font-bold text-[9px] font-mono">TODAY</span>` : isUnlocked ? `<span class="text-emerald-400 text-[10px] font-mono">✓ Claimed</span>` : ''}
      </div>
    `;
  }).join('');

  if (streakCount >= 3) {
    progression.unlockAchievement('streak_3');
  }
}

// ===== 3D MYSTERY CRATE UNBOXING =====
function initCrateUnboxing() {
  const btn = document.getElementById('openCrateBtn');
  const box = document.getElementById('crate3DBox');
  const aura = document.getElementById('crateAura');
  if (!btn || !box) return;

  btn.onclick = () => {
    soundFX.playMechanicalSwitch('blue');

    // Rumble Animation
    box.classList.add('animate-bounce');
    if (aura) aura.classList.remove('opacity-0');

    btn.disabled = true;
    btn.innerHTML = `<span>Unlocking Cyber Crate... ⚡</span>`;

    setTimeout(() => {
      box.classList.remove('animate-bounce');
      soundFX.playFanfare();
      progression.unlockAchievement('loot_goblin');

      // Generate Loot
      const possibleDiscounts = [10, 15, 20];
      const disc = possibleDiscounts[Math.floor(Math.random() * possibleDiscounts.length)];
      const code = `CRATE-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${disc}`;

      saveVoucher(code, disc, `Daily Cyber Crate (${disc}% Off)`);

      box.innerHTML = '💎';
      btn.innerHTML = `<span>✓ Unboxed ${disc}% Store Voucher!</span>`;
      btn.classList.add('!bg-success');

      progression.addXP(150, 'Daily Crate Unboxed');
      renderLootBag();
    }, 1500);
  };
}

// ===== CYBER SPIN WHEEL =====
function drawWheel() {
  if (!wheelCtx) return;
  const numSectors = WHEEL_SECTORS.length;
  const arc = (2 * Math.PI) / numSectors;
  const cx = 150;
  const cy = 150;
  const radius = 140;

  wheelCtx.clearRect(0, 0, 300, 300);

  WHEEL_SECTORS.forEach((sector, i) => {
    const angle = wheelAngle + i * arc;

    wheelCtx.beginPath();
    wheelCtx.moveTo(cx, cy);
    wheelCtx.arc(cx, cy, radius, angle, angle + arc);
    wheelCtx.fillStyle = sector.color;
    wheelCtx.fill();
    wheelCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    wheelCtx.lineWidth = 2;
    wheelCtx.stroke();

    // Text Label
    wheelCtx.save();
    wheelCtx.translate(cx, cy);
    wheelCtx.rotate(angle + arc / 2);
    wheelCtx.textAlign = 'right';
    wheelCtx.fillStyle = sector.textColor;
    wheelCtx.font = 'bold 12px Rajdhani, sans-serif';
    wheelCtx.fillText(sector.label, radius - 15, 4);
    wheelCtx.restore();
  });
}

function initSpinWheel() {
  const btn = document.getElementById('spinWheelBtn');
  if (!btn) return;

  btn.onclick = () => {
    if (isSpinning) return;
    isSpinning = true;
    btn.disabled = true;
    btn.innerHTML = `<span>Spinning the Cyber Wheel... 🔄</span>`;

    const totalSpins = 5 + Math.random() * 5;
    const targetAngle = wheelAngle + totalSpins * 2 * Math.PI;
    const duration = 4000;
    const start = performance.now();

    let lastTickAngle = wheelAngle;

    function animateWheel(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      wheelAngle = wheelAngle + (targetAngle - wheelAngle) * 0.05;

      if (Math.abs(wheelAngle - lastTickAngle) > 0.4) {
        soundFX.playSpinTick();
        lastTickAngle = wheelAngle;
      }

      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        isSpinning = false;
        soundFX.playFanfare();
        progression.unlockAchievement('wheel_spinner');

        // Determine Sector (Needle at top = 3*PI/2)
        const numSectors = WHEEL_SECTORS.length;
        const arc = (2 * Math.PI) / numSectors;
        const normalizedAngle = (1.5 * Math.PI - wheelAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor(normalizedAngle / arc) % numSectors;
        const prize = WHEEL_SECTORS[winningIndex];

        if (prize.discount) {
          saveVoucher(prize.code, prize.discount, `Cyber Wheel (${prize.label})`);
          progression.addXP(200, `Won ${prize.label} Coupon`);
        } else if (prize.xp) {
          progression.addXP(prize.xp, `Wheel Prize: +${prize.xp} XP`);
        }

        btn.innerHTML = `<span>✓ Won: ${prize.label}!</span>`;
        btn.classList.add('!bg-success');
        renderLootBag();
      }
    }

    requestAnimationFrame(animateWheel);
  };
}

// ===== LOOT BAG / WALLET =====
function saveVoucher(code, discount, source) {
  const list = JSON.parse(localStorage.getItem('tg_active_vouchers') || '[]');
  if (!list.some(v => v.code === code)) {
    list.push({ code, discount, source, date: new Date().toLocaleDateString() });
    localStorage.setItem('tg_active_vouchers', JSON.stringify(list));
  }
}

function renderLootBag() {
  const container = document.getElementById('lootBagContainer');
  const label = document.getElementById('lootCountLabel');
  if (!container) return;

  const list = JSON.parse(localStorage.getItem('tg_active_vouchers') || '[]');
  if (label) label.textContent = `${list.length} Voucher${list.length !== 1 ? 's' : ''} Saved`;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 rounded-2xl bg-nexus-950/60 border border-white/5 text-center text-gray-400 space-y-2">
        <i data-lucide="gift" class="w-8 h-8 text-gray-500 mx-auto"></i>
        <p class="text-sm">Your loot bag is currently empty.</p>
        <p class="text-xs text-text-muted">Unbox the Cyber Crate above or spin the wheel to claim exclusive discount vouchers!</p>
      </div>
    `;
  } else {
    container.innerHTML = list.map(v => `
      <div class="p-4 rounded-2xl bg-gradient-to-br from-cyan-accent/10 to-nexus-950 border border-cyan-accent/30 space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-2 py-0.5 rounded bg-cyan-accent/20 text-cyan-accent text-[10px] font-mono font-bold">${v.discount}% DISCOUNT</span>
          <span class="text-[10px] font-mono text-gray-400">${v.source}</span>
        </div>
        <div class="font-mono font-bold text-lg text-white">${v.code}</div>
        <button onclick="navigator.clipboard.writeText('${v.code}'); this.textContent='✓ Copied!';" class="btn-primary w-full !py-2 !text-xs font-bold">
          Copy Code for Checkout
        </button>
      </div>
    `).join('');
  }

  if (window.lucide) lucide.createIcons();
}
