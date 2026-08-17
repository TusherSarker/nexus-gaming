// ===== Shared Cart Store (localStorage + API sync) =====

const CART_KEY = 'nexus_cart';

// Base product catalog with whole integer pricing (60% all-inclusive pricing covering dual-currency processing, VAT, server maintenance & fair staff wages)
export const PRODUCTS = {
  'pubg-mobile-660-uc': {
    id: 'pubg-mobile-660-uc',
    name: 'PUBG Mobile 660 UC + 60 Bonus',
    category: 'PUBG Mobile',
    officialPrice: 10,
    price: 16,
    comparePrice: 10,
    image: '/categories/pubg-mobile.svg',
    rating: 5,
    reviews: 340,
    badge: 'Best Seller',
  },
  'pubg-mobile-royale-pass': {
    id: 'pubg-mobile-royale-pass',
    name: 'PUBG Mobile Royale Pass Elite Upgrade',
    category: 'PUBG Mobile',
    officialPrice: 25,
    price: 40,
    comparePrice: 25,
    image: '/categories/pubg-mobile.svg',
    rating: 5,
    reviews: 189,
    badge: 'Popular',
  },
  'cod-mobile-8000-cp': {
    id: 'cod-mobile-8000-cp',
    name: 'COD Mobile 8,000 CP Points Vault',
    category: 'Call of Duty: Mobile',
    officialPrice: 50,
    price: 80,
    comparePrice: 50,
    image: '/categories/cod-mobile.svg',
    rating: 5,
    reviews: 275,
    badge: 'New',
  },
  'cod-mobile-battle-pass': {
    id: 'cod-mobile-battle-pass',
    name: 'COD Mobile Premium Battle Pass',
    category: 'Call of Duty: Mobile',
    officialPrice: 10,
    price: 16,
    comparePrice: 10,
    image: '/categories/cod-mobile.svg',
    rating: 5,
    reviews: 156,
    badge: 'Best Seller',
  },
  'efootball-12000-coins': {
    id: 'efootball-12000-coins',
    name: 'eFootball 12,800 Coins Match Pass Pack',
    category: 'eFootball',
    officialPrice: 40,
    price: 64,
    comparePrice: 40,
    image: '/categories/efootball.svg',
    rating: 5,
    reviews: 92,
    badge: 'Popular',
  },
  'free-fire-2180-diamonds': {
    id: 'free-fire-2180-diamonds',
    name: 'Free Fire 2,180 Diamonds + 218 Bonus',
    category: 'Free Fire',
    officialPrice: 20,
    price: 32,
    comparePrice: 20,
    image: '/categories/free-fire.svg',
    rating: 5,
    reviews: 412,
    badge: 'Best Seller',
  },
  'mobile-legends-2000-diamonds': {
    id: 'mobile-legends-2000-diamonds',
    name: 'Mobile Legends 2,000 Diamonds + Starlight',
    category: 'Mobile Legends: Bang Bang',
    officialPrice: 35,
    price: 56,
    comparePrice: 35,
    image: '/categories/mobile-legends.svg',
    rating: 5,
    reviews: 288,
    badge: 'Popular',
  },
  'valorant-5350-vp': {
    id: 'valorant-5350-vp',
    name: 'Valorant 5,350 VP Points Bundle',
    category: 'Valorant',
    officialPrice: 50,
    price: 80,
    comparePrice: 50,
    image: '/categories/valorant.svg',
    rating: 5,
    reviews: 310,
    badge: 'Best Seller',
  },
  'fortnite-5000-vbucks': {
    id: 'fortnite-5000-vbucks',
    name: 'Fortnite 5,000 V-Bucks Official Card',
    category: 'Fortnite',
    officialPrice: 35,
    price: 56,
    comparePrice: 35,
    image: '/categories/fortnite.svg',
    rating: 5,
    reviews: 195,
    badge: 'New',
  },
  'genshin-impact-6480-crystals': {
    id: 'genshin-6480-crystals',
    name: 'Genshin Impact 6,480 + 1,600 Genesis Crystals',
    category: 'Genshin Impact',
    officialPrice: 100,
    price: 160,
    comparePrice: 100,
    image: '/categories/genshin-impact.svg',
    rating: 5,
    reviews: 220,
    badge: 'Limited',
  },
  'genshin-6480-crystals': {
    id: 'genshin-6480-crystals',
    name: 'Genshin Impact 6,480 + 1,600 Genesis Crystals',
    category: 'Genshin Impact',
    officialPrice: 100,
    price: 160,
    comparePrice: 100,
    image: '/categories/genshin-impact.svg',
    rating: 5,
    reviews: 220,
    badge: 'Limited',
  },
  'roblox-10000-robux': {
    id: 'roblox-10000-robux',
    name: 'Roblox 10,000 Robux Digital Code',
    category: 'Roblox',
    officialPrice: 100,
    price: 160,
    comparePrice: 100,
    image: '/categories/roblox.svg',
    rating: 5,
    reviews: 460,
    badge: 'Best Seller',
  },
  'ea-fc-12000-points': {
    id: 'ea-fc-12000-points',
    name: 'EA Sports FC Mobile 12,000 FC Points',
    category: 'EA Sports FC Mobile',
    officialPrice: 50,
    price: 80,
    comparePrice: 50,
    image: '/categories/ea-fc-mobile.svg',
    rating: 5,
    reviews: 135,
    badge: 'Popular',
  },
  // Subscriptions with integer monthly and annual pricing
  'sub-starter-monthly': {
    id: 'sub-starter-monthly',
    name: 'Nexus Pass: Starter (Monthly)',
    category: 'Subscription',
    price: 10,
    image: '/products/gaming_controller.jpg',
    rating: 5,
    reviews: 512,
    isSubscription: true,
  },
  'sub-starter-annual': {
    id: 'sub-starter-annual',
    name: 'Nexus Pass: Starter (Annual Billed Monthly)',
    category: 'Subscription',
    price: 8,
    image: '/products/gaming_controller.jpg',
    rating: 5,
    reviews: 512,
    isSubscription: true,
  },
  'sub-pro-monthly': {
    id: 'sub-pro-monthly',
    name: 'Nexus Pass: Pro Tier (Monthly)',
    category: 'Subscription',
    price: 20,
    image: '/products/gaming_headset.jpg',
    rating: 5,
    reviews: 1840,
    isSubscription: true,
  },
  'sub-pro-annual': {
    id: 'sub-pro-annual',
    name: 'Nexus Pass: Pro Tier (Annual Billed Monthly)',
    category: 'Subscription',
    price: 16,
    image: '/products/gaming_headset.jpg',
    rating: 5,
    reviews: 1840,
    isSubscription: true,
  },
  'sub-elite-monthly': {
    id: 'sub-elite-monthly',
    name: 'Nexus Pass: Elite VIP (Monthly)',
    category: 'Subscription',
    price: 30,
    image: '/products/gaming_keyboard.jpg',
    rating: 5,
    reviews: 940,
    isSubscription: true,
  },
  'sub-elite-annual': {
    id: 'sub-elite-annual',
    name: 'Nexus Pass: Elite VIP (Annual Billed Monthly)',
    category: 'Subscription',
    price: 24,
    image: '/products/gaming_keyboard.jpg',
    rating: 5,
    reviews: 940,
    isSubscription: true,
  },
};

