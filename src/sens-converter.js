// ===== TUSHER GAMING SENSITIVITY MATRIX & CROSSHAIR ENGINE =====
import './style.css';
import { soundFX, progression } from './xp-engine.js';
import { getCartCount } from './cart-store.js';

// Game Yaw Ratios (Rotational degrees per count)
const YAW_RATIOS = {
  valorant: 0.07,
  cs2: 0.022,
  apex: 0.022,
  overwatch: 0.0066,
  pubg_mobile: 0.38,
  pubg_gyro: 1.20,
  free_fire: 0.95,
  cod_mobile: 0.80,
};

// Pro Player Presets
const PRO_PRESETS = {
  mortal: { srcGame: 'pubg_gyro', sens: 300, dpi: 800, targetGame: 'pubg_mobile' },
  nobru: { srcGame: 'free_fire', sens: 95, dpi: 850, targetGame: 'pubg_mobile' },
  tenz: { srcGame: 'valorant', sens: 0.30, dpi: 800, targetGame: 'cs2' },
  scout: { srcGame: 'pubg_gyro', sens: 400, dpi: 800, targetGame: 'pubg_mobile' },
  s1mple: { srcGame: 'cs2', sens: 3.09, dpi: 400, targetGame: 'valorant' },
};

let crosshairCanvas, crosshairCtx;
let recoilExpansion = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  crosshairCanvas = document.getElementById('crosshairCanvas');
  if (crosshairCanvas) {
    crosshairCtx = crosshairCanvas.getContext('2d');
    drawCrosshair();
  }

  initConverter();
  initProPresets();
  initCrosshairStudio();

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

// ===== CONVERTER ENGINE =====
function calculateConversion() {
  const srcGame = document.getElementById('sourceGame').value;
  const targetGame = document.getElementById('targetGame').value;
  const sens = parseFloat(document.getElementById('sourceSens').value) || 1.0;
  const dpi = parseFloat(document.getElementById('sourceDPI').value) || 800;

  const srcYaw = YAW_RATIOS[srcGame] || 0.07;
  const targetYaw = YAW_RATIOS[targetGame] || 0.07;

  // Converted Sensitivity
  const targetSens = (sens * srcYaw) / targetYaw;

  // Calculate 360 Distance (cm)
  // Distance = 360 / (DPI * Yaw * Sens) * 2.54 cm/inch
  const totalDegreesPerCount = dpi * srcYaw * sens;
  const inchesPer360 = 360 / (totalDegreesPerCount || 1);
  const cmPer360 = Math.abs(inchesPer360 * 2.54);

  const outputEl = document.getElementById('convertedSensOutput');
  const cmEl = document.getElementById('cmRevDistance');

  if (targetGame === 'pubg_mobile' || targetGame === 'pubg_gyro' || targetGame === 'free_fire') {
    outputEl.textContent = `${Math.round(targetSens)}%`;
  } else {
    outputEl.textContent = targetSens.toFixed(3);
  }

  if (cmEl) {
    cmEl.textContent = `${cmPer360.toFixed(1)} cm / 360°`;
  }

  progression.unlockAchievement('sens_master');
}

function initConverter() {
  const inputs = ['sourceGame', 'targetGame', 'sourceSens', 'sourceDPI'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calculateConversion);
      el.addEventListener('change', calculateConversion);
    }
  });

  const copySensBtn = document.getElementById('copySensBtn');
  if (copySensBtn) {
    copySensBtn.onclick = () => {
      const val = document.getElementById('convertedSensOutput').textContent;
      navigator.clipboard.writeText(val);
      copySensBtn.textContent = '✓ Copied!';
      copySensBtn.classList.add('!bg-success');
      soundFX.playHit();
      setTimeout(() => {
        copySensBtn.textContent = 'Copy Sens';
        copySensBtn.classList.remove('!bg-success');
      }, 1500);
    };
  }

  calculateConversion();
}

