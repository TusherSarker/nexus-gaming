// ===== TUSHER GAMING ESPORTS AIM & REFLEX ARCADE =====
import './style.css';
import { soundFX, progression } from './xp-engine.js';
import { getCartCount } from './cart-store.js';

let canvas, ctx;
let currentMode = 'gridshot';
let isRunning = false;
let animationId = null;

// Game State
let score = 0;
let hits = 0;
let totalClicks = 0;
let combo = 0;
let maxCombo = 0;
let timeLeft = 30.0;
let lastTimestamp = 0;

// Entities
let targets = [];
let particles = [];
let floatingTexts = [];

// Reflex Mode State
let reflexState = 'idle'; // 'idle' | 'waiting' | 'ready' | 'result'
let reflexStartTime = 0;
let reflexTimerTimeout = null;
let reactionTimes = [];

// Tracking Mode State
let drone = { x: 0, y: 0, vx: 3, vy: 2, radius: 35, trackingTime: 0 };
let isTrackingCursor = false;

// APM Mode State
let apmClicks = 0;
let apmDuration = 10.0;
let apmTimeLeft = 10.0;
let apmHistory = [];

// Sound Cue Mode State
let soundState = 'idle';
let soundTargetSide = 'center';
let soundCueTime = 0;

// High Scores Storage
const HIGH_SCORES = {
  gridshot: parseInt(localStorage.getItem('tg_high_gridshot') || '0'),
  reflex: parseInt(localStorage.getItem('tg_best_reflex') || '999'),
  tracking: parseInt(localStorage.getItem('tg_high_tracking') || '0'),
  apm: parseFloat(localStorage.getItem('tg_best_apm') || '0'),
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  canvas = document.getElementById('arcadeCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  initUI();
  loadHighScores();
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

function resizeCanvas() {
  const wrapper = document.getElementById('canvasWrapper');
  if (!wrapper || !canvas) return;
  canvas.width = wrapper.clientWidth;
  canvas.height = wrapper.clientHeight;
}

function initUI() {
  const modeBtns = document.querySelectorAll('.arcade-mode-btn');
  modeBtns.forEach(btn => {
    btn.onclick = () => {
      if (isRunning) stopGame();
      modeBtns.forEach(b => {
        b.classList.remove('active', 'bg-cyan-accent', 'text-nexus-900', 'shadow-glow-cyan-sm');
        b.classList.add('text-gray-400');
      });
      btn.classList.add('active', 'bg-cyan-accent', 'text-nexus-900', 'shadow-glow-cyan-sm');
      btn.classList.remove('text-gray-400');

      currentMode = btn.dataset.mode;
      updateModeDescription();
    };
  });

  const startBtn = document.getElementById('startArcadeBtn');
  if (startBtn) {
    startBtn.onclick = () => startGame();
  }

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isRunning) {
      e.preventDefault();
      startGame();
    }
  });

  // Sound Toggle
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundText = document.getElementById('soundStatusText');
  if (soundBtn) {
    soundBtn.onclick = () => {
      soundFX.muted = !soundFX.muted;
      soundText.textContent = soundFX.muted ? 'MUTED' : 'ON';
      soundText.className = soundFX.muted ? 'text-xs font-bold text-red-400' : 'text-xs font-bold text-cyan-accent';
    };
  }

  // Canvas Interactions
  canvas.addEventListener('mousedown', handleCanvasClick);
  canvas.addEventListener('mousemove', handleCanvasMouseMove);

  // Copy Promo Code Button
  const copyBtn = document.getElementById('copyPromoBtn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      const code = document.getElementById('generatedPromoCode').textContent;
      navigator.clipboard.writeText(code);
      copyBtn.textContent = '✓ Copied!';
      copyBtn.classList.add('!bg-success');
      setTimeout(() => {
        copyBtn.textContent = 'Copy Code';
        copyBtn.classList.remove('!bg-success');
      }, 2000);
    };
  }
}

