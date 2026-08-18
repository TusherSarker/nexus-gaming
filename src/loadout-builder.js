// ===== TUSHER GAMING 3D RGB LOADOUT LAB ENGINE =====
import './style.css';
import { soundFX, progression } from './xp-engine.js';
import { addToCart, getCartCount } from './cart-store.js';
import { initUniversalMobileNav } from './mobile-nav.js';
import { initAuthModal, updateNavbarUserUI } from './auth-modal.js';

// Available Equipment Catalog for Loadout Slots
const LOADOUT_CATALOG = {
  monitor: [
    { id: 5, name: 'UltraWide QD-OLED 34"', price: 999.00, badge: '240Hz OLED', image: '/products/gaming_monitor.jpg', desc: '0.03ms Response, TrueBlack HDR' },
  ],
  keyboard: [
    { id: 2, name: 'Vortex K70 Magnetic', price: 229.99, badge: 'Rapid Trigger', image: '/products/gaming_keyboard.jpg', desc: 'Hall Effect 0.1mm actuation' },
  ],
  mouse: [
    { id: 3, name: 'Phantom X Wireless Mouse', price: 159.99, badge: '49g Ultralight', image: '/products/gaming_mouse.jpg', desc: '30K DPI Optical, 8000Hz' },
  ],
  headset: [
    { id: 1, name: 'Aurora Pro Wireless', price: 149.99, badge: '7.1 Spatial', image: '/products/gaming_headset.jpg', desc: '50h Battery, Broadcast Mic' },
  ],
  controller: [
    { id: 4, name: 'Nexus Elite Controller', price: 199.99, badge: 'Hall Effect', image: '/products/gaming_controller.jpg', desc: '4 Rear Paddles, Trigger Stops' },
  ],
  deskmat: [
    { id: 6, name: 'RGB Control Desk Mat XXL', price: 49.99, badge: '900x400mm', image: '/products/gaming_mousepad.jpg', desc: 'Micro-weave cloth, 360° RGB' },
  ],
  webcam: [
    { id: 7, name: 'StreamCam 4K HDR', price: 179.99, badge: '4K 60FPS', image: '/products/gaming_webcam.jpg', desc: 'Sony Starvis Sensor, Auto-frame' },
  ],
  chair: [
    { id: 8, name: 'Titan Ergonomic Chair', price: 399.99, badge: '4D Armrests', image: '/products/gaming_chair.jpg', desc: 'Magnetic memory foam lumbar' },
  ],
};

// Active Loadout State
const activeLoadout = {
  monitor: LOADOUT_CATALOG.monitor[0],
  keyboard: LOADOUT_CATALOG.keyboard[0],
  mouse: LOADOUT_CATALOG.mouse[0],
  headset: LOADOUT_CATALOG.headset[0],
  controller: LOADOUT_CATALOG.controller[0],
  deskmat: LOADOUT_CATALOG.deskmat[0],
  webcam: LOADOUT_CATALOG.webcam[0],
  chair: LOADOUT_CATALOG.chair[0],
};

let currentRGBMode = 'cyan';
const testedSwitches = new Set();
const testedRGB = new Set();

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  initUniversalMobileNav();
  initAuthModal();
  updateNavbarUserUI();

  initRGBThemeController();
  initSwitchSimulator();
  renderSlotList();
  updateTotalPrice();
  initPurchaseButton();

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

