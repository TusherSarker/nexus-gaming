import './style.css';
import { addToCart, getCartCount, registerProduct, PRODUCTS } from './cart-store.js';
import { initAuthModal, updateNavbarUserUI } from './auth-modal.js';
import { initLightbox, openLightbox } from './lightbox.js';

// State
let isAnnualBilling = false;
let liveProducts = [];

// ===== Initialize Lucide Icons & Page Modules =====
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  initAuthModal();
  updateNavbarUserUI();
  initLightbox();
  initNavbar();
  initMobileMenu();
  initSearchModal();
  initHeroCharacters();
  initCategoryFilters();
  initCarousel();
  initBillingToggle();
  initScrollReveal();
  initBackToTop();
  initCardClickDelegation();
  initAddToCartDelegation();
  initSubscriptionDelegation();
  initNewsletter();
  updateCartBadge();

  // Fetch real live products, categories and subscriptions from database
  fetchLiveCategories();
  fetchLiveProducts();
  fetchLiveSubscriptions();
});

// ===== 3D FLOATING HERO CHARACTERS SWITCHER =====
const HERO_CHARACTERS = [
  {
    name: 'PUBG Mobile • Level 3 Assault',
    tag: 'PUBG Mobile • Level 3 Assault',
    badge: '100% Ban-Proof UC',
    src: '/characters/pubg-transparent.png',
    glow: '#d47f97'
  },
  {
    name: 'Call of Duty Mobile • Ghost Operator',
    tag: 'COD Mobile • Ghost Operator',
    badge: 'CP Vault Direct Credit',
    src: '/characters/cod-ghost-transparent.png',
    glow: '#d47f97'
  },
  {
    name: 'Cyber Ops • VR Pulse Warrior',
    tag: 'Cyber Ops • VR Pulse Warrior',
    badge: 'Instant Battle Pass',
    src: '/characters/cyber-soldier-transparent.png',
    glow: '#38bdf8'
  },
  {
    name: 'Clash of Clans • Barbarian King',
    tag: 'Clash of Clans • Barbarian King',
    badge: 'Gems & Gold Pass',
    src: '/characters/clash-barbarian-transparent.png',
    glow: '#f59e0b'
  },
  {
    name: 'Mobile Legends • Shadow Assassin',
    tag: 'Mobile Legends • Shadow Assassin',
    badge: 'Diamonds Direct Credit',
    src: '/characters/shadow-assassin-transparent.png',
    glow: '#c084fc'
  }
];

let currentHeroCharIdx = 0;
let heroCharAutoTimer = null;

function initHeroCharacters() {
  const mainImg = document.getElementById('heroMainCharacterImg');
  const tagEl = document.getElementById('heroCharTag');
  const badgeEl = document.getElementById('heroCharBadge');
  if (!mainImg) return;

  function switchHeroCharacter(index) {
    if (index < 0 || index >= HERO_CHARACTERS.length) return;
    currentHeroCharIdx = index;
    const char = HERO_CHARACTERS[index];

    mainImg.style.opacity = '0';
    mainImg.style.transform = 'scale(0.92) translateY(8px)';

    setTimeout(() => {
      mainImg.src = char.src;
      mainImg.alt = char.name;
      if (tagEl) tagEl.textContent = char.tag;
      if (badgeEl) badgeEl.textContent = char.badge;
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1) translateY(0)';
    }, 180);
  }

  function startAutoHeroRotation() {
    if (heroCharAutoTimer) clearInterval(heroCharAutoTimer);
    heroCharAutoTimer = setInterval(() => {
      currentHeroCharIdx = (currentHeroCharIdx + 1) % HERO_CHARACTERS.length;
      switchHeroCharacter(currentHeroCharIdx);
    }, 2800);
  }

  startAutoHeroRotation();
}

// ===== PUBG DYNAMIC LOGO CYCLING & TOGGLE =====
const PUBG_LOGOS = [
  { name: 'White Box Emblem', src: '/categories/pubg-logo-2.png' },
  { name: 'Official Yellow Logo', src: '/categories/pubg-logo-3.png' }
];
let currentPubgLogoIndex = 0;
let pubgLogoCycleInterval = null;

window.togglePubgLogo = function(targetIdx = null) {
  if (targetIdx !== null) {
    currentPubgLogoIndex = targetIdx % PUBG_LOGOS.length;
  } else {
    currentPubgLogoIndex = (currentPubgLogoIndex + 1) % PUBG_LOGOS.length;
  }
  updateAllPubgLogosUI();
};

function updateAllPubgLogosUI() {
  const pubgImgs = document.querySelectorAll('.pubg-dynamic-logo-img');
  const pubgDots = document.querySelectorAll('.pubg-logo-dot');
  const activeLogo = PUBG_LOGOS[currentPubgLogoIndex];

  pubgImgs.forEach(img => {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.85) rotateY(90deg)';
    setTimeout(() => {
      img.src = activeLogo.src;
      img.alt = `PUBG Mobile - ${activeLogo.name}`;
      img.style.opacity = '1';
      img.style.transform = 'scale(1) rotateY(0deg)';
    }, 150);
  });

  pubgDots.forEach(dot => {
    const dotIdx = parseInt(dot.dataset.dotIdx, 10);
    if (dotIdx === currentPubgLogoIndex) {
      dot.className = 'pubg-logo-dot w-2 h-2 rounded-full bg-cyan-accent scale-125 transition-all shadow-glow-cyan-sm';
    } else {
      dot.className = 'pubg-logo-dot w-2 h-2 rounded-full bg-white/30 hover:bg-white/70 transition-all';
    }
  });
}