function updateModeDescription() {
  const title = document.getElementById('overlayTitle');
  const desc = document.getElementById('overlayDesc');
  const overlay = document.getElementById('arcadeOverlay');
  overlay.classList.remove('hidden');

  if (currentMode === 'gridshot') {
    title.textContent = 'GridShot Precision (30s)';
    desc.textContent = 'Hit 3 rapidly appearing glowing target orbs before they shrink. Score 50,000+ points for a 10% coupon!';
  } else if (currentMode === 'reflex') {
    title.textContent = 'Reflex Latency Benchmark';
    desc.textContent = 'Wait for the canvas to flash from Red to Neon Green, then click as fast as humanly possible!';
  } else if (currentMode === 'tracking') {
    title.textContent = 'Dynamic Drone Tracking';
    desc.textContent = 'Keep your crosshair locked directly on the drifting cyber drone to accumulate continuous beam DPS!';
  } else if (currentMode === 'apm') {
    title.textContent = 'APM / CPS Speed Challenge';
    desc.textContent = 'Click the pulsating power core as many times as you can in 10 seconds to benchmark your mechanical CPS!';
  } else if (currentMode === 'sound') {
    title.textContent = 'Spatial Audio Cue Reaction';
    desc.textContent = 'Listen carefully with headphones. When you hear the high-frequency chirp, click instantly!';
  }

  resetHUD();
}

function resetHUD() {
  document.getElementById('hudScore').textContent = '0';
  document.getElementById('hudTimer').textContent = currentMode === 'gridshot' ? '30.0s' : currentMode === 'apm' ? '10.0s' : '--';
  document.getElementById('hudAccuracy').textContent = '100%';
  document.getElementById('hudCombo').textContent = '0x';
}

function loadHighScores() {
  document.getElementById('bestGridshot').textContent = `${HIGH_SCORES.gridshot.toLocaleString()} PTS`;
  document.getElementById('bestReflex').textContent = HIGH_SCORES.reflex < 900 ? `${HIGH_SCORES.reflex} ms` : '-- ms';
  document.getElementById('bestAPM').textContent = `${HIGH_SCORES.apm} CPS`;

  const rankEl = document.getElementById('bestRank');
  if (HIGH_SCORES.gridshot > 60000 || HIGH_SCORES.reflex < 160) {
    rankEl.textContent = 'Radiant Elite';
    rankEl.className = 'text-magenta-accent text-sm font-bold';
  } else if (HIGH_SCORES.gridshot > 40000 || HIGH_SCORES.reflex < 200) {
    rankEl.textContent = 'Diamond Pro';
    rankEl.className = 'text-cyan-accent text-sm font-bold';
  } else if (HIGH_SCORES.gridshot > 20000) {
    rankEl.textContent = 'Platinum Master';
    rankEl.className = 'text-emerald-400 text-sm font-bold';
  } else {
    rankEl.textContent = 'Bronze I';
    rankEl.className = 'text-gray-400 text-sm font-bold';
  }
}

// ===== GAME CONTROL ENGINE =====
function startGame() {
  if (isRunning) return;
  isRunning = true;
  document.getElementById('arcadeOverlay').classList.add('hidden');

  score = 0;
  hits = 0;
  totalClicks = 0;
  combo = 0;
  maxCombo = 0;
  particles = [];
  floatingTexts = [];
  targets = [];

  progression.unlockAchievement('first_blood');

  if (currentMode === 'gridshot') {
    timeLeft = 30.0;
    spawnGridshotTarget();
    spawnGridshotTarget();
    spawnGridshotTarget();
  } else if (currentMode === 'reflex') {
    startReflexRound();
  } else if (currentMode === 'tracking') {
    timeLeft = 25.0;
    drone.x = canvas.width / 2;
    drone.y = canvas.height / 2;
    drone.vx = (Math.random() - 0.5) * 6;
    drone.vy = (Math.random() - 0.5) * 6;
  } else if (currentMode === 'apm') {
    apmClicks = 0;
    apmTimeLeft = 10.0;
  } else if (currentMode === 'sound') {
    startSoundRound();
  }

  lastTimestamp = performance.now();
  animationId = requestAnimationFrame(gameLoop);
}

