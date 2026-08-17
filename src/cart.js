import './style.css';
import {
  getCart, saveCart, removeFromCart, updateQty, clearCart,
  getCartCount, getCartTotal, applyPromo, PRODUCTS
} from './cart-store.js';
import { initAuthModal, updateNavbarUserUI } from './auth-modal.js';

// State
let activePromo = null;
const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 10; // Whole integer shipping

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  initAuthModal();
  updateNavbarUserUI();
  renderCart();
  initPromoCode();
  initClearCart();
  initCheckout();
});

// ===== RENDER CART =====
function renderCart() {
  const cart = getCart();
  const emptyState = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartHeaderCount = document.getElementById('cart-header-count');

  const count = getCartCount();

  // Update badge
  if (cartCount) {
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
  }

  // Toggle empty vs filled state
  if (cart.length === 0) {
    emptyState.classList.remove('hidden');
    cartContent.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  cartContent.classList.remove('hidden');
  if (cartHeaderCount) cartHeaderCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;

  // Render items
  cartItems.innerHTML = cart.map(item => {
    const product = PRODUCTS[item.id] || {
      name: 'Custom Product',
      category: 'Gaming',
      price: 99,
      image: '/products/gaming_headset.jpg',
      rating: 5,
      reviews: 10,
    };

    const itemUnitPrice = Math.round(product.price);
    const itemTotal = Math.round(product.price * item.qty);
    const isSub = product.isSubscription;

    return `
      <div class="cart-item-card glass-card p-5 rounded-2xl transition-all duration-300 hover:border-cyan-accent/20" data-item-id="${item.id}">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

          <!-- Product Info (col 1-6) -->
          <div class="md:col-span-5 flex items-center gap-4">
            <div class="w-20 h-20 rounded-xl bg-nexus-800 p-2 flex-shrink-0 flex items-center justify-center border border-white/5 overflow-hidden">
              <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover rounded-lg" loading="lazy" />
            </div>
            <div class="min-w-0">
              <span class="text-xs font-mono font-semibold ${isSub ? 'text-gold-accent' : 'text-cyan-accent'} uppercase tracking-wider">${product.category}</span>
              <h3 class="font-heading font-bold text-base text-text-primary truncate">${product.name}</h3>
              <div class="flex items-center gap-2 mt-1">
                <div class="flex text-gold-accent text-xs">
                  ${Array.from({ length: 5 }, (_, i) => `<span class="${i < (product.rating || 5) ? 'text-gold-accent' : 'text-nexus-600'}">★</span>`).join('')}
                </div>
                <span class="text-[11px] text-text-muted">(${product.reviews || 0})</span>
              </div>
              <span class="md:hidden font-mono font-bold text-cyan-accent text-sm mt-1 block">$${itemUnitPrice} each</span>
            </div>
          </div>

          <!-- Quantity Controls -->
          <div class="md:col-span-3 flex items-center justify-start md:justify-center">
            ${isSub ? `
              <span class="px-3 py-1 rounded-full bg-gold-accent/10 border border-gold-accent/30 text-gold-accent text-xs font-mono font-bold">1 Active Pass</span>
            ` : `
              <div class="flex items-center bg-nexus-800 border border-white/10 rounded-xl overflow-hidden">
                <button class="qty-btn p-2.5 text-text-secondary hover:text-cyan-accent hover:bg-nexus-700 transition-all duration-200" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">
                  <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                </button>
                <span class="font-mono font-bold text-sm px-4 py-1 text-text-primary min-w-[2.5rem] text-center">${item.qty}</span>
                <button class="qty-btn p-2.5 text-text-secondary hover:text-cyan-accent hover:bg-nexus-700 transition-all duration-200" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            `}
          </div>

          <!-- Unit Price (desktop) -->
          <div class="hidden md:flex md:col-span-2 justify-end">
            <span class="font-mono text-sm text-text-secondary">$${itemUnitPrice}</span>
          </div>

          <!-- Item Total + Remove -->
          <div class="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
            <span class="font-mono font-bold text-lg text-cyan-accent">$${itemTotal}</span>
            <button class="remove-btn p-2 rounded-lg text-text-muted hover:text-magenta-accent hover:bg-magenta-accent/10 transition-all duration-200" data-id="${item.id}" aria-label="Remove ${product.name}">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

        </div>
      </div>
    `;
  }).join('');

  // Re-render Lucide icons in dynamic content
  if (window.lucide) lucide.createIcons();

  // Bind quantity buttons
  cartItems.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = getCart().find(i => i.id === id);
      if (!item) return;

      const newQty = action === 'increase' ? item.qty + 1 : item.qty - 1;
      if (newQty < 1) {
        removeFromCart(id);
        animateRemove(id);
      } else {
        updateQty(id, newQty);
        renderCart();
      }
      updateTotals();
    });
  });

  // Bind remove buttons
  cartItems.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      animateRemove(id);
    });
  });

  updateTotals();
}

