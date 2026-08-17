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
    badge: '100% Ban-Proof',
    src: '/characters/pubg-character.svg',
    glow: '#d47f97'
  },
  {
    name: 'eFootball • Leo Messi #10',
    tag: 'eFootball • Leo Messi #10',
    badge: 'Instant Coin Top-Up',
    src: '/characters/efootball-messi.svg',
    glow: '#00f0ff'
  },
  {
    name: 'eFootball • Cristiano Ronaldo #7',
    tag: 'eFootball • CR7 Power Strike',
    badge: 'Instant Coin Top-Up',
    src: '/characters/efootball-ronaldo.svg',
    glow: '#e06d92'
  },
  {
    name: 'Call of Duty Mobile • Ghost Operator',
    tag: 'COD Mobile • Ghost Operator',
    badge: 'CP Vault Direct Credit',
    src: '/characters/cod-ghost.svg',
    glow: '#d47f97'
  },
  {
    name: 'Valorant • Jett Wind Agent',
    tag: 'Valorant • Jett Duelist',
    badge: 'VP Riot Code Delivery',
    src: '/characters/valorant-jett.svg',
    glow: '#2dd4bf'
  },
  {
    name: 'Free Fire • Cyber Katana Hero',
    tag: 'Free Fire • Cyber Katana',
    badge: 'Diamond Top-Up 24/7',
    src: '/characters/freefire-hero.svg',
    glow: '#f59e0b'
  }
];

let currentHeroCharIdx = 0;
let heroCharAutoTimer = null;

function initHeroCharacters() {
  const mainImg = document.getElementById('heroMainCharacterImg');
  const tagEl = document.getElementById('heroCharTag');
  const pills = document.querySelectorAll('.hero-char-btn');
  if (!mainImg) return;

  window.switchHeroCharacter = function(index) {
    if (index < 0 || index >= HERO_CHARACTERS.length) return;
    currentHeroCharIdx = index;
    const char = HERO_CHARACTERS[index];

    mainImg.style.opacity = '0';
    mainImg.style.transform = 'scale(0.92) translateY(10px)';

    setTimeout(() => {
      mainImg.src = char.src;
      mainImg.alt = char.name;
      if (tagEl) tagEl.textContent = char.tag;
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1) translateY(0)';
    }, 200);

    pills.forEach((btn, idx) => {
      if (idx === index) {
        btn.className = 'hero-char-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all bg-cyan-accent text-nexus-950 shadow-glow-cyan-sm flex items-center gap-1.5 whitespace-nowrap scale-105';
      } else {
        btn.className = 'hero-char-btn px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all bg-nexus-800 text-gray-400 hover:text-white hover:bg-nexus-700 flex items-center gap-1.5 whitespace-nowrap';
      }
    });
  };

  pills.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      window.switchHeroCharacter(idx);
      // Reset timer on user interaction
      clearInterval(heroCharAutoTimer);
      startAutoHeroRotation();
    });
  });

  function startAutoHeroRotation() {
    heroCharAutoTimer = setInterval(() => {
      currentHeroCharIdx = (currentHeroCharIdx + 1) % HERO_CHARACTERS.length;
      window.switchHeroCharacter(currentHeroCharIdx);
    }, 6000);
  }

  startAutoHeroRotation();
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
    const logoImg = cat.image || `/categories/${cat.slug}.svg`;
    return `
      <a href="#products" data-filter-game="${cat.name}" class="glass-card rounded-2xl p-4 flex flex-col items-center text-center gap-3 group cursor-pointer hover:border-cyan-accent/50 hover:shadow-glow-cyan-sm transition-all animate-fade-in">
        <div class="w-16 h-16 rounded-2xl bg-nexus-900/90 p-2 border border-white/10 flex items-center justify-center group-hover:border-cyan-accent/50 group-hover:scale-105 transition-all shadow-lg overflow-hidden">
          <img src="${logoImg}" alt="${cat.name}" class="w-full h-full object-contain filter drop-shadow-md group-hover:brightness-110 transition-all" onerror="this.onerror=null; this.src='/categories/pubg-mobile.svg'">
        </div>
        <div>
          <span class="font-heading font-bold text-sm text-white group-hover:text-cyan-accent transition-colors block truncate max-w-[130px]">${cat.name}</span>
          <span class="text-[10px] text-gray-400 font-mono block truncate max-w-[130px]">${cat.description ? cat.description.split(',')[0] : 'Top-Up & Pass'}</span>
        </div>
      </a>
    `;
  }).join('');

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
            <div class="relative p-6 pb-0 overflow-hidden cursor-zoom-in group/img" data-open-lightbox="${imgUrl}" data-lightbox-title="${p.name}" data-lightbox-category="${catName}" data-lightbox-id="${prodId}" title="Click to view big high-res image">
              ${badgeHtml}
              <div class="absolute top-4 right-4 z-10 px-2 py-1 rounded-md bg-nexus-900/80 border border-white/10 text-[10px] text-cyan-accent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1 shadow-lg">
                <i data-lucide="maximize-2" class="w-3 h-3"></i> Big View
              </div>
              <div class="aspect-square flex items-center justify-center overflow-hidden">
                <img src="${imgUrl}" alt="${p.name}" class="w-4/5 object-contain transition-transform duration-500 group-hover/img:scale-110" loading="lazy">
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

// ===== SEARCH MODAL & LIVE AUTOCOMPLETE =====
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
    setTimeout(() => searchInput.focus(), 100);
  }

  function closeSearch() {
    searchModal.classList.add('hidden');
    document.body.style.overflow = '';
    searchInput.value = '';
    if (searchResults) searchResults.classList.add('hidden');
  }

  searchBtn.addEventListener('click', openSearch);
  searchOverlay.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchModal.classList.contains('hidden') ? openSearch() : closeSearch();
    }
    if (e.key === 'Escape') closeSearch();
  });

  // Live real-time search filtering
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
        searchResults.innerHTML = `<div class="p-4 text-center text-sm text-gray-400">No gaming gear found matching "${q}"</div>`;
      } else {
        searchResults.innerHTML = matches.map(p => `
          <div class="flex items-center justify-between p-3 rounded-xl bg-nexus-900/80 hover:bg-white/5 border border-white/5 transition-colors">
            <div class="flex items-center gap-3 cursor-pointer" onclick="window.location.href='/product-details.html?id=${p.id}'">
              <img src="${p.image}" class="w-10 h-10 object-contain rounded-lg bg-nexus-800 p-1 border border-white/10" alt="${p.name}">
              <div>
                <h4 class="font-heading font-bold text-white text-sm leading-tight hover:text-cyan-accent transition-colors">${p.name}</h4>
                <p class="text-[11px] text-cyan-accent font-mono uppercase">${p.category} • $${Math.round(p.price)}</p>
              </div>
            </div>
            <button class="btn-primary !px-3 !py-1.5 !text-xs font-semibold" data-product-id="${p.id}">
              Add to Loadout
            </button>
          </div>
        `).join('');
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