function stopGame() {
  isRunning = false;
  cancelAnimationFrame(animationId);
  clearTimeout(reflexTimerTimeout);
  document.getElementById('arcadeOverlay').classList.remove('hidden');

  // Evaluate High Scores & Rewards
  if (currentMode === 'gridshot') {
    progression.addXP(Math.floor(score / 200), 'GridShot Training');

    if (score > HIGH_SCORES.gridshot) {
      HIGH_SCORES.gridshot = score;
      localStorage.setItem('tg_high_gridshot', score.toString());
      soundFX.playFanfare();
    }

    if (hits > 0 && hits / totalClicks >= 0.9) {
      progression.unlockAchievement('sharpshooter');
    }

    // Unlock 10% Voucher if Score >= 50,000
    if (score >= 50000) {
      progression.unlockAchievement('score_50k');
      unlockDiscountPromo();
    }
  } else if (currentMode === 'reflex') {
    if (reactionTimes.length > 0) {
      const avg = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
      if (avg < HIGH_SCORES.reflex) {
        HIGH_SCORES.reflex = avg;
        localStorage.setItem('tg_best_reflex', avg.toString());
      }
      if (avg < 180) {
        progression.unlockAchievement('reflex_god');
      }
      progression.addXP(150, 'Reflex Benchmark Complete');
    }
  } else if (currentMode === 'apm') {
    const cps = (apmClicks / apmDuration).toFixed(1);
    if (parseFloat(cps) > HIGH_SCORES.apm) {
      HIGH_SCORES.apm = parseFloat(cps);
      localStorage.setItem('tg_best_apm', cps.toString());
    }
    progression.addXP(100, `APM Challenge: ${cps} CPS`);
  }

  loadHighScores();
}

function unlockDiscountPromo() {
  const code = `ARCADE-${Math.random().toString(36).substring(2, 6).toUpperCase()}-10`;
  document.getElementById('generatedPromoCode').textContent = code;
  document.getElementById('unlockedCouponCard').classList.remove('hidden');

  // Save to active vouchers in localStorage
  const activeVouchers = JSON.parse(localStorage.getItem('tg_active_vouchers') || '[]');
  if (!activeVouchers.some(v => v.code === code)) {
    activeVouchers.push({ code, discount: 10, source: 'Arcade GridShot 50K' });
    localStorage.setItem('tg_active_vouchers', JSON.stringify(activeVouchers));
  }

  soundFX.playFanfare();
}

// ===== MAIN ANIMATION & RENDER LOOP =====
function gameLoop(timestamp) {
  if (!isRunning) return;

  const dt = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background Grid Matrix
  drawCyberGrid();

  if (currentMode === 'gridshot') {
    updateGridshot(dt);
    drawGridshot();
  } else if (currentMode === 'reflex') {
    drawReflex();
  } else if (currentMode === 'tracking') {
    updateTracking(dt);
    drawTracking();
  } else if (currentMode === 'apm') {
    updateAPM(dt);
    drawAPM();
  } else if (currentMode === 'sound') {
    drawSoundMode();
  }

  // Update Particles & Floating Text
  updateParticles(dt);
  drawParticles();

  updateFloatingTexts(dt);
  drawFloatingTexts();

  animationId = requestAnimationFrame(gameLoop);
}