// Register custom product dynamically
export function registerProduct(item) {
  if (item && item.id) {
    PRODUCTS[item.id] = { ...PRODUCTS[item.id], ...item };
  }
}

// Get cart from localStorage
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

// Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }));
}

// Add item to cart
export function addToCart(productId, qty = 1, customData = null) {
  if (customData) {
    registerProduct({ id: productId, ...customData });
  }

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  return cart;
}

// Remove item from cart
export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
}

// Update quantity
export function updateQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, Math.min(99, qty));
  }
  saveCart(cart);
  return cart;
}

// Clear cart
export function clearCart() {
  saveCart([]);
  return [];
}

// Get total item count
export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// Get cart total price (Clean integer calculation)
export function getCartTotal() {
  const total = getCart().reduce((sum, item) => {
    const product = PRODUCTS[item.id];
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  return Math.round(total);
}

// Promo code logic
const PROMO_CODES = {
  'NEXUS10': { discountPercent: 10, label: '10% OFF' },
  'GAMER20': { discountPercent: 20, label: '20% OFF' },
  'FREESHIP': { discountPercent: 0, freeShipping: true, label: 'Free Shipping' },
};

export function applyPromo(code) {
  const promo = PROMO_CODES[code.toUpperCase().trim()];
  if (promo) {
    return { valid: true, ...promo };
  }
  return { valid: false };
}