function initPubgLogoCycle() {
  if (pubgLogoCycleInterval) clearInterval(pubgLogoCycleInterval);
  pubgLogoCycleInterval = setInterval(() => {
    currentPubgLogoIndex = (currentPubgLogoIndex + 1) % PUBG_LOGOS.length;
    updateAllPubgLogosUI();
  }, 4000);
}

// ===== CATEGORY STATE & TOGGLE (1 Row initially, expandable to 20 Games) =====
let allLiveCategories = [];
let isCategoriesExpanded = false;

function renderCategoryGrid() {
  const grid = document.getElementById('categoriesGrid');
  const toggleBtn = document.getElementById('toggleCategoriesBtn');
  const toggleText = document.getElementById('toggleCategoriesText');
  const toggleIcon = document.getElementById('toggleCategoriesIcon');

  if (!grid || allLiveCategories.length === 0) return;

  // If collapsed: show only 5 categories (1 clean row on desktop)
  // If expanded: show all 20 categories
  const visibleCategories = isCategoriesExpanded ? allLiveCategories : allLiveCategories.slice(0, 5);

  grid.innerHTML = visibleCategories.map(cat => {
    const isPubg = cat.slug === 'pubg-mobile' || cat.name.toLowerCase().includes('pubg');
    const logoImg = isPubg ? PUBG_LOGOS[currentPubgLogoIndex].src : (cat.image || `/categories/${cat.slug}.svg`);

    if (isPubg) {
      return `
        <a href="#products" data-filter-game="${cat.name}" class="glass-card rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center gap-3.5 group cursor-pointer hover:border-cyan-accent/50 hover:shadow-glow-cyan-sm transition-all animate-fade-in relative" title="Click icon to switch PUBG logos">
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-nexus-900/90 p-3 border border-white/10 flex items-center justify-center group-hover:border-cyan-accent/50 group-hover:scale-105 transition-all shadow-lg overflow-hidden" onclick="event.preventDefault(); event.stopPropagation(); window.togglePubgLogo();" title="Click to Toggle PUBG Logo">
            <img src="${logoImg}" alt="${cat.name}" class="pubg-dynamic-logo-img w-full h-full object-contain filter drop-shadow-md group-hover:brightness-110 transition-all duration-300" onerror="this.onerror=null; this.src='/categories/pubg-logo-3.png'">
            <!-- 2-Dot Logo Indicator / Switcher -->
            <div class="absolute bottom-1 inset-x-0 flex items-center justify-center gap-1.5 z-20 py-0.5 bg-nexus-950/80 backdrop-blur-xs rounded-full mx-3">
              <span data-dot-idx="0" class="pubg-logo-dot w-2 h-2 rounded-full ${currentPubgLogoIndex === 0 ? 'bg-cyan-accent scale-125' : 'bg-white/30'}" onclick="event.preventDefault(); event.stopPropagation(); window.togglePubgLogo(0);"></span>
              <span data-dot-idx="1" class="pubg-logo-dot w-2 h-2 rounded-full ${currentPubgLogoIndex === 1 ? 'bg-cyan-accent scale-125' : 'bg-white/30'}" onclick="event.preventDefault(); event.stopPropagation(); window.togglePubgLogo(1);"></span>
            </div>
          </div>
          <div>
            <span class="font-heading font-bold text-base text-white group-hover:text-cyan-accent transition-colors block truncate max-w-[150px]">${cat.name}</span>
            <span class="text-xs text-gray-400 font-mono block truncate max-w-[150px]">UC & Royale Pass</span>
          </div>
        </a>
      `;
    }

    return `
      <a href="#products" data-filter-game="${cat.name}" class="glass-card rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center gap-3.5 group cursor-pointer hover:border-cyan-accent/50 hover:shadow-glow-cyan-sm transition-all animate-fade-in">
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-nexus-900/90 p-3 border border-white/10 flex items-center justify-center group-hover:border-cyan-accent/50 group-hover:scale-105 transition-all shadow-lg overflow-hidden">
          <img src="${logoImg}" alt="${cat.name}" class="w-full h-full object-contain filter drop-shadow-md group-hover:brightness-110 transition-all" onerror="this.onerror=null; this.src='/categories/pubg-mobile.svg'">
        </div>
        <div>
          <span class="font-heading font-bold text-base text-white group-hover:text-cyan-accent transition-colors block truncate max-w-[150px]">${cat.name}</span>
          <span class="text-xs text-gray-400 font-mono block truncate max-w-[150px]">${cat.description ? cat.description.split(',')[0] : 'Top-Up & Pass'}</span>
        </div>
      </a>
    `;
  }).join('');

  initPubgLogoCycle();

  if (toggleBtn && toggleText) {
    if (isCategoriesExpanded) {
      toggleText.textContent = 'Show Less Categories';
      if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'chevron-up');
    } else {
      toggleText.textContent = `See More Categories (${allLiveCategories.length} Games)`;
      if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'chevron-down');
    }
  }

  if (window.lucide) lucide.createIcons();
  initCategoryFilters();
}

