import './style.css';
import { addToCart, getCartCount, PRODUCTS, registerProduct } from './cart-store.js';
import { initAuthModal, updateNavbarUserUI } from './auth-modal.js';
import { initLightbox, openLightbox } from './lightbox.js';

let currentProduct = null;
let currentQty = 1;
let currentImage = '';
let showcaseProfile = [];
let currentStageIndex = 0;
let isAutoPlaying = false;
let autoPlayInterval = null;

// Physics Engine State
let targetScrollProgress = 0;
let smoothScrollProgress = 0;
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

// Dynamic Engineering Profiles tailored for Official Gaming Top-Ups & Passes
const CATEGORY_SHOWCASE_PROFILES = {
  Default: {
    heroHeadline: ['OFFICIAL SERVER AUTH', 'PLAYER UID VALIDATION', 'ALL-INCLUSIVE FISCAL COMPLIANCE', 'INSTANT IN-GAME DEPLOYMENT'],
    stages: [
      {
        stage: '01 Auth',
        sub: 'Official Publisher API Handshake',
        title: 'Server-to-Server Gateway',
        desc: 'Direct integration with game publisher servers ensures instant authorized transactions with zero account ban risk.',
        zoom: '2.00X',
        rot: '6.5°',
        focusX: 16,
        focusY: -10,
        scale: 2.00,
        rotX: 8,
        rotY: 15,
        targetPos: { top: '35%', left: '38%' },
        aura: 'bg-cyan-accent/25',
        heading: '01. Official Server Authorization & API Handshake',
        hotspot1: { show: true, top: '35%', left: '38%', desc: 'Direct publisher API gateway with encrypted TLS 1.3 handshakes.' },
        hotspot2: { show: false },
        hotspot3: { show: false },
      },
      {
        stage: '02 Player UID',
        sub: 'Zero Password Required',
        title: 'Player UID In-Game Verification',
        desc: 'We verify your in-game character nickname against your Player ID before injection, ensuring 100% accurate and private delivery.',
        zoom: '1.40X',
        rot: '16.0°',
        focusX: -14,
        focusY: 8,
        scale: 1.40,
        rotX: -6,
        rotY: -20,
        targetPos: { top: '30%', left: '60%' },
        aura: 'bg-emerald-400/25',
        heading: '02. In-Game Player ID & Nickname Validation',
        hotspot1: { show: false },
        hotspot2: { show: true, top: '30%', left: '60%', desc: 'Automated player tag matching prevents incorrect delivery.' },
        hotspot3: { show: false },
      },
      {
        stage: '03 Tax & FX',
        sub: '100% Fiscal Compliance',
        title: 'Dual-Currency FX & VAT Taxes Included',
        desc: 'Every order includes international card processing fees, foreign exchange buffer, government VAT, and cloud infrastructure costs.',
        zoom: '1.65X',
        rot: '-10.0°',
        focusX: -8,
        focusY: -14,
        scale: 1.65,
        rotX: 12,
        rotY: -14,
        targetPos: { top: '52%', left: '48%' },
        aura: 'bg-gold-accent/25',
        heading: '03. Full Fiscal Invoicing & Dual-Currency Coverage',
        hotspot1: { show: false },
        hotspot2: { show: false },
        hotspot3: { show: true, top: '52%', left: '48%', desc: 'Official VAT digital goods invoice receipt generated per order.' },
      },
      {
        stage: '04 In-Game Deploy',
        sub: 'Fast 2-5 Minute Delivery',
        title: 'Instant In-Game Crediting',
        desc: 'Game credits and passes appear directly in your in-game mailbox/wallet, ready for draws, lucky wheels, battle passes, and skins.',
        zoom: '1.05X',
        rot: '0.0°',
        focusX: 0,
        focusY: 0,
        scale: 1.05,
        rotX: 0,
        rotY: 0,
        targetPos: { top: '50%', left: '50%' },
        aura: 'bg-gradient-to-r from-cyan-accent/25 via-magenta-accent/25 to-pink-500/25',
        heading: '04. Instant Deployment & Battle Pass Activation',
        hotspot1: { show: true, top: '25%', left: '35%', desc: 'Instant in-game wallet synchronization.' },
        hotspot2: { show: true, top: '70%', left: '65%', desc: '100% Ban-proof lifetime guarantee.' },
        hotspot3: { show: false },
      }
    ]
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) lucide.createIcons();

  initNavbar();
  initSearchModal();
  initAuthModal();
  updateNavbarUserUI();
  initLightbox();
  updateCartBadge();
  initHero3DStudio();
  initTabs();
  initQuantityControls();
  initPurchaseButtons();
  initReviewForm();

  await loadProductData();
  initPhysicsScrollytellingEngine();
});