function drawCyberGrid() {
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
  ctx.lineWidth = 1;
  const step = 40;

  for (let x = 0; x < canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// ===== MODE 1: GRIDSHOT =====
function spawnGridshotTarget() {
  const padding = 60;
  const radius = 28;
  const x = padding + Math.random() * (canvas.width - padding * 2);
  const y = padding + Math.random() * (canvas.height - padding * 2);

  targets.push({
    x, y,
    baseRadius: radius,
    radius: radius,
    life: 1.0, // 1.0 down to 0
    decayRate: 0.45 + Math.random() * 0.2,
    color: '#00f0ff',
  });
}

function updateGridshot(dt) {
  timeLeft -= dt;
  if (timeLeft <= 0) {
    timeLeft = 0;
    stopGame();
    return;
  }

  // Update Targets
  for (let i = targets.length - 1; i >= 0; i--) {
    const t = targets[i];
    t.life -= t.decayRate * dt;
    t.radius = t.baseRadius * (0.4 + 0.6 * t.life);

    if (t.life <= 0) {
      // Missed target
      targets.splice(i, 1);
      combo = 0;
      soundFX.playMiss();
      addFloatingText(t.x, t.y, 'MISS', '#ef4444');
      spawnGridshotTarget();
    }
  }

  // Update HUD
  document.getElementById('hudTimer').textContent = `${timeLeft.toFixed(1)}s`;
  document.getElementById('hudScore').textContent = score.toLocaleString();
  document.getElementById('hudCombo').textContent = `${combo}x`;
  const acc = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 100;
  document.getElementById('hudAccuracy').textContent = `${acc}%`;
}

function drawGridshot() {
  targets.forEach(t => {
    // Outer Glow Ring
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 240, 255, ${t.life * 0.4})`;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Main Target Body
    const grad = ctx.createRadialGradient(t.x, t.y, 2, t.x, t.y, t.radius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, '#00f0ff');
    grad.addColorStop(1, '#ff2d78');

    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Bullseye Dot
    ctx.beginPath();
    ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  });
}

// ===== MODE 2: REFLEX BENCHMARK =====
function startReflexRound() {
  reflexState = 'waiting';
  reflexStartTime = 0;

  const waitDuration = 1500 + Math.random() * 3000;
  reflexTimerTimeout = setTimeout(() => {
    if (!isRunning || currentMode !== 'reflex') return;
    reflexState = 'ready';
    reflexStartTime = performance.now();
    soundFX.playCombo();
  }, waitDuration);
}

function drawReflex() {
  if (reflexState === 'waiting') {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WAIT FOR GREEN...', canvas.width / 2, canvas.height / 2);
  } else if (reflexState === 'ready') {
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CLICK NOW!', canvas.width / 2, canvas.height / 2);
  } else if (reflexState === 'result') {
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const latest = reactionTimes[reactionTimes.length - 1] || 0;
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 52px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${latest} ms`, canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Click anywhere to test again', canvas.width / 2, canvas.height / 2 + 30);
  }
}

// ===== MODE 3: DRONE TRACKING =====
function updateTracking(dt) {
  timeLeft -= dt;
  if (timeLeft <= 0) {
    timeLeft = 0;
    stopGame();
    return;
  }

  // Physics drift with wall bounces
  drone.x += drone.vx;
  drone.y += drone.vy;

  if (drone.x - drone.radius < 20 || drone.x + drone.radius > canvas.width - 20) {
    drone.vx = -drone.vx + (Math.random() - 0.5);
  }
  if (drone.y - drone.radius < 20 || drone.y + drone.radius > canvas.height - 20) {
    drone.vy = -drone.vy + (Math.random() - 0.5);
  }

  // Cap speed
  drone.vx = Math.max(Math.min(drone.vx, 7), -7);
  drone.vy = Math.max(Math.min(drone.vy, 7), -7);

  if (isTrackingCursor) {
    score += Math.round(150 * dt);
    spawnParticle(drone.x, drone.y, '#00f0ff');
  }

  document.getElementById('hudTimer').textContent = `${timeLeft.toFixed(1)}s`;
  document.getElementById('hudScore').textContent = score.toLocaleString();
}

function drawTracking() {
  // Laser Lock-On Beam
  if (isTrackingCursor) {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(drone.x, drone.y, drone.radius + 10, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Drone Core
  const grad = ctx.createRadialGradient(drone.x, drone.y, 4, drone.x, drone.y, drone.radius);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.5, isTrackingCursor ? '#22c55e' : '#00f0ff');
  grad.addColorStop(1, '#111827');

  ctx.beginPath();
  ctx.arc(drone.x, drone.y, drone.radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ===== MODE 4: APM SPEED CLICKER =====
function updateAPM(dt) {
  apmTimeLeft -= dt;
  if (apmTimeLeft <= 0) {
    apmTimeLeft = 0;
    stopGame();
    return;
  }

  document.getElementById('hudTimer').textContent = `${apmTimeLeft.toFixed(1)}s`;
  document.getElementById('hudScore').textContent = `${apmClicks} Clicks`;
  const cps = (apmClicks / (apmDuration - apmTimeLeft + 0.01)).toFixed(1);
  document.getElementById('hudAccuracy').textContent = `${cps} CPS`;
}

function drawAPM() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const pulse = Math.sin(Date.now() / 100) * 8;

  // Reactor Core
  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 80 + pulse);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.5, '#ff2d78');
  grad.addColorStop(1, '#00f0ff');

  ctx.beginPath();
  ctx.arc(cx, cy, 75 + pulse, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px Rajdhani, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CLICK!', cx, cy + 12);
}

// ===== MODE 5: SOUND CUE REACTION =====
function startSoundRound() {
  soundState = 'waiting';
  soundCueTime = 0;

  const waitDuration = 2000 + Math.random() * 3000;
  reflexTimerTimeout = setTimeout(() => {
    if (!isRunning || currentMode !== 'sound') return;
    soundState = 'cue';
    soundCueTime = performance.now();
    soundFX.playHeadshot();
  }, waitDuration);
}

function drawSoundMode() {
  ctx.fillStyle = '#060a12';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = soundState === 'cue' ? '#00f0ff' : '#6b7280';
  ctx.font = 'bold 36px Rajdhani, sans-serif';
  ctx.textAlign = 'center';

  if (soundState === 'waiting') {
    ctx.fillText('🎧 LISTEN FOR THE AUDIO CHIRP...', canvas.width / 2, canvas.height / 2);
  } else if (soundState === 'cue') {
    ctx.fillText('💥 CLICK NOW!', canvas.width / 2, canvas.height / 2);
  } else if (soundState === 'result') {
    const lat = reactionTimes[reactionTimes.length - 1] || 0;
    ctx.fillText(`Auditory Latency: ${lat} ms`, canvas.width / 2, canvas.height / 2);
  }
}

// ===== CLICK DISPATCHER =====
function handleCanvasClick(e) {
  if (!isRunning) return;

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  totalClicks++;

  if (currentMode === 'gridshot') {
    let hit = false;
    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];
      const dist = Math.hypot(mx - t.x, my - t.y);

      if (dist <= t.radius + 5) {
        hit = true;
        hits++;
        combo++;
        if (combo > maxCombo) maxCombo = combo;

        // Score based on speed & center accuracy
        const bullseyeDist = Math.hypot(mx - t.x, my - t.y);
        const precisionMultiplier = bullseyeDist < 10 ? 2.0 : 1.0;
        const comboBonus = 1.0 + (combo * 0.1);
        const pts = Math.round(500 * precisionMultiplier * comboBonus);
        score += pts;

        if (precisionMultiplier > 1.5) {
          soundFX.playHeadshot();
          addFloatingText(t.x, t.y, `CRIT! +${pts}`, '#ffd700');
        } else {
          soundFX.playHit();
          addFloatingText(t.x, t.y, `+${pts}`, '#00f0ff');
        }

        // Emit particles
        for (let p = 0; p < 12; p++) spawnParticle(t.x, t.y, '#00f0ff');

        targets.splice(i, 1);
        spawnGridshotTarget();
        break;
      }
    }

    if (!hit) {
      combo = 0;
      soundFX.playMiss();
      addFloatingText(mx, my, 'MISS', '#ef4444');
    }
  } else if (currentMode === 'reflex') {
    if (reflexState === 'waiting') {
      // False start!
      clearTimeout(reflexTimerTimeout);
      soundFX.playMiss();
      reflexState = 'result';
      reactionTimes.push(999);
      document.getElementById('hudTimer').textContent = 'Too Early!';
    } else if (reflexState === 'ready') {
      const reaction = Math.round(performance.now() - reflexStartTime);
      reactionTimes.push(reaction);
      reflexState = 'result';
      soundFX.playHeadshot();
      document.getElementById('hudTimer').textContent = `${reaction} ms`;
    } else if (reflexState === 'result') {
      startReflexRound();
    }
  } else if (currentMode === 'apm') {
    apmClicks++;
    soundFX.playHit();
    for (let p = 0; p < 4; p++) spawnParticle(mx, my, '#ff2d78');
  } else if (currentMode === 'sound') {
    if (soundState === 'cue') {
      const lat = Math.round(performance.now() - soundCueTime);
      reactionTimes.push(lat);
      soundState = 'result';
      document.getElementById('hudTimer').textContent = `${lat} ms`;
      soundFX.playHit();
    } else if (soundState === 'result') {
      startSoundRound();
    }
  }
}

function handleCanvasMouseMove(e) {
  if (currentMode !== 'tracking' || !isRunning) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const dist = Math.hypot(mx - drone.x, my - drone.y);
  isTrackingCursor = dist <= drone.radius;
}

// ===== PARTICLES & TEXT EFFECTS =====
function spawnParticle(x, y, color) {
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8,
    radius: 2 + Math.random() * 3,
    alpha: 1.0,
    color,
  });
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= dt * 2.5;
    if (p.alpha <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function addFloatingText(x, y, text, color) {
  floatingTexts.push({ x, y, text, color, alpha: 1.0, vy: -1.5 });
}

function updateFloatingTexts(dt) {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy;
    ft.alpha -= dt * 1.8;
    if (ft.alpha <= 0) floatingTexts.splice(i, 1);
  }
}

function drawFloatingTexts() {
  floatingTexts.forEach(ft => {
    ctx.save();
    ctx.globalAlpha = ft.alpha;
    ctx.fillStyle = ft.color;
    ctx.font = 'bold 18px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  });
}
