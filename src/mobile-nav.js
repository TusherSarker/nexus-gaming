// ===== Universal Mobile Navigation Drawer Module =====
// Injects and manages a rich full-screen mobile navigation drawer on any page

export function initUniversalMobileNav() {
  // 1. Remove any misplaced mobile menu inside headers to prevent CSS transform trapping
  const existingMenu = document.getElementById('mobile-menu');
  if (existingMenu) {
    existingMenu.remove();
  }

  // 2. Create the universal mobile menu container directly under <body>
  const menuWrapper = document.createElement('div');
  menuWrapper.id = 'mobile-menu';
  menuWrapper.className = 'fixed inset-0 z-[9999] hidden pointer-events-auto';
  menuWrapper.innerHTML = `
    <!-- Dark Backdrop Overlay -->
    <div id="mobile-overlay" class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 opacity-0"></div>
    
    <!-- Slide-Out Full-Height Drawer -->
    <div id="mobile-drawer" class="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-nexus-950/98 border-l border-white/10 shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300 ease-out z-10">
      
      <!-- Drawer Header: Brand Logo & Close Button -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-nexus-900/60 shrink-0">
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-accent via-pink-500 to-amber-400 p-[1.5px] shadow-md shrink-0">
            <div class="w-full h-full bg-nexus-950 rounded-[9px] flex items-center justify-center">
              <span class="font-heading font-bold text-cyan-accent text-lg">T</span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="font-heading font-bold text-base tracking-wider text-white">TUSHER<span class="text-cyan-accent">GAMING</span></span>
            <span class="text-[8px] font-mono text-cyan-accent/80 tracking-widest uppercase">Esports & Top-Up</span>
          </div>
        </a>
        <button id="mobile-close-btn" class="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95" aria-label="Close menu">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Drawer Scrollable Content -->
      <div class="flex-1 overflow-y-auto px-5 py-4 space-y-6 custom-scrollbar">
        
        <!-- Auth / User Quick Hub -->
        <div id="mobileUserCard" class="p-3.5 rounded-2xl bg-gradient-to-r from-nexus-900 to-nexus-800/80 border border-white/10 shadow-lg">
          <!-- Populated dynamically by updateMobileUserUI -->
        </div>

        <!-- Section 1: Play & Build (Interactive Hubs) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-accent uppercase tracking-wider px-1">
            <span>Play & Build Arena</span>
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-pulse"></span>
          </div>
          <div class="grid grid-cols-1 gap-1.5">
            <a href="/arcade.html" class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-cyan-accent/10 border border-white/5 hover:border-cyan-accent/30 text-white transition-all group">
              <div class="flex items-center gap-3">
                <span class="text-lg">🎯</span>
                <div>
                  <div class="text-xs font-bold font-heading text-white group-hover:text-cyan-accent">Aim & Reflex Arcade</div>
                  <div class="text-[10px] text-gray-400">5 Playable Canvas Modes</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded bg-cyan-accent/20 text-cyan-accent text-[9px] font-mono font-bold">10% Off</span>
            </a>

            <a href="/loadout-builder.html" class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/30 text-white transition-all group">
              <div class="flex items-center gap-3">
                <span class="text-lg">⚡</span>
                <div>
                  <div class="text-xs font-bold font-heading text-white group-hover:text-magenta-accent">3D RGB Loadout Studio</div>
                  <div class="text-[10px] text-gray-400">Custom Battle Stations & SFX</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 text-[9px] font-mono font-bold">3D Lab</span>
            </a>

            <a href="/rewards.html" class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 text-white transition-all group">
              <div class="flex items-center gap-3">
                <span class="text-lg">🎁</span>
                <div>
                  <div class="text-xs font-bold font-heading text-white group-hover:text-amber-400">Daily Rewards Vault</div>
                  <div class="text-[10px] text-gray-400">Unbox Crates & Spin Wheel</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">Free Loot</span>
            </a>

            <a href="/sens-converter.html" class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-white transition-all group">
              <div class="flex items-center gap-3">
                <span class="text-lg">🎛️</span>
                <div>
                  <div class="text-xs font-bold font-heading text-white group-hover:text-emerald-400">Pro Sens Matrix</div>
                  <div class="text-[10px] text-gray-400">8-Game 360° Converter</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">Converter</span>
            </a>

            <a href="/lounge.html" class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 text-white transition-all group">
              <div class="flex items-center gap-3">
                <span class="text-lg">👥</span>
                <div>
                  <div class="text-xs font-bold font-heading text-white group-hover:text-blue-400">Squad Lounge & SFX</div>
                  <div class="text-[10px] text-gray-400">Teammates & Soundboard</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-mono font-bold">Live Room</span>
            </a>
          </div>
        </div>

        <!-- Section 2: Store & Community -->
        <div class="space-y-2">
          <div class="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider px-1">
            Store & Community
          </div>
          <div class="grid grid-cols-2 gap-2">
            <a href="/#categories" class="p-2.5 rounded-xl bg-nexus-900 border border-white/5 hover:border-cyan-accent/30 text-gray-300 hover:text-white transition-all block">
              <div class="text-base mb-1">🎮</div>
              <div class="text-xs font-bold font-heading text-white">20 Game Top-Ups</div>
              <div class="text-[9px] text-gray-400">PUBG, Free Fire, COD</div>
            </a>
            <a href="/#products" class="p-2.5 rounded-xl bg-nexus-900 border border-white/5 hover:border-cyan-accent/30 text-gray-300 hover:text-white transition-all block">
              <div class="text-base mb-1">📦</div>
              <div class="text-xs font-bold font-heading text-white">Hardware Gear</div>
              <div class="text-[9px] text-gray-400">Keyboards & Mice</div>
            </a>
            <a href="/tournaments.html" class="p-2.5 rounded-xl bg-nexus-900 border border-white/5 hover:border-gold-accent/30 text-gray-300 hover:text-white transition-all block">
              <div class="text-base mb-1">🏆</div>
              <div class="text-xs font-bold font-heading text-white">Tournaments</div>
              <div class="text-[9px] text-gold-accent">100K BDT Cups</div>
            </a>
            <a href="/pro-setups.html" class="p-2.5 rounded-xl bg-nexus-900 border border-white/5 hover:border-cyan-accent/30 text-gray-300 hover:text-white transition-all block">
              <div class="text-base mb-1">🎯</div>
              <div class="text-xs font-bold font-heading text-white">Pro Setups</div>
              <div class="text-[9px] text-gray-400">Mortal & TenZ Sens</div>
            </a>
            <a href="/blog.html" class="p-2.5 rounded-xl bg-nexus-900 border border-white/5 hover:border-cyan-accent/30 text-gray-300 hover:text-white transition-all block">
              <div class="text-base mb-1">📖</div>
              <div class="text-xs font-bold font-heading text-white">Esports Blog</div>
              <div class="text-[9px] text-gray-400">Meta & Updates</div>
            </a>
            <a href="/affiliate.html" class="p-2.5 rounded-xl bg-nexus-900 border border-white/5 hover:border-emerald-500/30 text-gray-300 hover:text-white transition-all block">
              <div class="text-base mb-1">🤝</div>
              <div class="text-xs font-bold font-heading text-white">Affiliate</div>
              <div class="text-[9px] text-emerald-400">Earn Commission</div>
            </a>
          </div>
        </div>

        <!-- Section 3: Customer Care & Support -->
        <div class="space-y-2">
          <div class="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider px-1">
            Customer Support & Policies
          </div>
          <div class="space-y-1">
            <a href="/help.html" class="flex items-center gap-2.5 p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs transition-all">
              <span class="text-cyan-accent">💡</span> Help Center & 24/7 FAQ
            </a>
            <a href="/shipping.html" class="flex items-center gap-2.5 p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs transition-all">
              <span class="text-emerald-400">🚚</span> 0-60s Delivery Information
            </a>
            <a href="/returns.html" class="flex items-center gap-2.5 p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs transition-all">
              <span class="text-amber-400">🔄</span> Returns & 100% Refund Policy
            </a>
            <a href="/warranty.html" class="flex items-center gap-2.5 p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs transition-all">
              <span class="text-blue-400">🛡️</span> 100% Anti-Ban Warranty
            </a>
            <a href="/contact.html" class="flex items-center gap-2.5 p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs transition-all">
              <span class="text-pink-400">💬</span> Contact Us (24/7 WhatsApp)
            </a>
          </div>
        </div>

      </div>

      <!-- Drawer Sticky Footer -->
      <div class="p-4 border-t border-white/10 bg-nexus-950/90 space-y-2 shrink-0">
        <div class="grid grid-cols-2 gap-2">
          <a href="/cart.html" class="py-2.5 px-3 rounded-xl bg-nexus-900 hover:bg-nexus-800 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all">
            <svg class="w-4 h-4 text-cyan-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span>My Cart</span>
          </a>
          <a href="/admin/" target="_blank" class="py-2.5 px-3 rounded-xl bg-cyan-accent/10 hover:bg-cyan-accent text-cyan-accent hover:text-nexus-950 border border-cyan-accent/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span>Admin</span>
          </a>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(menuWrapper);

  // 3. Bind open/close logic
  const overlay = document.getElementById('mobile-overlay');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-close-btn');

  function openDrawer() {
    updateMobileUserUI();
    menuWrapper.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
      drawer.style.transform = 'translateX(0)';
    });
  }

  function closeDrawer() {
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    drawer.style.transform = 'translateX(100%)';
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      menuWrapper.classList.add('hidden');
    }, 300);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Bind to all mobile menu trigger buttons across the document
  document.querySelectorAll('#mobile-menu-btn, .mobile-menu-trigger').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openDrawer();
    };
  });

  // Close drawer on internal navigation click
  menuWrapper.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Expose globally
  window.nexusOpenMobileMenu = openDrawer;
  window.nexusCloseMobileMenu = closeDrawer;

  updateMobileUserUI();
}

// Update the user identity card inside mobile drawer
export function updateMobileUserUI() {
  const container = document.getElementById('mobileUserCard');
  if (!container) return;

  const rawUser = localStorage.getItem('nexus_user');
  let user = null;
  if (rawUser) {
    try { user = JSON.parse(rawUser); } catch(e) {}
  }

  if (user && user.email) {
    const displayName = user.username || user.name || user.email.split('@')[0];
    const userRole = user.role === 'admin' ? '🛡️ Admin' : '🎮 Verified Gamer';
    container.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-accent to-pink-500 p-[1.5px] shrink-0">
            <div class="w-full h-full bg-nexus-950 rounded-[10px] flex items-center justify-center font-bold text-white text-sm font-heading">
              ${displayName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <div class="font-heading font-bold text-white text-sm leading-tight truncate max-w-[130px]">${displayName}</div>
            <div class="text-[10px] text-cyan-accent font-mono">${userRole}</div>
          </div>
        </div>
        <a href="/user-dashboard.html" class="px-3 py-1.5 rounded-xl bg-cyan-accent text-nexus-950 font-bold text-[11px] font-mono hover:bg-[#e8a4b6] transition-all">
          Profile
        </a>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <div class="font-heading font-bold text-white text-sm">Join Tusher Squad</div>
          <div class="text-[10px] text-gray-400">Save payment UIDs & track orders</div>
        </div>
        <button onclick="if(window.nexusCloseMobileMenu) window.nexusCloseMobileMenu(); if(window.nexusOpenAuthModal) window.nexusOpenAuthModal('login');" class="px-3 py-1.5 rounded-xl bg-cyan-accent text-nexus-950 font-bold text-xs font-mono hover:bg-[#e8a4b6] transition-all shadow-md">
          Sign In
        </button>
      </div>
    `;
  }
}