// Smart Navbar: Auto-hide on scroll down, re-reveal on scroll up
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let lastScroll = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      if (currentScroll > lastScroll && currentScroll - lastScroll > 6) {
        // Scrolling down -> hide navbar smoothly
        navbar.style.transform = 'translateY(-100%)';
      } else if (lastScroll - currentScroll > 6) {
        // Scrolling up -> show navbar
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// Search Modal in Product Details
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

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      if (!q) {
        searchResults.classList.add('hidden');
        searchResults.innerHTML = '';
        return;
      }

      const matches = Object.values(PRODUCTS).filter(p => 
        !p.isSubscription && (p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)))
      );

      if (matches.length === 0) {
        searchResults.innerHTML = `<div class="p-4 text-center text-sm text-gray-400">No items found matching "${q}"</div>`;
      } else {
        searchResults.innerHTML = matches.map(p => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-nexus-900/80 hover:bg-white/5 border border-white/5 transition-colors cursor-pointer group" onclick="window.location.href='/product-details.html?id=${p.id}'">
            <div class="flex items-center gap-3">
              <img src="${p.image}" class="w-9 h-9 object-contain rounded-lg bg-nexus-800 p-1 border border-white/10" alt="${p.name}">
              <div>
                <h4 class="font-heading font-bold text-white text-sm leading-tight group-hover:text-cyan-accent transition-colors">${p.name}</h4>
                <p class="text-[11px] text-cyan-accent font-mono uppercase">${p.category} • $${Math.round(p.price)}</p>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-500 group-hover:text-cyan-accent"></i>
          </div>
        `).join('');
      }

      searchResults.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    });
  }
}

// Update cart counter in top navbar
function updateCartBadge() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const count = getCartCount();
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ===== TOP HERO 3D STUDIO WITH CURSOR GYROSCOPE PHYSICS =====
function initHero3DStudio() {
  const container = document.getElementById('mainImageContainer');
  const wrapper = document.getElementById('hero3DWrapper');
  const sheen = document.getElementById('heroLightSheen');
  if (!container || !wrapper) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotY = (x / (rect.width / 2)) * 18;
    const rotX = -(y / (rect.height / 2)) * 18;

    wrapper.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.06, 1.06, 1.06)`;

    if (sheen) {
      const sheenX = ((e.clientX - rect.left) / rect.width) * 150 - 50;
      sheen.style.transform = `translateX(${sheenX}%) rotate(45deg)`;
    }
  });

  container.addEventListener('mouseleave', () => {
    wrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (sheen) sheen.style.transform = `translateX(-100%) rotate(45deg)`;
  });
}

