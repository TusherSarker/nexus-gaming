// ===== Nexus Gaming Customer Auth Modal & Session Manager =====
import { initUniversalMobileNav, updateMobileUserUI } from './mobile-nav.js';

export function initAuthModal() {
  initUniversalMobileNav();
  if (document.getElementById('nexusAuthModal')) return;

  const modalHtml = `
    <div id="nexusAuthModal" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md hidden p-4">
      <div class="bg-nexus-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-fade-in text-white">
        <!-- Close Button -->
        <button id="closeAuthModalBtn" class="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors z-10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <!-- Modal Header / Tabs -->
        <div class="p-6 pb-2 border-b border-white/5">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl font-bold font-heading text-cyan-accent tracking-wider">TUSHER</span>
            <span class="text-xs px-2 py-0.5 rounded bg-cyan-accent/10 text-cyan-accent font-mono">GAMER ID</span>
          </div>
          <div class="flex border-b border-white/10">
            <button id="authTabLogin" class="flex-1 pb-3 text-sm font-semibold border-b-2 border-cyan-accent text-cyan-accent transition-colors">
              Sign In
            </button>
            <button id="authTabRegister" class="flex-1 pb-3 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition-colors">
              Create Account
            </button>
          </div>
        </div>

        <!-- 1. Sign In Form -->
        <div id="loginFormContainer" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Email, Username, or User ID</label>
            <input type="text" id="loginIdentifier" placeholder="e.g. johndoe77 or john@example.com" class="w-full px-4 py-3 bg-nexus-800 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-accent text-sm" required>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" id="loginPassword" placeholder="••••••••" class="w-full px-4 py-3 bg-nexus-800 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-accent text-sm" required>
          </div>
          <div id="loginError" class="text-rose-400 text-xs hidden"></div>
          <button id="loginSubmitBtn" class="w-full py-3.5 bg-cyan-accent hover:bg-[#e8a4b6] text-nexus-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-accent/20 flex items-center justify-center gap-2">
            <span>Sign In to Tusher Gaming</span>
          </button>
        </div>

        <!-- 2. Sign Up Form -->
        <div id="registerFormContainer" class="p-6 space-y-3.5 hidden">
          <!-- Step 1: Account Details -->
          <div id="registerStep1" class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Gamer Name</label>
              <input type="text" id="regName" placeholder="e.g. John Doe" class="w-full px-3.5 py-2.5 bg-nexus-800 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-accent text-sm" required>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider">Unique Username</label>
                <span id="regUsernameStatus" class="text-xs font-mono"></span>
              </div>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono">@</span>
                <input type="text" id="regUsername" placeholder="shadow_gamer" class="w-full pl-8 pr-3.5 py-2.5 bg-nexus-800 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-accent text-sm font-mono" required>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Gmail / Email Address</label>
              <input type="email" id="regEmail" placeholder="gamer@gmail.com" class="w-full px-3.5 py-2.5 bg-nexus-800 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-accent text-sm" required>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Password</label>
              <input type="password" id="regPassword" minlength="6" placeholder="At least 6 characters" class="w-full px-3.5 py-2.5 bg-nexus-800 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-accent text-sm" required>
            </div>

            <div id="regError" class="text-rose-400 text-xs hidden"></div>

            <button id="sendCodeBtn" class="w-full py-3 bg-cyan-accent hover:bg-cyan-400 text-nexus-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-accent/20 text-sm flex items-center justify-center gap-2">
              <span>Send 6-Digit Email Code</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>

          <!-- Step 2: 6-Digit OTP Verification -->
          <div id="registerStep2" class="space-y-4 hidden">
            <div class="text-center">
              <div class="w-12 h-12 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent flex items-center justify-center mx-auto mb-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h4 class="text-lg font-bold font-heading">Verify Your Email</h4>
              <p class="text-xs text-gray-400">Enter the 6-digit authentication code sent to <span id="codeSentEmail" class="text-cyan-accent font-semibold"></span></p>
            </div>

            <!-- Visual Code Hint for testing -->
            <div id="codeHintBanner" class="p-2.5 rounded-lg bg-cyan-accent/10 border border-cyan-accent/30 text-center">
              <span class="text-xs text-gray-300">Authentication Code: </span>
              <span id="codeHintValue" class="text-sm font-mono font-bold text-cyan-accent tracking-widest"></span>
            </div>

            <div class="flex justify-center gap-2" id="otpContainer">
              <input type="text" maxlength="6" id="otpCodeInput" placeholder="123456" class="w-48 text-center text-2xl tracking-[0.5em] font-mono py-2.5 bg-nexus-800 border-2 border-cyan-accent/50 rounded-xl text-white outline-none focus:border-cyan-accent">
            </div>

            <div id="otpError" class="text-rose-400 text-xs text-center hidden"></div>

            <button id="completeRegistrationBtn" class="w-full py-3 bg-gradient-to-r from-cyan-accent to-emerald-400 text-nexus-950 font-bold rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2">
              <span>Verify & Complete Registration</span>
            </button>

            <button id="backToStep1Btn" class="w-full text-xs text-gray-400 hover:text-white transition-colors">
              ← Edit details / Resend code
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  attachAuthEventListeners();
}

let usernameTimer = null;
let currentSentCode = '';

function attachAuthEventListeners() {
  const modal = document.getElementById('nexusAuthModal');
  const closeBtn = document.getElementById('closeAuthModalBtn');
  const tabLogin = document.getElementById('authTabLogin');
  const tabRegister = document.getElementById('authTabRegister');
  const loginContainer = document.getElementById('loginFormContainer');
  const registerContainer = document.getElementById('registerFormContainer');

  // Close
  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // Tab switching
  tabLogin.addEventListener('click', () => {
    tabLogin.className = 'flex-1 pb-3 text-sm font-semibold border-b-2 border-cyan-accent text-cyan-accent transition-colors';
    tabRegister.className = 'flex-1 pb-3 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition-colors';
    loginContainer.classList.remove('hidden');
    registerContainer.classList.add('hidden');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.className = 'flex-1 pb-3 text-sm font-semibold border-b-2 border-cyan-accent text-cyan-accent transition-colors';
    tabLogin.className = 'flex-1 pb-3 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition-colors';
    registerContainer.classList.remove('hidden');
    loginContainer.classList.add('hidden');
  });

  // ==========================================
  // REAL-TIME 0.1S USERNAME CHECK
  // ==========================================
  const regUsername = document.getElementById('regUsername');
  const statusEl = document.getElementById('regUsernameStatus');

  regUsername.addEventListener('input', (e) => {
    clearTimeout(usernameTimer);
    const val = e.target.value.trim().toLowerCase();

    if (!val || val.length < 3) {
      statusEl.innerHTML = '<span class="text-gray-500 text-[11px]">Min 3 chars</span>';
      return;
    }

    statusEl.innerHTML = '<span class="text-cyan-accent text-[11px] animate-pulse">Checking...</span>';

    usernameTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(val)}`);
        const data = await res.json();

        if (data.available) {
          statusEl.innerHTML = '<span class="text-emerald-400 text-[11px] font-semibold">✓ Available</span>';
        } else {
          statusEl.innerHTML = `<span class="text-rose-400 text-[11px] font-semibold">✗ ${data.error || 'Taken'}</span>`;
        }
      } catch (err) {
        statusEl.innerHTML = '<span class="text-gray-500 text-[11px]">Check failed</span>';
      }
    }, 100); // 0.1s response
  });

  // ==========================================
  // STEP 1: SEND 6-DIGIT EMAIL CODE
  // ==========================================
  const sendCodeBtn = document.getElementById('sendCodeBtn');
  const regError = document.getElementById('regError');

  sendCodeBtn.addEventListener('click', async () => {
    regError.classList.add('hidden');
    const name = document.getElementById('regName').value.trim();
    const username = document.getElementById('regUsername').value.trim().toLowerCase();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;

    if (!name || !username || !email || !password) {
      regError.textContent = 'Please fill in all fields.';
      regError.classList.remove('hidden');
      return;
    }

    sendCodeBtn.disabled = true;
    sendCodeBtn.textContent = 'Sending Code...';

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to send verification code.');
      }

      currentSentCode = data.code || '';
      document.getElementById('codeSentEmail').textContent = email;
      document.getElementById('codeHintValue').textContent = currentSentCode;

      document.getElementById('registerStep1').classList.add('hidden');
      document.getElementById('registerStep2').classList.remove('hidden');
    } catch (err) {
      regError.textContent = err.message;
      regError.classList.remove('hidden');
    } finally {
      sendCodeBtn.disabled = false;
      sendCodeBtn.innerHTML = `<span>Send 6-Digit Email Code</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>`;
    }
  });

  document.getElementById('backToStep1Btn').addEventListener('click', () => {
    document.getElementById('registerStep2').classList.add('hidden');
    document.getElementById('registerStep1').classList.remove('hidden');
  });

  // ==========================================
  // STEP 2: VERIFY CODE & REGISTER
  // ==========================================
  const completeRegBtn = document.getElementById('completeRegistrationBtn');
  const otpError = document.getElementById('otpError');

  completeRegBtn.addEventListener('click', async () => {
    otpError.classList.add('hidden');
    const name = document.getElementById('regName').value.trim();
    const username = document.getElementById('regUsername').value.trim().toLowerCase();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const code = document.getElementById('otpCodeInput').value.trim();

    if (!code || code.length < 6) {
      otpError.textContent = 'Please enter the complete 6-digit code.';
      otpError.classList.remove('hidden');
      return;
    }

    completeRegBtn.disabled = true;
    completeRegBtn.textContent = 'Verifying Account...';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password, code })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Registration failed.');
      }

      // Store auth
      localStorage.setItem('nexus_customer_token', data.token);
      localStorage.setItem('nexus_customer_user', JSON.stringify(data.user));

      modal.classList.add('hidden');
      window.location.href = '/user-dashboard.html';
    } catch (err) {
      otpError.textContent = err.message;
      otpError.classList.remove('hidden');
    } finally {
      completeRegBtn.disabled = false;
      completeRegBtn.textContent = 'Verify & Complete Registration';
    }
  });

  // ==========================================
  // LOGIN SUBMIT (Supports Email, Username, User ID)
  // ==========================================
  const loginBtn = document.getElementById('loginSubmitBtn');
  const loginError = document.getElementById('loginError');

  loginBtn.addEventListener('click', async () => {
    loginError.classList.add('hidden');
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!identifier || !password) {
      loginError.textContent = 'Please enter your email/username and password.';
      loginError.classList.remove('hidden');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Invalid credentials.');
      }

      localStorage.setItem('nexus_customer_token', data.token);
      localStorage.setItem('nexus_customer_user', JSON.stringify(data.user));

      // If admin, also store admin token
      if (data.user.role === 'admin' || data.user.role === 'super_admin') {
        localStorage.setItem('nexus_admin_token', data.token);
        localStorage.setItem('nexus_admin_user', JSON.stringify(data.user));
      }

      modal.classList.add('hidden');
      updateNavbarUserUI();
      window.location.reload();
    } catch (err) {
      loginError.textContent = err.message;
      loginError.classList.remove('hidden');
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign In to Nexus';
    }
  });
}

