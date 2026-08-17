document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath.endsWith('index.html') || currentPath === '/admin/') return;

  const user = typeof getUser === 'function' ? getUser() : null;
  const isSuper = user && (user.role === 'super_admin' || (user.permissions && user.permissions.includes('all')));
  const perms = user ? (user.permissions || []) : [];

  const canOrders = isSuper || perms.includes('orders');
  const canProducts = isSuper || perms.includes('products');
  const canCategories = isSuper || perms.includes('categories') || perms.includes('products');
  const canUsers = isSuper || perms.includes('users');
  const canSubscriptions = isSuper || perms.includes('subscriptions');

  // Permission page guard: redirect if navigating to an unauthorized page
  if (currentPath.endsWith('orders.html') && !canOrders) {
    alert('Access Denied: You do not have permission to view or manage Orders.');
    window.location.href = '/admin/dashboard.html';
    return;
  }
  if (currentPath.endsWith('products.html') && !canProducts) {
    alert('Access Denied: You do not have permission to manage Products.');
    window.location.href = '/admin/dashboard.html';
    return;
  }
  if (currentPath.endsWith('categories.html') && !canCategories) {
    alert('Access Denied: You do not have permission to manage Categories.');
    window.location.href = '/admin/dashboard.html';
    return;
  }
  if (currentPath.endsWith('users.html') && !canUsers) {
    alert('Access Denied: You do not have permission to manage Users & Admins.');
    window.location.href = '/admin/dashboard.html';
    return;
  }
  if (currentPath.endsWith('subscriptions.html') && !canSubscriptions) {
    alert('Access Denied: You do not have permission to manage Subscriptions.');
    window.location.href = '/admin/dashboard.html';
    return;
  }

  // Format display role
  let roleBadge = 'Admin';
  if (user?.role === 'super_admin') roleBadge = 'Super Admin';
  else if (perms.includes('orders') && perms.length === 1) roleBadge = 'Orders Manager';
  else if (perms.includes('products') && !perms.includes('orders')) roleBadge = 'Products Manager';
  else if (perms.includes('users') && !perms.includes('products')) roleBadge = 'Users Manager';

  const avatarSrc = user?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80';

  const sidebarHtml = `
    <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-nexus-800/95 backdrop-blur-xl border-r border-white/10 transform -translate-x-full md:translate-x-0 transition-transform duration-300 flex flex-col" id="sidebar">
      <div class="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <a href="/admin/dashboard.html" class="flex items-center gap-2 text-cyan-accent font-heading font-bold text-xl uppercase tracking-wider">
          <i data-lucide="gamepad-2"></i>
          Nexus Admin
        </a>
        <button id="closeSidebar" class="md:hidden text-gray-400 hover:text-white">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Admin Scope Badge -->
      <div class="px-4 pt-3 pb-1">
        <div class="px-3 py-1.5 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-between">
          <span class="text-xs font-semibold text-cyan-accent uppercase tracking-wider">${roleBadge}</span>
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        ${getNavItem('/admin/dashboard.html', 'layout-dashboard', 'Dashboard')}
        ${canProducts ? getNavItem('/admin/products.html', 'box', 'Products') : ''}
        ${canCategories ? getNavItem('/admin/categories.html', 'tags', 'Categories') : ''}
        ${canOrders ? getNavItem('/admin/orders.html', 'shopping-cart', 'Orders') : ''}
        ${canUsers ? getNavItem('/admin/users.html', 'users', 'Users & Admins') : ''}
        ${canSubscriptions ? getNavItem('/admin/subscriptions.html', 'credit-card', 'Subscriptions') : ''}
      </nav>

      <div class="p-4 border-t border-white/10 bg-nexus-900/60">
        <div class="flex items-center gap-3 mb-3">
          <img src="${avatarSrc}" alt="Avatar" class="w-9 h-9 rounded-full object-cover border border-cyan-accent/40" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white truncate" id="sidebarUserName">${user?.name || 'Admin'}</p>
            <p class="text-xs text-gray-400 truncate font-mono">@${user?.username || 'admin'}</p>
          </div>
        </div>
        <button onclick="logout()" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-nexus-700 hover:bg-danger hover:text-white text-gray-200 rounded-lg transition-colors text-sm font-medium">
          <i data-lucide="log-out" class="w-4 h-4"></i>
          Sign Out
        </button>
      </div>
    </aside>

    <header class="md:hidden fixed top-0 inset-x-0 z-40 h-16 bg-nexus-800/90 backdrop-blur-xl border-b border-white/10 flex items-center px-4 justify-between">
      <button id="openSidebar" class="text-gray-400 hover:text-white p-2">
        <i data-lucide="menu" class="w-6 h-6"></i>
      </button>
      <span class="font-heading font-bold text-lg text-cyan-accent tracking-wider">NEXUS ADMIN</span>
      <div class="w-10"></div>
    </header>
    
    <div id="sidebarOverlay" class="fixed inset-0 bg-black/60 z-40 hidden md:hidden"></div>
  `;

  document.body.insertAdjacentHTML('afterbegin', sidebarHtml);

  if (window.lucide) {
    lucide.createIcons();
  }

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const openBtn = document.getElementById('openSidebar');
  const closeBtn = document.getElementById('closeSidebar');

  function toggleSidebar() {
    const isOpen = !sidebar.classList.contains('-translate-x-full');
    if (isOpen) {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    } else {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.remove('hidden');
    }
  }

  if (openBtn) openBtn.addEventListener('click', toggleSidebar);
  if (closeBtn) closeBtn.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', toggleSidebar);

  const main = document.querySelector('main');
  if (main) {
    main.classList.add('md:ml-64', 'pt-16', 'md:pt-0', 'min-h-screen');
  }
});

function getNavItem(href, icon, text) {
  const isActive = window.location.pathname.endsWith(href.split('/').pop());
  const activeClasses = isActive 
    ? 'bg-cyan-accent/15 text-cyan-accent border-r-2 border-cyan-accent font-semibold' 
    : 'text-gray-400 hover:bg-white/5 hover:text-white';
  
  return `
    <a href="${href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeClasses}">
      <i data-lucide="${icon}" class="w-5 h-5"></i>
      <span class="font-medium">${text}</span>
    </a>
  `;
}

function showToast(message, type = 'success') {
  const colors = {
    success: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
    error: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
    info: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
  };

  const icons = {
    success: 'check-circle',
    error: 'alert-circle',
    info: 'info'
  };

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-4 right-4 z-[100] flex flex-col gap-2';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-xl transform translate-y-10 opacity-0 transition-all duration-300 ${colors[type] || colors.info}`;
  
  toast.innerHTML = `
    <i data-lucide="${icons[type] || 'info'}" class="w-5 h-5"></i>
    <p class="font-medium text-sm">${message}</p>
  `;

  container.appendChild(toast);
  if (window.lucide) {
    lucide.createIcons({ root: toast });
  }

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