// Load Product by URL Parameter
async function loadProductData() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id') || params.get('slug') || 'aurora-pro-headset';

  let product = PRODUCTS[productId];

  // Attempt to fetch from API
  try {
    const res = await fetch(`/api/products/${productId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        const p = data.data;
        const catName = p.category && typeof p.category === 'object' ? p.category.name : (p.category || 'Gear');
        product = {
          id: p.slug || p._id,
          name: p.name,
          category: catName,
          price: Math.round(p.price || 0),
          comparePrice: Math.round(p.comparePrice || (p.price ? p.price * 1.25 : 0)),
          image: p.image || '/products/gaming_headset.jpg',
          rating: p.rating || 5,
          reviews: p.reviewCount || 128,
          description: p.description,
          badge: p.badge || '',
          stock: p.stock !== undefined ? p.stock : 25,
        };
        registerProduct(product);
      }
    }
  } catch (err) {
    console.warn('Using local product store:', err);
  }

  // Fallback to first product if not found
  if (!product) {
    product = Object.values(PRODUCTS)[0] || {
      id: 'aurora-pro-headset',
      name: 'Aurora Pro Wireless Headset',
      category: 'Audio',
      price: 150,
      comparePrice: 200,
      image: '/products/gaming_headset.jpg',
      rating: 5,
      reviews: 128,
      description: 'Immerse yourself in competitive 7.1 spatial surround audio with low-latency 2.4GHz wireless connection and memory foam ear cushions.',
      badge: 'Best Seller',
      stock: 35,
    };
  }

  currentProduct = product;
  currentImage = product.image;
  renderProductDetails(product);
  loadRelatedProducts(product.id, product.category);

  // Setup Scrollytelling Profile
  const catKey = product.category || 'Default';
  const profileConfig = CATEGORY_SHOWCASE_PROFILES[catKey] || CATEGORY_SHOWCASE_PROFILES['Default'];
  showcaseProfile = profileConfig.stages;

  // Set image in cinematic stage
  const stageImg = document.getElementById('showcaseStageImg');
  if (stageImg) {
    stageImg.src = product.image;
    stageImg.alt = product.name;
  }
}

function renderProductDetails(p) {
  document.title = `${p.name} — Tusher Gaming Specifications`;

  // Breadcrumbs
  document.getElementById('breadcrumbCategory').textContent = p.category;
  document.getElementById('breadcrumbTitle').textContent = p.name;

  // Badge
  const badgeTag = document.getElementById('productBadgeTag');
  if (p.badge) {
    badgeTag.textContent = p.badge;
    badgeTag.className = `${p.badge === 'New' ? 'badge-new' : p.badge === 'Best Seller' || p.badge === 'Popular' ? 'badge-hot' : 'badge-popular'} absolute top-6 left-6 z-10`;
    badgeTag.classList.remove('hidden');
  } else {
    badgeTag.classList.add('hidden');
  }

  // Images
  const mainImg = document.getElementById('productMainImg');
  mainImg.src = p.image;
  mainImg.alt = p.name;

  // Clicking main image opens Lightbox
  const mainImgContainer = document.getElementById('mainImageContainer');
  mainImgContainer.onclick = () => {
    openLightbox(currentImage || p.image, p.name, p.category, p.id);
  };

  // Details
  document.getElementById('productCategoryTag').textContent = `${p.category} Official Top-Up`;
  document.getElementById('productTitle').textContent = p.name;
  document.getElementById('productDescription').textContent = p.description || 'Instant direct in-game delivery. 100% legal, ban-proof, all taxes and processing fees included.';
  document.getElementById('tabOverviewText').textContent = p.description || 'Processed directly through official game publisher server APIs. 100% ban-proof with instant delivery directly to your Player ID / Character UID with zero password required.';
  document.getElementById('inboxProductName').textContent = `1x ${p.name} Credited Directly to In-Game UID`;

  // Price (60% All-Inclusive with Official Base Reference)
  const price = Math.round(p.price);
  const officialBase = Math.round(p.comparePrice || p.officialPrice || Math.round(price / 1.6));
  document.getElementById('productPrice').textContent = `$${price}`;
  const compareEl = document.getElementById('productComparePrice');
  if (compareEl) {
    compareEl.textContent = `Official Base: $${officialBase}`;
  }

  // Reviews
  const rating = p.rating || 5;
  document.getElementById('productStars').innerHTML = Array.from({ length: 5 }, (_, i) => 
    `<span class="${i < rating ? 'text-gold-accent' : 'text-nexus-600'}">★</span>`
  ).join('');
  document.getElementById('productReviewCount').textContent = `(${p.reviews || 120} verified customer reviews)`;

  // Stock / Queue Status
  const stockEl = document.getElementById('productStockBadge');
  stockEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Instant Automated Dispatch — 24/7 Server Active`;
  stockEl.className = 'flex items-center gap-1.5 text-xs font-bold text-emerald-400';

  if (window.lucide) lucide.createIcons();
}

// ===== APPLE / SAMSUNG CONTINUOUS PHYSICS-BASED SCROLLYTELLING ENGINE =====
function initPhysicsScrollytellingEngine() {
  const section = document.getElementById('cinematicShowcaseSection');
  const stage = document.getElementById('stickyShowcaseStage');
  const transformWrapper = document.getElementById('showcaseTransformWrapper');
  const progressBar = document.getElementById('showcaseProgressBar');
  const stageHeading = document.getElementById('showcaseStageHeading');
  const heroHeadline = document.getElementById('showcaseHeroHeadline');
  const auraGlow = document.getElementById('showcaseAuraGlow');
  const hudZoom = document.getElementById('hudZoomVal');
  const hudRot = document.getElementById('hudRotVal');
  const laserHud = document.getElementById('laserCrosshairsHud');

  const cardStepTag = document.getElementById('showcaseCardStepTag');
  const cardSub = document.getElementById('showcaseCardSub');
  const cardTitle = document.getElementById('showcaseCardTitle');
  const cardDesc = document.getElementById('showcaseCardDesc');

  const prevBtn = document.getElementById('showcasePrevBtn');
  const nextBtn = document.getElementById('showcaseNextBtn');
  const autoPlayBtn = document.getElementById('showcaseAutoPlayBtn');
  const autoPlayText = document.getElementById('showcaseAutoPlayText');

  if (!section || !transformWrapper) return;

  // Linear Interpolation helper
  const lerp = (start, end, factor) => start + (end - start) * factor;

  // Track raw scroll
  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const scrollRange = section.offsetHeight - window.innerHeight;
    if (scrollRange > 0) {
      targetScrollProgress = Math.max(0, Math.min(1, (-rect.top) / scrollRange));
    }
  }, { passive: true });

  // Mouse Parallax inside Sticky Stage
  if (stage) {
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      targetMouseX = ((e.clientX - r.left) / r.width - 0.5) * 20;
      targetMouseY = ((e.clientY - r.top) / r.height - 0.5) * 20;
    });
    stage.addEventListener('mouseleave', () => {
      targetMouseX = 0;
      targetMouseY = 0;
    });
  }

  // 60FPS / 120FPS RAF Physics Loop
  function physicsLoop() {
    // Smooth Lerp Spring Interpolation (0.075 damping for silky Apple inertia)
    smoothScrollProgress = lerp(smoothScrollProgress, targetScrollProgress, 0.08);
    mouseX = lerp(mouseX, targetMouseX, 0.06);
    mouseY = lerp(mouseY, targetMouseY, 0.06);

    const numStages = showcaseProfile.length || 4;
    const continuousIndex = smoothScrollProgress * (numStages - 1);
    const stageLow = Math.floor(continuousIndex);
    const stageHigh = Math.min(numStages - 1, stageLow + 1);
    const stageFraction = continuousIndex - stageLow;

    const currentStageData = showcaseProfile[stageLow] || showcaseProfile[0];
    const nextStageData = showcaseProfile[stageHigh] || currentStageData;

    if (currentStageData && nextStageData) {
      // Continuous Interpolated Transforms
      const interpScale = lerp(currentStageData.scale, nextStageData.scale, stageFraction);
      const interpFocusX = lerp(currentStageData.focusX, nextStageData.focusX, stageFraction);
      const interpFocusY = lerp(currentStageData.focusY, nextStageData.focusY, stageFraction);
      const interpRotX = lerp(currentStageData.rotX, nextStageData.rotX, stageFraction) + (-mouseY * 0.4);
      const interpRotY = lerp(currentStageData.rotY, nextStageData.rotY, stageFraction) + (mouseX * 0.4);
      const interpRotZ = (targetScrollProgress - smoothScrollProgress) * 45; // Inertial banking tilt

      // Apply 3D Transform to Product
      transformWrapper.style.transform = `
        translate3d(${interpFocusX}%, ${interpFocusY}%, 0px)
        scale3d(${interpScale}, ${interpScale}, 1)
        rotateX(${interpRotX.toFixed(2)}deg)
        rotateY(${interpRotY.toFixed(2)}deg)
        rotateZ(${interpRotZ.toFixed(2)}deg)
      `;

      // Update HUD Values
      if (hudZoom) hudZoom.textContent = `${interpScale.toFixed(2)}X`;
      if (hudRot) hudRot.textContent = `${interpRotY.toFixed(1)}°`;

      // Update Progress Bar
      if (progressBar) progressBar.style.width = `${(smoothScrollProgress * 100).toFixed(2)}%`;

      // Update Active Stage Index
      const activeStage = Math.round(continuousIndex);
      if (activeStage !== currentStageIndex) {
        currentStageIndex = activeStage;
        const activeData = showcaseProfile[activeStage];

        // Update Stage Navigation Pills
        document.querySelectorAll('.stage-pill-btn').forEach((btn, i) => {
          const match = i === activeStage;
          btn.classList.toggle('bg-cyan-accent', match);
          btn.classList.toggle('text-nexus-950', match);
          btn.classList.toggle('shadow-glow-cyan-sm', match);
          btn.classList.toggle('bg-nexus-800', !match);
          btn.classList.toggle('text-gray-400', !match);
        });

        // Update Headings & Floating Card
        if (stageHeading) stageHeading.textContent = activeData.heading;
        if (cardStepTag) cardStepTag.textContent = activeData.stage;
        if (cardSub) cardSub.textContent = activeData.sub;
        if (cardTitle) cardTitle.textContent = activeData.title;
        if (cardDesc) cardDesc.textContent = activeData.desc;

        // Update Background Giant Headline
        const catKey = currentProduct?.category || 'Default';
        const headlines = CATEGORY_SHOWCASE_PROFILES[catKey]?.heroHeadline || CATEGORY_SHOWCASE_PROFILES['Default'].heroHeadline;
        if (heroHeadline && headlines[activeStage]) {
          heroHeadline.textContent = headlines[activeStage];
          heroHeadline.style.opacity = '0.15';
        }

        // Update Hotspots
        ['hotspot1', 'hotspot2', 'hotspot3'].forEach(id => {
          const cfg = activeData[id];
          const el = document.getElementById(id);
          if (el && cfg) {
            el.classList.toggle('hidden', !cfg.show);
            if (cfg.show) {
              el.style.top = cfg.top;
              el.style.left = cfg.left;
              const descEl = document.getElementById(`${id}Desc`);
              if (descEl) descEl.textContent = cfg.desc;
            }
          }
        });

        // Dynamic Aura Color
        if (auraGlow) {
          auraGlow.className = `absolute w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] rounded-full blur-[130px] pointer-events-none transition-all duration-700 ${activeData.aura}`;
        }
      }

      // Laser Crosshairs follow target position
      if (laserHud && currentStageData.targetPos && nextStageData.targetPos) {
        const topNum = lerp(parseFloat(currentStageData.targetPos.top), parseFloat(nextStageData.targetPos.top), stageFraction);
        const leftNum = lerp(parseFloat(currentStageData.targetPos.left), parseFloat(nextStageData.targetPos.left), stageFraction);
        laserHud.style.top = `${topNum}%`;
        laserHud.style.left = `${leftNum}%`;
      }
    }

    requestAnimationFrame(physicsLoop);
  }

  requestAnimationFrame(physicsLoop);

  // Click stage pills to smooth scroll to exact runway offset
  document.querySelectorAll('.stage-pill-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.stage) || 0;
      const targetPercent = idx / ((showcaseProfile.length || 4) - 1);
      const targetY = section.offsetTop + targetPercent * (section.offsetHeight - window.innerHeight);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    };
  });

  // Prev / Next button step controls
  if (prevBtn) {
    prevBtn.onclick = () => {
      const newIdx = Math.max(0, currentStageIndex - 1);
      const targetPercent = newIdx / ((showcaseProfile.length || 4) - 1);
      const targetY = section.offsetTop + targetPercent * (section.offsetHeight - window.innerHeight);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      const newIdx = Math.min((showcaseProfile.length || 4) - 1, currentStageIndex + 1);
      const targetPercent = newIdx / ((showcaseProfile.length || 4) - 1);
      const targetY = section.offsetTop + targetPercent * (section.offsetHeight - window.innerHeight);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    };
  }

  // Auto Tour playback
  if (autoPlayBtn) {
    autoPlayBtn.onclick = () => {
      if (isAutoPlaying) {
        clearInterval(autoPlayInterval);
        isAutoPlaying = false;
        autoPlayText.textContent = 'Auto Tour';
        autoPlayBtn.classList.remove('bg-cyan-accent', 'text-nexus-900');
        autoPlayBtn.classList.add('bg-cyan-accent/10', 'text-cyan-accent');
      } else {
        isAutoPlaying = true;
        autoPlayText.textContent = 'Pause Tour';
        autoPlayBtn.classList.add('bg-cyan-accent', 'text-nexus-900');
        autoPlayBtn.classList.remove('bg-cyan-accent/10', 'text-cyan-accent');

        autoPlayInterval = setInterval(() => {
          const nextIdx = (currentStageIndex + 1) % (showcaseProfile.length || 4);
          const targetPercent = nextIdx / ((showcaseProfile.length || 4) - 1);
          const targetY = section.offsetTop + targetPercent * (section.offsetHeight - window.innerHeight);
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }, 3400);
      }
    };
  }
}