export function openAuthModal(mode = 'login') {
  initAuthModal();
  const modal = document.getElementById('nexusAuthModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  if (mode === 'register') {
    document.getElementById('authTabRegister').click();
  } else {
    document.getElementById('authTabLogin').click();
  }
}

export function getCustomerUser() {
  const stored = localStorage.getItem('nexus_customer_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

export function customerLogout() {
  localStorage.removeItem('nexus_customer_token');
  localStorage.removeItem('nexus_customer_user');
  window.location.href = '/';
}

export function updateNavbarUserUI() {
  let user = getCustomerUser();
  const token = localStorage.getItem('nexus_customer_token');
  const container = document.getElementById('navbarUserContainer');
  if (!container) return;

  function render(u) {
    if (typeof updateMobileUserUI === 'function') updateMobileUserUI();
    if (!container) return;
    if (u) {
      const avatar = u.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80';
      const isAdmin = u.role === 'admin' || u.role === 'super_admin';

      container.innerHTML = `
        <div class="relative group">
          <a href="/user-dashboard.html" class="flex items-center gap-1.5 sm:gap-2.5 p-1 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-full bg-nexus-800/90 border border-white/10 hover:border-cyan-accent/50 transition-all">
            <img src="${avatar}" alt="Avatar" class="w-7 h-7 rounded-full object-cover border border-cyan-accent" />
            <span class="hidden sm:inline text-xs font-semibold text-white max-w-[100px] truncate">${(u.name || 'Gamer').split(' ')[0]}</span>
            <svg class="hidden sm:block w-3.5 h-3.5 text-gray-400 group-hover:text-cyan-accent transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </a>

          <!-- Dropdown Menu -->
          <div class="absolute right-0 top-full mt-2 w-52 bg-nexus-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 hidden group-hover:block animate-fade-in z-50">
            <div class="px-4 py-2 border-b border-white/5">
              <p class="text-xs font-bold text-white truncate">${u.name}</p>
              <p class="text-[11px] text-cyan-accent font-mono truncate">@${u.username || 'gamer'}</p>
              <p class="text-[10px] text-gray-400 font-mono mt-0.5">${u.userId || ''}</p>
            </div>
            <a href="/user-dashboard.html" class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-200 hover:text-cyan-accent hover:bg-white/5 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              My Gamer Dashboard
            </a>
            <a href="/user-dashboard.html#orders" class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-200 hover:text-cyan-accent hover:bg-white/5 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              My Orders
            </a>
            ${isAdmin ? `
              <a href="/admin/" target="_blank" class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gold-accent hover:bg-white/5 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                Admin Portal
              </a>
            ` : ''}
            <button onclick="window.nexusCustomerLogout()" class="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-white/5 mt-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Sign Out
            </button>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button onclick="window.nexusOpenAuthModal('login')" class="text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/30 hover:bg-cyan-accent hover:text-nexus-900 transition-all flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span class="hidden sm:inline">Sign In</span>
        </button>
      `;
    }
  }

  // Immediately render cached user (instant load even if offline or 1000 days later)
  render(user);

  // Background refresh if token exists and online
  if (token) {
    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('nexus_customer_token');
        localStorage.removeItem('nexus_customer_user');
        render(null);
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (data && data.success && data.user) {
        localStorage.setItem('nexus_customer_user', JSON.stringify(data.user));
        render(data.user);
      }
    })
    .catch(err => {
      // Keep cached user if offline or server momentarily unavailable
      console.warn('Silent user session verification (offline/cache active):', err);
    });
  }
}

// Attach globally
if (typeof window !== 'undefined') {
  window.tusherOpenAuthModal = openAuthModal;
  window.tusherCustomerLogout = customerLogout;
  window.nexusOpenAuthModal = openAuthModal;
  window.nexusCustomerLogout = customerLogout;
}