// ===== RGB THEME ENGINE =====
function initRGBThemeController() {
  const rgbBtns = document.querySelectorAll('.rgb-theme-btn');
  const glow = document.getElementById('ambientRGBGlow');
  const stage = document.getElementById('battlestationStage');

  const RGB_PRESETS = {
    cyan: {
      bg: 'rgba(0, 240, 255, 0.25)',
      border: 'rgba(0, 240, 255, 0.4)',
      shadow: '0 0 40px rgba(0, 240, 255, 0.3)',
    },
    magenta: {
      bg: 'rgba(255, 45, 120, 0.25)',
      border: 'rgba(255, 45, 120, 0.4)',
      shadow: '0 0 40px rgba(255, 45, 120, 0.3)',
    },
    emerald: {
      bg: 'rgba(34, 197, 94, 0.25)',
      border: 'rgba(34, 197, 94, 0.4)',
      shadow: '0 0 40px rgba(34, 197, 94, 0.3)',
    },
    gold: {
      bg: 'rgba(255, 215, 0, 0.25)',
      border: 'rgba(255, 215, 0, 0.4)',
      shadow: '0 0 40px rgba(255, 215, 0, 0.3)',
    },
    crimson: {
      bg: 'rgba(239, 68, 68, 0.25)',
      border: 'rgba(239, 68, 68, 0.4)',
      shadow: '0 0 40px rgba(239, 68, 68, 0.3)',
    },
    rainbow: {
      bg: 'rgba(0, 240, 255, 0.2)',
      border: 'rgba(255, 45, 120, 0.5)',
      shadow: '0 0 50px rgba(0, 240, 255, 0.4)',
    },
  };

  rgbBtns.forEach(btn => {
    btn.onclick = () => {
      rgbBtns.forEach(b => b.classList.remove('border-white', 'shadow-glow-cyan-sm'));
      btn.classList.add('border-white', 'shadow-glow-cyan-sm');

      currentRGBMode = btn.dataset.rgb;
      testedRGB.add(currentRGBMode);

      const preset = RGB_PRESETS[currentRGBMode] || RGB_PRESETS.cyan;
      if (glow) {
        glow.style.backgroundColor = preset.bg;
      }
      if (stage) {
        stage.style.borderColor = preset.border;
        stage.style.boxShadow = preset.shadow;
      }

      soundFX.playHit();

      if (testedRGB.size >= 5) {
        progression.unlockAchievement('chroma_master');
      }
    };
  });
}

// ===== SWITCH SOUND SIMULATOR =====
function initSwitchSimulator() {
  const switchBtns = document.querySelectorAll('.switch-sound-btn');
  switchBtns.forEach(btn => {
    btn.onclick = () => {
      const type = btn.dataset.switch;
      soundFX.playMechanicalSwitch(type);
      testedSwitches.add(type);

      btn.classList.add('scale-95');
      setTimeout(() => btn.classList.remove('scale-95'), 100);

      if (testedSwitches.size >= 4) {
        progression.unlockAchievement('switch_tester');
      }
    };
  });
}

window.testSwitchSound = function() {
  soundFX.playMechanicalSwitch('hall');
};

// ===== RENDER EQUIPPED ITEMS =====
function renderSlotList() {
  const container = document.getElementById('slotListContainer');
  if (!container) return;

  const items = Object.entries(activeLoadout);
  container.innerHTML = items.map(([slotKey, item]) => `
    <div class="p-2.5 rounded-xl bg-nexus-950 border border-white/5 flex items-center justify-between hover:border-cyan-accent/30 transition-all">
      <div class="flex items-center gap-3">
        <img src="${item.image}" class="w-10 h-10 object-contain rounded-lg bg-nexus-900 p-1 border border-white/10" alt="${item.name}">
        <div>
          <span class="text-[10px] font-mono text-cyan-accent uppercase block">${slotKey}</span>
          <h4 class="font-bold text-white text-xs leading-tight">${item.name}</h4>
        </div>
      </div>
      <div class="text-right font-mono">
        <span class="text-xs text-white font-bold block">$${item.price.toFixed(2)}</span>
        <span class="text-[10px] text-emerald-400">Equipped</span>
      </div>
    </div>
  `).join('');

  progression.unlockAchievement('builder_elite');
}

function updateTotalPrice() {
  let total = 0;
  Object.values(activeLoadout).forEach(item => {
    total += item.price;
  });

  const totalEl = document.getElementById('loadoutTotalPrice');
  if (totalEl) {
    totalEl.textContent = `$${total.toFixed(2)}`;
  }
}

// ===== ADD COMPLETE LOADOUT TO CART =====
function initPurchaseButton() {
  const btn = document.getElementById('addFullLoadoutBtn');
  if (!btn) return;

  btn.onclick = () => {
    soundFX.playFanfare();

    // Add all 8 components to cart
    Object.values(activeLoadout).forEach(item => {
      addToCart(item.id, 1, item);
    });

    updateCartBadge();
    progression.addXP(250, 'Full Battle Station Added to Cart');

    btn.innerHTML = `<span>✓ Added All 8 Items! Redirecting...</span>`;
    btn.classList.add('!bg-success');

    setTimeout(() => {
      window.location.href = '/cart.html';
    }, 1200);
  };
}
