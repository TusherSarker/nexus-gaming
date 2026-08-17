async function checkAuth() {
  const token = getToken();
  if (!token) {
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/admin/') {
      window.location.href = '/admin/index.html';
    }
    return null;
  }

  try {
    const res = await api.get('/auth/me');
    const user = res.data || res.user || res;
    
    // Store user data
    localStorage.setItem('nexus_admin_user', JSON.stringify(user));

    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/admin/') {
      window.location.href = '/admin/dashboard.html';
    }
    return user;
  } catch (error) {
    console.warn('Auth verification notice:', error);
    // If offline or network error, retain cached session so user is never logged out
    const cachedUser = getUser();
    if (cachedUser && (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || !navigator.onLine)) {
      if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/admin/') {
        window.location.href = '/admin/dashboard.html';
      }
      return cachedUser;
    }

    // Only clear if genuinely rejected by server (401/403)
    if (error.status === 401 || error.status === 403 || error.message?.includes('401') || error.message?.includes('403')) {
      localStorage.removeItem('nexus_admin_token');
      localStorage.removeItem('nexus_admin_user');
      if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/admin/') {
        window.location.href = '/admin/index.html';
      }
    }
    return cachedUser || null;
  }
}

async function login(identifier, password) {
  try {
    const data = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('nexus_admin_token', data.token);
    if (data.user) {
      localStorage.setItem('nexus_admin_user', JSON.stringify(data.user));
    }
    window.location.href = '/admin/dashboard.html';
  } catch (error) {
    throw error;
  }
}

function logout() {
  localStorage.removeItem('nexus_admin_token');
  localStorage.removeItem('nexus_admin_user');
  window.location.href = '/admin/index.html';
}

function getUser() {
  const stored = localStorage.getItem('nexus_admin_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  const token = getToken();
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function hasPermission(permission) {
  const user = getUser();
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  const permissions = user.permissions || [];
  return permissions.includes('all') || permissions.includes(permission);
}