function initCategoryToggle() {
  const toggleBtn = document.getElementById('toggleCategoriesBtn');
  if (!toggleBtn) return;

  toggleBtn.onclick = () => {
    isCategoriesExpanded = !isCategoriesExpanded;
    renderCategoryGrid();

    // If collapsing back to 1 row, smoothly scroll to category section
    if (!isCategoriesExpanded) {
      const catSection = document.getElementById('categories');
      if (catSection) {
        catSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
}

// ===== FETCH LIVE DATABASE CATEGORIES (20 Popular Games) =====
async function fetchLiveCategories() {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) return;
    const data = await res.json();
    const categories = data.data || [];
    if (categories.length === 0) return;

    allLiveCategories = categories;
    renderCategoryGrid();
    initCategoryToggle();

    const filterTabs = document.getElementById('categoryFilterTabs');
    // Render game filter tabs
    if (filterTabs) {
      const topGames = categories.slice(0, 10);
      filterTabs.innerHTML = `
        <button class="cat-filter-btn px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-cyan-accent text-nexus-900 shadow-glow-cyan-sm transition-all" data-category="all">All Games</button>
        ${topGames.map(c => `
          <button class="cat-filter-btn px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-nexus-800 text-text-secondary border border-white/10 hover:text-cyan-accent hover:border-cyan-accent/30 transition-all truncate max-w-[160px]" data-category="${c.name}">${c.name}</button>
        `).join('')}
      `;
    }

    if (window.lucide) lucide.createIcons();
    initCategoryFilters();
  } catch (err) {
    console.warn('Using default game categories:', err);
  }
}

// ===== UPDATE CART BADGE FROM STORE =====
function updateCartBadge() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const count = getCartCount();
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Listen for cart updates across tabs or windows
window.addEventListener('storage', (e) => {
  if (e.key === 'nexus_cart') updateCartBadge();
});

// ===== FETCH LIVE DATABASE PRODUCTS =====
async function fetchLiveProducts() {
  try {
    const res = await fetch('/api/products?limit=50');
    if (!res.ok) return;
    const data = await res.json();
    const products = data.data || [];
    if (products.length === 0) return;

    liveProducts = products;
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    // Register each live product into shared cart catalog
    products.forEach(p => {
      const catName = p.category && typeof p.category === 'object' ? p.category.name : (p.category || 'Gear');
      registerProduct({
        id: p.slug || p._id,
        name: p.name,
        category: catName,
        price: Math.round(p.price || 0),
        comparePrice: Math.round(p.comparePrice || 0),
        image: p.image || '/products/gaming_headset.jpg',
        rating: p.rating || 5,
        reviews: p.reviewCount || 10,
        description: p.description || '',
      });
    });

    // Render live real database products with image lightbox & product page links
    grid.innerHTML = products.map(p => {
      const catName = p.category && typeof p.category === 'object' ? p.category.name : (p.category || 'Gear');
      const prodId = p.slug || p._id;
      const imgUrl = p.image || '/products/gaming_headset.jpg';
      const price = Math.round(p.price || 0);
      const badgeHtml = p.badge ? `
        <span class="${p.badge === 'New' ? 'badge-new' : p.badge === 'Best Seller' || p.badge === 'Popular' ? 'badge-hot' : 'badge-popular'} absolute top-4 left-4 z-10">${p.badge}</span>
      ` : '';

      return `
        <div class="glass-card rounded-2xl overflow-hidden group reveal active product-item cursor-pointer hover:border-cyan-accent/40 transition-all flex flex-col justify-between" data-product-card-id="${prodId}" data-product-category="${catName}">
          <div>
            <!-- Image Area (Click to open big image lightbox) -->
            <div class="relative p-4 pb-0 overflow-hidden cursor-zoom-in group/img" data-open-lightbox="${imgUrl}" data-lightbox-title="${p.name}" data-lightbox-category="${catName}" data-lightbox-id="${prodId}" title="Click to view big high-res image">
              ${badgeHtml}
              <div class="absolute top-4 right-4 z-10 px-2 py-1 rounded-md bg-nexus-900/80 border border-white/10 text-[10px] text-cyan-accent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1 shadow-lg">
                <i data-lucide="maximize-2" class="w-3 h-3"></i> Big View
              </div>
              <div class="aspect-square w-full flex items-center justify-center overflow-hidden p-2 rounded-xl bg-nexus-950/40">
                <img src="${imgUrl}" alt="${p.name}" class="w-full h-full object-contain transition-transform duration-500 group-hover/img:scale-110" loading="lazy">
              </div>
            </div>

            <!-- Content Area (Click to view full description page) -->
            <div class="p-6 pt-4 space-y-2.5">
              <p class="text-text-muted text-[10px] uppercase font-mono tracking-widest">${catName}</p>
              <a href="/product-details.html?id=${prodId}" class="font-heading font-bold text-lg leading-tight text-white hover:text-cyan-accent transition-colors block truncate" title="Click to view full description and specifications">
                ${p.name}
              </a>
              <div class="flex items-center gap-1.5">
                <div class="flex text-gold-accent text-xs">
                  ${Array.from({ length: 5 }, (_, i) => `<span class="${i < (p.rating || 5) ? 'text-gold-accent' : 'text-nexus-600'}">★</span>`).join('')}
                </div>
                <span class="text-text-muted text-[11px]">(${p.reviewCount || 10})</span>
              </div>
            </div>
          </div>

          <!-- Bottom Purchase Row -->
          <div class="p-6 pt-0">
            <div class="flex items-center justify-between pt-3 border-t border-white/5">
              <span class="font-mono font-bold text-xl text-cyan-accent">$${price}</span>
              <button class="btn-primary !px-4 !py-2 !text-xs font-semibold" data-product-id="${prodId}" aria-label="Add ${p.name} to cart">
                Add to Loadout
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  } catch (err) {
    console.warn('Using offline product catalog cache:', err);
  }
}

// ===== FETCH LIVE DATABASE SUBSCRIPTIONS =====
async function fetchLiveSubscriptions() {
  try {
    const res = await fetch('/api/subscriptions');
    if (!res.ok) return;
    const data = await res.json();
    const plans = data.data || [];
    if (plans.length === 0) return;

    // Register live plans into cart catalog
    plans.forEach(plan => {
      const slug = plan.slug || plan.name.toLowerCase();
      registerProduct({
        id: `sub-${slug}-monthly`,
        name: `Nexus Pass: ${plan.name} (Monthly)`,
        category: 'Subscription',
        price: Math.round(plan.monthlyPrice || 10),
        image: '/products/gaming_controller.jpg',
        isSubscription: true,
      });
      registerProduct({
        id: `sub-${slug}-annual`,
        name: `Nexus Pass: ${plan.name} (Annual)`,
        category: 'Subscription',
        price: Math.round(plan.annualPrice || 8),
        image: '/products/gaming_controller.jpg',
        isSubscription: true,
      });
    });
  } catch (err) {
    console.warn('Using offline subscription cache:', err);
  }
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      navbar.classList.add('glass-strong', 'shadow-card');
      navbar.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
    } else {
      navbar.classList.remove('glass-strong', 'shadow-card');
      navbar.style.borderBottom = 'none';
    }

    if (currentScroll > 400) {
      if (currentScroll > lastScroll && currentScroll - lastScroll > 10) {
        navbar.style.transform = 'translateY(-100%)';
      } else if (lastScroll - currentScroll > 10) {
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-overlay');
  if (!menuBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.remove('hidden');
    requestAnimationFrame(() => {
      drawer.style.transform = 'translateX(0)';
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.style.transform = 'translateX(100%)';
    document.body.style.overflow = '';
    setTimeout(() => mobileMenu.classList.add('hidden'), 300);
  }

  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ===== UNIVERSAL MULTI-CATEGORY SEARCH ENGINE =====
const SEARCHABLE_DATABASE = [
  // 1. Hardware Gear
  { id: 'h-1', title: 'Aurora Pro Wireless Headset', category: 'Hardware Gear', type: 'gear', url: '/product-details.html?id=1', image: '/products/gaming_headset.jpg', price: '$149.99', badge: 'Best Seller', keywords: ['headset', 'audio', '7.1 spatial', 'wireless', 'mic', 'headphones', 'sound', 'aurora'] },
  { id: 'h-2', title: 'Vortex K70 Mechanical Keyboard', category: 'Hardware Gear', type: 'gear', url: '/product-details.html?id=2', image: '/products/gaming_keyboard.jpg', price: '$229.99', badge: 'New', keywords: ['keyboard', 'mechanical', 'hall effect', 'rapid trigger', 'rgb', 'switches', 'vortex', 'k70', 'tenz'] },
  { id: 'h-3', title: 'Phantom X Wireless Mouse', category: 'Hardware Gear', type: 'gear', url: '/product-details.html?id=3', image: '/products/gaming_mouse.jpg', price: '$159.99', badge: 'Ultralight', keywords: ['mouse', 'wireless', '30k dpi', 'sensor', '8000hz', 'lightweight', 'phantom', 'aim'] },
  { id: 'h-4', title: 'Nexus Elite Controller', category: 'Hardware Gear', type: 'gear', url: '/product-details.html?id=4', image: '/products/gaming_controller.jpg', price: '$199.99', badge: 'Limited', keywords: ['controller', 'gamepad', 'hall effect', 'paddles', 'joystick', 'wireless', 'trigger stops'] },
  { id: 'h-5', title: 'UltraWide QD-OLED 34" Monitor', category: 'Hardware Gear', type: 'gear', url: '/product-details.html?id=5', image: '/products/gaming_monitor.jpg', price: '$999.00', badge: '240Hz OLED', keywords: ['monitor', 'screen', 'oled', 'qd-oled', 'ultrawide', '240hz', '0.03ms', 'display', 'hdr'] },
  { id: 'h-6', title: 'RGB Control Desk Mat XXL', category: 'Hardware Gear', type: 'gear', url: '/product-details.html?id=6', image: '/products/gaming_mousepad.jpg', price: '$49.99', badge: 'Esports Mat', keywords: ['desk mat', 'mousepad', 'rgb', 'micro-weave', 'xxl', 'pad', 'control'] },
  { id: 'h-7', title: 'StreamCam 4K HDR Webcam', category: 'Hardware Gear', type: 'gear', url: '/product-details.html?id=7', image: '/products/gaming_webcam.jpg', price: '$179.99', badge: 'Popular', keywords: ['webcam', 'camera', '4k', 'streaming', '60fps', 'hdr', 'streamer', 'youtube', 'twitch'] },
  { id: 'h-8', title: 'Titan Ergonomic Gaming Chair', category: 'Hardware Gear', type: 'gear', url: '/product-details.html?id=8', image: '/products/gaming_chair.jpg', price: '$399.99', badge: 'Ergonomic', keywords: ['chair', 'gaming chair', 'ergonomic', 'lumbar', '4d armrest', 'memory foam', 'titan'] },

  // 2. Popular Games & In-Game Top-Ups
  { id: 'g-1', title: 'PUBG Mobile Unknown Cash (UC)', category: 'Game Top-Ups', type: 'game', url: '/#products', image: '/categories/pubg-logo-3.png', price: 'Instant Direct UID', badge: '100% Anti-Ban', keywords: ['pubg', 'pubg mobile', 'uc', 'unknown cash', 'royale pass', 'a9 pass', 'glacier', 'erangel', 'bgmi', 'krafton', 'tencent'] },
  { id: 'g-2', title: 'Free Fire Diamonds & Booyah Pass', category: 'Game Top-Ups', type: 'game', url: '/#products', image: '/categories/free-fire.svg', price: 'Instant 0-60s', badge: 'Official UID', keywords: ['free fire', 'diamonds', 'booyah pass', 'garena', 'ff', 'alok', 'tatsuya', 'knife', 'ob46'] },
  { id: 'g-3', title: 'Call of Duty: Mobile CP & Battle Pass', category: 'Game Top-Ups', type: 'game', url: '/#products', image: '/categories/cod-mobile.svg', price: 'Instant Direct UID', badge: 'Mythic Vault', keywords: ['cod', 'cod mobile', 'codm', 'cp', 'cod points', 'battle pass', 'activision', 'ghost', 'warzone', 'mythic'] },
  { id: 'g-4', title: 'eFootball 2026 Coins & Match Pass', category: 'Game Top-Ups', type: 'game', url: '/#products', image: '/categories/efootball.svg', price: 'Instant Direct UID', badge: 'Konami Direct', keywords: ['efootball', 'efootball 2026', 'coins', 'pes', 'match pass', 'messi', 'konami', 'booster', 'fifa'] },
  { id: 'g-5', title: 'Mobile Legends: Bang Bang Diamonds', category: 'Game Top-Ups', type: 'game', url: '/#products', image: '/categories/mobile-legends.svg', price: 'Instant Direct UID', badge: 'Moonton Direct', keywords: ['mobile legends', 'mlbb', 'diamonds', 'starlight', 'twilight pass', 'moonton'] },
  { id: 'g-6', title: 'Valorant Points (VP) & Radianite', category: 'Game Top-Ups', type: 'game', url: '/#products', image: '/categories/valorant.svg', price: 'Digital Code', badge: 'Riot Direct', keywords: ['valorant', 'vp', 'valorant points', 'radianite', 'riot games', 'tenz', 'vct', 'skins'] },
  { id: 'g-7', title: 'EA Sports FC Mobile FC Points', category: 'Game Top-Ups', type: 'game', url: '/#products', image: '/categories/ea-fc-mobile.svg', price: 'Instant Direct UID', badge: 'EA Sports', keywords: ['ea fc', 'ea fc mobile', 'fc points', 'fifa mobile', 'star pass', 'ea sports', 'toty'] },
  { id: 'g-8', title: 'Genshin Impact Genesis Crystals', category: 'Game Top-Ups', type: 'game', url: '/#products', image: '/categories/genshin-impact.svg', price: 'Instant Direct UID', badge: 'HoYoverse', keywords: ['genshin', 'genshin impact', 'genesis crystals', 'welkin moon', 'primogems', 'hoyoverse'] },
  { id: 'g-9', title: 'Roblox Robux & Premium Vouchers', category: 'Game Top-Ups', type: 'game', url: '/#products', image: '/categories/roblox.svg', price: 'Digital Gift Code', badge: 'Roblox Code', keywords: ['roblox', 'robux', 'premium', 'avatar', 'bloxfruits'] },
  { id: 'g-10', title: 'Minecraft Minecoins & Marketplace Pass', category: 'Game Top-Ups', type: 'game', url: '/#products', image: '/categories/minecraft.svg', price: 'Digital Code', badge: 'Mojang', keywords: ['minecraft', 'minecoins', 'marketplace', 'bedrock', 'java', 'mojang'] },

  // 3. VIP Subscription Passes
  { id: 's-1', title: 'Starter Game Pass ($9.99/mo)', category: 'VIP Passes', type: 'sub', url: '/#subscriptions', image: '/vite.svg', price: '$9.99/mo', badge: 'Starter', keywords: ['subscription', 'starter pass', 'cloud gaming', '100+ games', 'vip', 'pass'] },
  { id: 's-2', title: 'Pro Game Pass ($19.99/mo)', category: 'VIP Passes', type: 'sub', url: '/#subscriptions', image: '/vite.svg', price: '$19.99/mo', badge: 'Most Popular', keywords: ['subscription', 'pro pass', '500+ games', '1080p stream', 'early access', 'vip'] },
  { id: 's-3', title: 'Elite Game Pass ($29.99/mo)', category: 'VIP Passes', type: 'sub', url: '/#subscriptions', image: '/vite.svg', price: '$29.99/mo', badge: 'Elite VIP', keywords: ['subscription', 'elite pass', '1000+ games', '4k streaming', 'controller included', 'vip'] },

  // 4. Support & Policies
  { id: 'p-1', title: 'Help Center & 24/7 FAQ', category: 'Support & Help', type: 'page', url: '/help.html', image: null, icon: 'help-circle', price: 'Support Desk', badge: '24/7 Live', keywords: ['help', 'faq', 'questions', 'support', 'uid guide', 'ticket', 'assistance', 'stuck recharge'] },
  { id: 'p-2', title: 'Shipping & Instant Delivery Info', category: 'Support & Help', type: 'page', url: '/shipping.html', image: null, icon: 'truck', price: '0-60s Delivery', badge: 'Worldwide', keywords: ['shipping', 'delivery', 'dhaka express', 'tracking', 'courier', 'instant delivery', 'time', 'rates'] },
  { id: 'p-3', title: 'Returns & 100% Refund Policy', category: 'Support & Help', type: 'page', url: '/returns.html', image: null, icon: 'rotate-ccw', price: '1-Hour Refund', badge: 'Guarantee', keywords: ['return', 'refund', 'money back', 'money-back', 'failed order', 'exchange', 'rma', '30-day'] },
  { id: 'p-4', title: 'Warranty & 100% Anti-Ban Guarantee', category: 'Support & Help', type: 'page', url: '/warranty.html', image: null, icon: 'shield-check', price: '2-Year Warranty', badge: 'Ironclad', keywords: ['warranty', 'anti-ban', 'ban safety', 'guarantee', 'publisher authorized', 'rma claim', 'defective', 'repair'] },
  { id: 'p-5', title: 'Contact Us & WhatsApp Desk', category: 'Support & Help', type: 'page', url: '/contact.html', image: null, icon: 'message-circle', price: 'Direct Desk', badge: 'WhatsApp / Discord', keywords: ['contact', 'whatsapp', 'discord', 'email', 'phone', 'location', 'office', 'headquarters'] },

  // 5. Community & Esports
  { id: 'c-1', title: 'Gaming Blog & Weapon Meta Guides', category: 'Community & Content', type: 'page', url: '/blog.html', image: null, icon: 'book-open', price: 'Free Esports Guides', badge: 'Meta Guides', keywords: ['blog', 'guides', 'news', 'meta', 'pubg 3.5', 'free fire ob46', 'cod season 8', 'efootball formations', 'keyboards'] },
  { id: 'c-2', title: 'Pro Esports Setups & Sensitivity Codes', category: 'Community & Content', type: 'page', url: '/pro-setups.html', image: null, icon: 'crosshair', price: 'Verified Sens', badge: 'Mortal & TenZ', keywords: ['pro setups', 'sensitivity', 'sens', 'gyroscope', 'hud', '4-finger claw', 'mortal', 'nobru', 'tenz', 'dpi'] },
  { id: 'c-3', title: 'Community Tournaments & Scrims', category: 'Community & Content', type: 'page', url: '/tournaments.html', image: null, icon: 'trophy', price: '100K BDT Pools', badge: 'Registration Open', keywords: ['tournaments', 'scrims', 'esports cup', 'championship', 'squad showdown', 'clash squad', 'prize pool', 'register'] },
  { id: 'c-4', title: 'Affiliate & Creator Partner Program', category: 'Community & Content', type: 'page', url: '/affiliate.html', image: null, icon: 'gift', price: '10-15% Commission', badge: 'Creator Code', keywords: ['affiliate', 'creator', 'creator code', 'partner', 'streamer', 'commission', 'payout', 'monetize'] },
];

function initSearchModal() {
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (!searchBtn || !searchModal) return;

  function openSearch() {
    searchModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput && searchInput.focus(), 100);
  }

  function closeSearch() {
    searchModal.classList.add('hidden');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.classList.add('hidden');
  }

  searchBtn.addEventListener('click', openSearch);
  if (searchOverlay) searchOverlay.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchModal.classList.contains('hidden') ? openSearch() : closeSearch();
    }
    if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
      closeSearch();
    }
  });

  // Universal Search Algorithm
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      if (!q) {
        searchResults.classList.add('hidden');
        searchResults.innerHTML = '';
        return;
      }

      const tokens = q.split(/\s+/).filter(Boolean);

      // Score and rank all items
      const scoredItems = SEARCHABLE_DATABASE.map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const catLower = item.category.toLowerCase();
        const keywordsStr = (item.keywords || []).join(' ').toLowerCase();

        // Exact match in title
        if (titleLower === q) score += 120;
        else if (titleLower.includes(q)) score += 70;

        // Token match scoring
        tokens.forEach(tok => {
          if (titleLower.startsWith(tok)) score += 40;
          else if (titleLower.includes(tok)) score += 25;

          if (keywordsStr.includes(tok)) score += 20;
          if (catLower.includes(tok)) score += 15;
        });

        return { item, score };
      })
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.item);

      if (scoredItems.length === 0) {
        searchResults.innerHTML = `
          <div class="p-6 text-center text-sm text-gray-400 space-y-2">
            <i data-lucide="search-x" class="w-8 h-8 text-gray-500 mx-auto"></i>
            <div>No exact match found for "<span class="text-white font-semibold">${q}</span>"</div>
            <div class="text-xs text-text-muted">Try searching for <strong>PUBG, UC, Free Fire, COD, Mortal, Headset, Shipping, or Tournaments</strong></div>
          </div>
        `;
      } else {
        // Render grouped results
        const grouped = {};
        scoredItems.forEach(item => {
          if (!grouped[item.category]) grouped[item.category] = [];
          grouped[item.category].push(item);
        });

        let html = '';
        Object.entries(grouped).forEach(([category, items]) => {
          html += `
            <div class="pt-2">
              <div class="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-cyan-accent font-bold flex items-center justify-between">
                <span>${category}</span>
                <span class="text-gray-500">${items.length} results</span>
              </div>
              <div class="space-y-1.5 mt-1">
          `;

          items.forEach(item => {
            const visual = item.image 
              ? `<img src="${item.image}" class="w-9 h-9 object-contain rounded-lg bg-nexus-900 p-1 border border-white/10 shrink-0" alt="${item.title}">`
              : `<div class="w-9 h-9 rounded-lg bg-cyan-accent/15 border border-cyan-accent/30 text-cyan-accent flex items-center justify-center shrink-0"><i data-lucide="${item.icon || 'arrow-right'}" class="w-4 h-4"></i></div>`;

            html += `
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-nexus-900/80 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group" onclick="window.location.href='${item.url}'">
                <div class="flex items-center gap-3 min-w-0">
                  ${visual}
                  <div class="min-w-0">
                    <h4 class="font-heading font-bold text-white text-sm truncate group-hover:text-cyan-accent transition-colors leading-tight">${item.title}</h4>
                    <div class="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400 font-mono">
                      <span class="text-cyan-accent font-semibold">${item.price}</span>
                      ${item.badge ? `<span>•</span> <span class="text-gray-400">${item.badge}</span>` : ''}
                    </div>
                  </div>
                </div>
                <div class="shrink-0 flex items-center gap-2 pl-2">
                  ${item.type === 'gear' ? `
                    <button class="btn-primary !px-2.5 !py-1 !text-[10px] font-bold" onclick="event.stopPropagation(); window.nexusAddToCart && window.nexusAddToCart(${item.id.replace('h-','')})">
                      Add
                    </button>
                  ` : `
                    <i data-lucide="chevron-right" class="w-4 h-4 text-gray-500 group-hover:text-cyan-accent group-hover:translate-x-0.5 transition-all"></i>
                  `}
                </div>
              </div>
            `;
          });

          html += `
              </div>
            </div>
          `;
        });

        searchResults.innerHTML = html;
      }

      searchResults.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    });
  }
}

// ===== CATEGORY FILTERING =====
function initCategoryFilters() {
  const filterTabs = document.getElementById('categoryFilterTabs');
  if (!filterTabs) return;

  function filterCategory(category) {
    const filterBtns = document.querySelectorAll('.cat-filter-btn');
    const productCards = document.querySelectorAll('.product-item');

    filterBtns.forEach(btn => {
      const btnCat = (btn.dataset.category || '').toLowerCase();
      const match = btnCat === category.toLowerCase();
      btn.classList.toggle('bg-cyan-accent', match);
      btn.classList.toggle('text-nexus-900', match);
      btn.classList.toggle('shadow-glow-cyan-sm', match);
      btn.classList.toggle('bg-nexus-800', !match);
      btn.classList.toggle('text-text-secondary', !match);
    });

    productCards.forEach(card => {
      const cardCat = (card.dataset.productCategory || '').toLowerCase();
      const targetCat = category.toLowerCase();
      if (targetCat === 'all' || cardCat === targetCat || cardCat.includes(targetCat) || targetCat.includes(cardCat)) {
        card.style.display = 'flex';
        card.classList.add('animate-fade-in');
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterTabs.onclick = (e) => {
    const btn = e.target.closest('.cat-filter-btn');
    if (btn) {
      filterCategory(btn.dataset.category);
    }
  };

  // Wire up category showcase cards to filter
  document.querySelectorAll('#categories [data-filter-game]').forEach(link => {
    link.onclick = (e) => {
      const gameName = link.dataset.filterGame || link.querySelector('span')?.textContent?.trim() || '';
      if (gameName) {
        filterCategory(gameName);
      }
    };
  });
}

// ===== TESTIMONIAL CAROUSEL =====
function initCarousel() {
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.glass-card');
  let currentIndex = 0;
  let autoplayInterval = null;

  function getVisibleCards() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCards());
  }

  function getCardStepWidth() {
    const card = cards[0];
    if (!card) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    return card.offsetWidth + gap;
  }

  function scrollToIndex(index) {
    const maxIdx = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, maxIdx));
    const offset = currentIndex * getCardStepWidth();
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function renderDots() {
    if (!dotsContainer) return;
    const maxIdx = getMaxIndex();
    const count = maxIdx + 1;
    dotsContainer.innerHTML = Array.from({ length: count }, (_, i) => `
      <button class="h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-cyan-accent w-7 shadow-glow-cyan-sm' : 'bg-nexus-600 w-2.5 hover:bg-nexus-500'}" aria-label="Slide ${i + 1}"></button>
    `).join('');

    dotsContainer.querySelectorAll('button').forEach((btn, i) => {
      btn.onclick = () => {
        stopAutoplay();
        scrollToIndex(i);
        startAutoplay();
      };
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    const buttons = dotsContainer.querySelectorAll('button');
    buttons.forEach((btn, i) => {
      if (i === currentIndex) {
        btn.className = 'w-7 h-2.5 rounded-full bg-cyan-accent transition-all duration-300 shadow-glow-cyan-sm';
      } else {
        btn.className = 'w-2.5 h-2.5 rounded-full bg-nexus-600 hover:bg-nexus-500 transition-all duration-300';
      }
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      const maxIdx = getMaxIndex();
      const nextIdx = currentIndex >= maxIdx ? 0 : currentIndex + 1;
      scrollToIndex(nextIdx);
    }, 4500);
  }

  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }

  prevBtn.onclick = () => {
    stopAutoplay();
    const maxIdx = getMaxIndex();
    const prevIdx = currentIndex <= 0 ? maxIdx : currentIndex - 1;
    scrollToIndex(prevIdx);
    startAutoplay();
  };

  nextBtn.onclick = () => {
    stopAutoplay();
    const maxIdx = getMaxIndex();
    const nextIdx = currentIndex >= maxIdx ? 0 : currentIndex + 1;
    scrollToIndex(nextIdx);
    startAutoplay();
  };

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      renderDots();
      scrollToIndex(Math.min(currentIndex, getMaxIndex()));
    }, 150);
  });

  renderDots();
  scrollToIndex(0);
  startAutoplay();
}

// ===== BILLING TOGGLE =====
function initBillingToggle() {
  const toggle = document.getElementById('billing-toggle');
  const dot = document.getElementById('toggle-dot');
  const monthlyLabel = document.getElementById('monthly-label');
  const annualLabel = document.getElementById('annual-label');
  const prices = document.querySelectorAll('.plan-price');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    isAnnualBilling = !isAnnualBilling;

    dot.style.transform = isAnnualBilling ? 'translateX(28px)' : 'translateX(0)';

    monthlyLabel.classList.toggle('text-text-primary', !isAnnualBilling);
    monthlyLabel.classList.toggle('text-text-muted', isAnnualBilling);
    annualLabel.classList.toggle('text-text-primary', isAnnualBilling);
    annualLabel.classList.toggle('text-text-muted', !isAnnualBilling);

    prices.forEach(el => {
      el.style.transition = 'opacity 0.2s, transform 0.2s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-4px)';

      setTimeout(() => {
        const price = isAnnualBilling ? el.dataset.annual : el.dataset.monthly;
        el.textContent = `$${Math.round(Number(price))}`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200);
    });
  });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.remove('opacity-0', 'invisible');
      btn.classList.add('opacity-100', 'visible');
    } else {
      btn.classList.add('opacity-0', 'invisible');
      btn.classList.remove('opacity-100', 'visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== CARD CLICKS: BIG IMAGE LIGHTBOX & PRODUCT DETAILS =====
function initCardClickDelegation() {
  document.body.addEventListener('click', (e) => {
    // 1. Check if user clicked on image zoom trigger
    const lightboxTrigger = e.target.closest('[data-open-lightbox]');
    if (lightboxTrigger) {
      e.stopPropagation();
      e.preventDefault();
      const src = lightboxTrigger.dataset.openLightbox;
      const title = lightboxTrigger.dataset.lightboxTitle || 'Gaming Hardware';
      const category = lightboxTrigger.dataset.lightboxCategory || 'Nexus Gear';
      const id = lightboxTrigger.dataset.lightboxId || '';
      openLightbox(src, title, category, id);
      return;
    }

    // 2. Check if user clicked on "Add to Loadout" button
    if (e.target.closest('[data-product-id]') || e.target.closest('[data-sub-tier]')) {
      return; // Handled by Add to Cart delegation
    }

    // 3. Check if user clicked on Product Card Body or Name
    const productCard = e.target.closest('[data-product-card-id]');
    if (productCard) {
      const prodId = productCard.dataset.productCardId;
      window.location.href = `/product-details.html?id=${prodId}`;
    }
  });
}

// ===== EVENT DELEGATION: ADD TO CART =====
function initAddToCartDelegation() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-product-id]');
    if (!btn) return;
    e.stopPropagation();
    e.preventDefault();

    const productId = btn.dataset.productId;
    addToCart(productId);
    updateCartBadge();

    showToast('Item added to your loadout! 🎮');

    const originalHTML = btn.innerHTML;
    btn.innerHTML = '✓ Added!';
    btn.classList.add('!bg-success');
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.classList.remove('!bg-success');
      if (window.lucide) lucide.createIcons();
    }, 1500);
  });
}

// ===== EVENT DELEGATION: SUBSCRIPTIONS =====
function initSubscriptionDelegation() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-sub-tier]');
    if (!btn) return;
    e.stopPropagation();
    e.preventDefault();

    const tier = btn.dataset.subTier; // 'starter' | 'pro' | 'elite'
    const cycle = isAnnualBilling ? 'annual' : 'monthly';
    const subId = `sub-${tier}-${cycle}`;

    addToCart(subId, 1);
    updateCartBadge();

    const originalHTML = btn.innerHTML;
    btn.innerHTML = '✓ Membership Activated!';
    btn.classList.add('!bg-success', '!text-white');
    
    showToast(`${tier.toUpperCase()} Pass added to loadout! 🚀`);

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.classList.remove('!bg-success', '!text-white');
      if (window.lucide) lucide.createIcons();
    }, 1800);
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast) return;

  toastMsg.textContent = message;
  toast.classList.remove('opacity-0', 'invisible', 'translate-y-4');
  toast.classList.add('opacity-100', 'visible', 'translate-y-0');

  setTimeout(() => {
    toast.classList.add('opacity-0', 'invisible', 'translate-y-4');
    toast.classList.remove('opacity-100', 'visible', 'translate-y-0');
  }, 3000);
}

// ===== NEWSLETTER FORM =====
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email');

    showToast(`Welcome to the squad! 🎉`);
    email.value = '';
  });
}