// Quantity Stepper
function initQuantityControls() {
  const minus = document.getElementById('qtyMinusBtn');
  const plus = document.getElementById('qtyPlusBtn');
  const display = document.getElementById('qtyDisplay');

  minus.onclick = () => {
    if (currentQty > 1) {
      currentQty--;
      display.textContent = currentQty;
    }
  };

  plus.onclick = () => {
    if (currentQty < 99) {
      currentQty++;
      display.textContent = currentQty;
    }
  };
}

// Purchase & Cart Buttons
function initPurchaseButtons() {
  const addBtn = document.getElementById('addToLoadoutBtn');
  const buyBtn = document.getElementById('buyNowBtn');

  addBtn.onclick = () => {
    if (!currentProduct) return;
    addToCart(currentProduct.id, currentQty, currentProduct);
    updateCartBadge();

    showToast(`Added ${currentQty}x ${currentProduct.name} to Loadout! 🎮`);

    const originalHTML = addBtn.innerHTML;
    addBtn.innerHTML = `<span>✓ Added to Loadout</span>`;
    addBtn.classList.add('!bg-success');
    setTimeout(() => {
      addBtn.innerHTML = originalHTML;
      addBtn.classList.remove('!bg-success');
      if (window.lucide) lucide.createIcons();
    }, 1600);
  };

  buyBtn.onclick = () => {
    if (!currentProduct) return;
    addToCart(currentProduct.id, currentQty, currentProduct);
    window.location.href = '/cart.html';
  };
}