// ===== PRO PRESETS =====
function initProPresets() {
  const btns = document.querySelectorAll('.pro-preset-btn');
  btns.forEach(btn => {
    btn.onclick = () => {
      const pro = btn.dataset.pro;
      const data = PRO_PRESETS[pro];
      if (!data) return;

      document.getElementById('sourceGame').value = data.srcGame;
      document.getElementById('sourceSens').value = data.sens;
      document.getElementById('sourceDPI').value = data.dpi;
      document.getElementById('targetGame').value = data.targetGame;

      calculateConversion();
      soundFX.playFanfare();
      progression.addXP(100, `Loaded ${pro.toUpperCase()} Preset`);
    };
  });
}

// ===== CROSSHAIR STUDIO CANVAS =====
function drawCrosshair() {
  if (!crosshairCtx || !crosshairCanvas) return;

  const w = crosshairCanvas.width;
  const h = crosshairCanvas.height;
  const cx = w / 2;
  const cy = h / 2;

  const color = document.getElementById('chColor')?.value || '#00f0ff';
  const len = parseInt(document.getElementById('chLength')?.value || '6');
  const thick = parseInt(document.getElementById('chThickness')?.value || '2');
  const gap = parseInt(document.getElementById('chGap')?.value || '3') + recoilExpansion;

  crosshairCtx.clearRect(0, 0, w, h);

  // Background Target Grid
  crosshairCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  crosshairCtx.lineWidth = 1;
  crosshairCtx.beginPath();
  crosshairCtx.arc(cx, cy, 30, 0, Math.PI * 2);
  crosshairCtx.arc(cx, cy, 60, 0, Math.PI * 2);
  crosshairCtx.stroke();

  // Draw Reticle Lines
  crosshairCtx.fillStyle = color;

  // Top
  crosshairCtx.fillRect(cx - thick / 2, cy - gap - len, thick, len);
  // Bottom
  crosshairCtx.fillRect(cx - thick / 2, cy + gap, thick, len);
  // Left
  crosshairCtx.fillRect(cx - gap - len, cy - thick / 2, len, thick);
  // Right
  crosshairCtx.fillRect(cx + gap, cy - thick / 2, len, thick);

  // Recoil Decay
  if (recoilExpansion > 0) {
    recoilExpansion = Math.max(recoilExpansion - 0.8, 0);
    requestAnimationFrame(drawCrosshair);
  }
}

function initCrosshairStudio() {
  const controls = ['chColor', 'chLength', 'chThickness', 'chGap'];
  controls.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        const valEl = document.getElementById(`${id}Val`);
        if (valEl) valEl.textContent = el.value;
        drawCrosshair();
      });
    }
  });

  // Simulated Firing Recoil on Click
  const backdrop = document.getElementById('crosshairBackdrop');
  if (backdrop) {
    backdrop.onclick = () => {
      recoilExpansion = 10;
      soundFX.playHit();
      drawCrosshair();
    };
  }

  // Copy Code String
  const copyBtn = document.getElementById('copyCrosshairCodeBtn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      const color = document.getElementById('chColor').value;
      const len = document.getElementById('chLength').value;
      const thick = document.getElementById('chThickness').value;
      const gap = document.getElementById('chGap').value;

      const code = `0;P;c;5;o;1;d;1;z;${thick};f;0;0t;${thick};0l;${len};0o;${gap};0a;1;0f;0`;
      navigator.clipboard.writeText(code);

      copyBtn.innerHTML = `<span>✓ Crosshair Code Copied! (${code.substring(0, 15)}...)</span>`;
      copyBtn.classList.add('!bg-success');
      soundFX.playFanfare();
      progression.unlockAchievement('crosshair_pro');

      setTimeout(() => {
        copyBtn.innerHTML = `<i data-lucide="copy" class="w-4 h-4"></i> Copy Reticle Code String`;
        copyBtn.classList.remove('!bg-success');
        if (window.lucide) lucide.createIcons();
      }, 2000);
    };
  }
}