// ===== ANIMATE REMOVE =====
function animateRemove(productId) {
  const el = document.querySelector(`[data-item-id="${productId}"]`);
  if (el) {
    el.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
    el.style.opacity = '0';
    el.style.transform = 'translateX(40px) scale(0.95)';
    el.style.maxHeight = el.offsetHeight + 'px';

    setTimeout(() => {
      el.style.maxHeight = '0';
      el.style.padding = '0';
      el.style.margin = '0';
      el.style.overflow = 'hidden';
    }, 300);

    setTimeout(() => {
      removeFromCart(productId);
      renderCart();
      showToast('Item removed from loadout');
    }, 500);
  } else {
    removeFromCart(productId);
    renderCart();
  }
}

// ===== UPDATE TOTALS (WHOLE INTEGERS ONLY) =====
function updateTotals() {
  const subtotal = Math.round(getCartTotal());
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const discountRow = document.getElementById('discount-row');
  const discountLabel = document.getElementById('discount-label');
  const discountAmount = document.getElementById('discount-amount');
  const totalEl = document.getElementById('total-price');

  subtotalEl.textContent = `$${subtotal}`;

  let discount = 0;
  let shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;

  if (activePromo) {
    if (activePromo.discountPercent) {
      discount = Math.round(subtotal * (activePromo.discountPercent / 100));
      discountRow.classList.remove('hidden');
      discountLabel.textContent = `(${activePromo.label})`;
      discountAmount.textContent = `-$${discount}`;
    }
    if (activePromo.freeShipping) {
      shipping = 0;
    }
  } else {
    discountRow.classList.add('hidden');
  }

  shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping}`;
  shippingEl.classList.toggle('text-success', shipping === 0);
  shippingEl.classList.toggle('text-text-primary', shipping > 0);

  const total = Math.max(0, subtotal - discount + shipping);
  totalEl.textContent = `$${total}`;
  return { subtotal, discount, shipping, total };
}

// ===== PROMO CODE =====
function initPromoCode() {
  const input = document.getElementById('promo-input');
  const applyBtn = document.getElementById('apply-promo-btn');
  const message = document.getElementById('promo-message');

  applyBtn.addEventListener('click', () => {
    const code = input.value.trim();
    if (!code) return;

    const result = applyPromo(code);
    message.classList.remove('hidden');

    if (result.valid) {
      activePromo = result;
      message.textContent = `✓ Code "${code.toUpperCase()}" applied — ${result.label}`;
      message.className = 'text-xs mt-2 text-success font-medium';
      input.disabled = true;
      input.classList.add('opacity-50');
      applyBtn.textContent = 'Applied';
      applyBtn.disabled = true;
      applyBtn.classList.add('opacity-50');
      updateTotals();
    } else {
      message.textContent = '✗ Invalid code. Try NEXUS10 (10% off), GAMER20 (20% off), or FREESHIP';
      message.className = 'text-xs mt-2 text-magenta-accent';
      input.classList.add('!border-magenta-accent/40');
      setTimeout(() => input.classList.remove('!border-magenta-accent/40'), 2000);
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyBtn.click();
    }
  });
}

// ===== CLEAR CART =====
function initClearCart() {
  const clearBtn = document.getElementById('clear-cart-btn');
  if (!clearBtn) return;

  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your entire loadout?')) {
      clearCart();
      activePromo = null;
      renderCart();
      showToast('Loadout cleared');
    }
  });
}

// ===== CHECKOUT =====
function initCheckout() {
  const checkoutBtn = document.getElementById('checkout-btn');
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener('click', async () => {
    const cart = getCart();
    if (cart.length === 0) return;

    const totals = updateTotals();
    const storedUser = localStorage.getItem('nexus_customer_user');
    let customerInfo = { name: 'Guest Gamer', email: 'guest@nexusgaming.com' };
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        customerInfo = { name: u.name || 'Nexus Gamer', email: u.email || 'gamer@nexusgaming.com' };
      } catch (e) {}
    }

    const orderPayload = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      items: cart.map(item => {
        const p = PRODUCTS[item.id] || {};
        return {
          name: p.name || item.id,
          price: Math.round(p.price || 50),
          image: p.image || '/products/gaming_headset.jpg',
          qty: item.qty,
        };
      }),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      promoCode: activePromo ? activePromo.label : '',
      status: 'pending',
      shippingAddress: {
        name: customerInfo.name,
        street: '777 Cyber Way',
        city: 'Neo Tokyo',
        state: 'CA',
        zip: '90001',
        country: 'USA',
      },
    };

    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = `
      <div class="flex items-center justify-center gap-2">
        <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
        <span>Processing Loadout Order...</span>
      </div>
    `;

    try {
      const token = localStorage.getItem('nexus_customer_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });

      let orderNumber = 'NXS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      if (res.ok) {
        const data = await res.json();
        if (data.data?.orderNumber) orderNumber = data.data.orderNumber;
      }

      clearCart();

      const mainEl = document.querySelector('main');
      mainEl.innerHTML = `
        <div class="max-w-xl mx-auto px-4 py-20 text-center animate-fade-in space-y-6">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-accent to-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-accent/20">
            <svg class="w-10 h-10 text-nexus-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div>
            <span class="text-xs font-mono font-bold text-cyan-accent uppercase tracking-widest">Order Confirmed</span>
            <h1 class="text-3xl font-heading font-bold text-white mt-1">Loadout Dispatched!</h1>
            <p class="text-text-secondary text-sm mt-2">Thank you, <span class="text-white font-semibold">${customerInfo.name}</span>! Your battle gear is being prepped for dispatch.</p>
          </div>
          <div class="p-6 rounded-2xl bg-nexus-800/80 border border-white/10 text-left space-y-3">
            <div class="flex justify-between text-xs text-gray-400">
              <span>Order Number:</span>
              <span class="font-mono font-bold text-cyan-accent">${orderNumber}</span>
            </div>
            <div class="flex justify-between text-xs text-gray-400">
              <span>Total Paid:</span>
              <span class="font-mono font-bold text-white">$${totals.total}</span>
            </div>
            <div class="flex justify-between text-xs text-gray-400">
              <span>Status:</span>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase text-[10px]">Processing</span>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a href="/" class="btn-primary inline-flex items-center justify-center gap-2 text-sm">
              Continue Shopping
            </a>
            <a href="/user-dashboard.html#orders" class="btn-secondary inline-flex items-center justify-center gap-2 text-sm">
              View in My Dashboard
            </a>
          </div>
        </div>
      `;

      if (window.lucide) lucide.createIcons();
    } catch (err) {
      console.error('Order error:', err);
      alert('Order placed in demo offline mode!');
      clearCart();
      window.location.href = '/';
    }
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