// Tabs Switching
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panes = {
    overview: document.getElementById('tabOverview'),
    specs: document.getElementById('tabSpecs'),
    inbox: document.getElementById('tabInbox'),
    reviews: document.getElementById('tabReviews'),
  };

  tabBtns.forEach(btn => {
    btn.onclick = () => {
      const tab = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('bg-cyan-accent', 'text-nexus-900', 'shadow-glow-cyan-sm');
        b.classList.add('bg-nexus-800', 'text-text-secondary');
      });

      btn.classList.add('bg-cyan-accent', 'text-nexus-900', 'shadow-glow-cyan-sm');
      btn.classList.remove('bg-nexus-800', 'text-text-secondary');

      Object.keys(panes).forEach(k => {
        if (panes[k]) panes[k].classList.toggle('hidden', k !== tab);
      });

      if (window.lucide) lucide.createIcons();
    };
  });
}

// Review Submission
function initReviewForm() {
  const submitBtn = document.getElementById('submitReviewBtn');
  if (!submitBtn) return;

  submitBtn.onclick = () => {
    const tag = document.getElementById('reviewTag').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const rating = parseInt(document.getElementById('reviewRating').value) || 5;

    if (!tag || !text) {
      showToast('Please enter your gamer tag and review text');
      return;
    }

    const reviewsList = document.getElementById('reviewsList');
    const newReview = document.createElement('div');
    newReview.className = 'p-5 rounded-2xl bg-nexus-900/60 border border-cyan-accent/30 space-y-2 animate-fade-in';
    newReview.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-cyan-accent text-nexus-900 font-bold text-xs flex items-center justify-center">${tag.substring(0, 2).toUpperCase()}</div>
          <div>
            <span class="font-bold text-white text-xs">${tag}</span>
            <span class="text-[10px] text-emerald-400 ml-2 font-mono">✓ Verified Buyer</span>
          </div>
        </div>
        <span class="text-gold-accent text-xs">${'★'.repeat(rating)}</span>
      </div>
      <p class="text-xs text-gray-300 leading-relaxed">"${text}"</p>
    `;

    reviewsList.prepend(newReview);
    document.getElementById('reviewForm').classList.add('hidden');
    document.getElementById('reviewTag').value = '';
    document.getElementById('reviewText').value = '';
    showToast('Your verified review has been published! ⭐');
  };
}

// Load Related Products Grid
function loadRelatedProducts(currentId, currentCat) {
  const container = document.getElementById('relatedProductsGrid');
  if (!container) return;

  const related = Object.values(PRODUCTS)
    .filter(p => !p.isSubscription && p.id !== currentId)
    .slice(0, 4);

  container.innerHTML = related.map(p => `
    <div class="glass-card rounded-2xl overflow-hidden group hover:border-cyan-accent/30 transition-all flex flex-col justify-between">
      <div class="p-6 pb-2 cursor-pointer" onclick="window.location.href='/product-details.html?id=${p.id}'">
        <div class="aspect-square flex items-center justify-center overflow-hidden">
          <img src="${p.image}" alt="${p.name}" class="w-4/5 object-contain transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        </div>
      </div>
      <div class="p-6 pt-2 space-y-3">
        <p class="text-text-muted text-[10px] uppercase font-mono tracking-widest">${p.category}</p>
        <a href="/product-details.html?id=${p.id}" class="font-heading font-bold text-base text-white hover:text-cyan-accent transition-colors block truncate">
          ${p.name}
        </a>
        <div class="flex items-center justify-between pt-2 border-t border-white/5">
          <span class="font-mono font-bold text-lg text-cyan-accent">$${Math.round(p.price)}</span>
          <button class="btn-primary !px-3 !py-1.5 !text-xs font-semibold" data-product-id="${p.id}">
            Add to Loadout
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Bind Add to Cart buttons on related items
  container.querySelectorAll('[data-product-id]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.dataset.productId;
      addToCart(id);
      updateCartBadge();
      showToast('Item added to loadout! 🎮');
      btn.innerHTML = '✓ Added';
      btn.classList.add('!bg-success');
      setTimeout(() => {
        btn.innerHTML = 'Add to Loadout';
        btn.classList.remove('!bg-success');
      }, 1200);
    };
  });
}

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
