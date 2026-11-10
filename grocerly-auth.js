/* Grocerly Supabase authentication bridge.
 * Active only when /api/public-config provides a publishable key.
 * Account data is never authorized using an email from local storage.
 */
(() => {
  'use strict';
  const URL = 'https://qbmcsqvyeozgetznlgjc.supabase.co';
  const storeKey = 'grocerly_supabase_session_v1';
  const endpoints = {
    '/api/inventory': 'inventory',
    '/api/recipes': 'recipes',
    '/api/trips': 'trips',
    '/api/waste': 'wasteLogs',
    '/api/notifications': 'notifications',
    '/api/calendar': 'calendar',
    '/api/custom-stores': 'customStores'
  };
  let key = '';
  let session = null;
  let configured = false;

  function clearOldFlags() {
    localStorage.removeItem('grocerly_logged_in');
    sessionStorage.removeItem('grocerly_logged_in');
  }
  function clearLegacyCache() {
    localStorage.removeItem('grocerly_state_cache');
  }
  function persist(remember) {
    localStorage.removeItem(storeKey);
    sessionStorage.removeItem(storeKey);
    if (session) (remember ? localStorage : sessionStorage).setItem(storeKey, JSON.stringify(session));
  }
  function restore() {
    try {
      session = JSON.parse(sessionStorage.getItem(storeKey) || localStorage.getItem(storeKey) || 'null');
    } catch (_e) { session = null; }
  }
  function isAuthenticated() { return !!(configured && session?.access_token && session?.user?.id); }
  async function authFetch(path, body, token = null) {
    const res = await fetch(URL + '/auth/v1/' + path, {
      method: 'POST', headers: {
        apikey: key, 'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Error(data.msg || data.error_description || data.message || 'Authentication request failed');
    return data;
  }
  async function verify() {
    if (!session?.access_token) return false;
    if (Date.now() >= (session.expires_at || 0) * 1000 - 60000) {
      try {
        const fresh = await authFetch('token?grant_type=refresh_token', {refresh_token:session.refresh_token});
        const remember = !!localStorage.getItem(storeKey);
        session = fresh;
        persist(remember);
      } catch (_e) { session = null; persist(false); return false; }
    }
    const res = await fetch(URL + '/auth/v1/user', {
      headers: {apikey:key, Authorization:'Bearer ' + session.access_token}
    }).catch(() => null);
    if (!res?.ok) { session = null; persist(false); return false; }
    session.user = await res.json();
    persist(!!localStorage.getItem(storeKey));
    return true;
  }
  async function apiRequest(endpoint, method = 'GET', body = null) {
    if (!isAuthenticated() || !await verify()) throw Error('Please sign in again.');
    let route, outgoing;
    if (endpoint.startsWith('/api/profile')) {
      route = '/api/v2/profile';
      if (method !== 'GET') outgoing = {profile: body.profile};
    } else {
      const stem = endpoint.split('?')[0];
      const type = endpoints[stem];
      if (!type) throw Error('Unsupported account endpoint: ' + stem);
      route = '/api/v2/documents/' + encodeURIComponent(type);
      if (method !== 'GET') outgoing = {payload: body[type]};
    }
    const res = await fetch(route, {
      method, headers: {
        'Authorization': 'Bearer ' + session.access_token,
        'Content-Type': 'application/json'
      },
      ...(outgoing ? {body:JSON.stringify(outgoing)} : {})
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw Error(json.error || 'Cloud save failed');
    if (endpoint.startsWith('/api/profile')) {
      if (method === 'GET') return json;
      return body.profile;
    }
    if (method === 'GET') return json[0]?.payload ?? (route.endsWith('/calendar') ? {} : []);
    return body[endpoints[endpoint.split('?')[0]]];
  }
  function applyUser() {
    if (!isAuthenticated() || !window.State) return;
    State.user.email = session.user.email;
    State.user.uid = session.user.id;
  }
  async function finishLogin() {
    clearOldFlags();
    clearLegacyCache();
    applyUser();
    const profile = await apiRequest('/api/profile');
    State.user = {...State.user, ...profile, email:session.user.email, uid:session.user.id, isAdmin:false, isPremium:false};
    await loadStateFromServer();
    refreshDashboard();
    refreshInventoryList();
    refreshRecipesList();
    refreshProfileCard();
    transitionToPage('page-dashboard');
    document.getElementById('app-bottom-nav')?.classList.add('active');
  }
  async function signIn(email,password,remember) {
    const data = await authFetch('token?grant_type=password', {email,password});
    if (!data.access_token || !data.user) throw Error('Could not verify this account');
    session = data;
    persist(remember);
    await finishLogin();
  }
  async function signUp(email,password,name) {
    const data = await authFetch('signup', {
      email,password, data:{display_name:name || 'Grocerly Member'}
    });
    if (!data.session?.access_token) {
      alert('Check your email and verify your account, then sign in.');
      return;
    }
    session = data.session;
    persist(true);
    await finishLogin();
  }
  async function signOut() {
    if (session?.access_token) {
      await authFetch('logout', {}, session.access_token).catch(() => {});
    }
    session = null; persist(false); clearOldFlags(); clearLegacyCache();
    location.reload();
  }
  async function handleClick(e) {
    const btn=e.target.closest('button');
    if (!btn || !configured) return;
    const id=btn.id;
    if (!['btn-login-signin','btn-login-signup','btn-register-signup','btn-login-forgot','btn-logout'].includes(id)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    btn.disabled = true;
    try {
      if(id==='btn-logout') {
        if(confirm('Sign out of Grocerly?')) await signOut();
      } else if (id==='btn-login-forgot') {
        const email=document.getElementById('login-email').value.trim() || prompt('Email address for password reset:');
        if (email) {
          await authFetch('recover', {email});
          alert('If this email is registered, password reset instructions will arrive shortly.');
        }
      } else if (id==='btn-login-signin') {
        await signIn(document.getElementById('login-email').value.trim(),document.getElementById('login-password').value,
          document.getElementById('login-keep-signed-in').checked);
      } else {
        const register = id==='btn-register-signup';
        const email=document.getElementById(register?'reg-email':'login-email').value.trim();
        const password=document.getElementById(register?'reg-password':'login-password').value;
        const name=register ? document.getElementById('reg-name').value.trim() : '';
        if (!email || password.length < 8) throw Error('Enter a valid email and a password of at least 8 characters.');
        if(register && password !== document.getElementById('reg-password-confirm').value) throw Error('Passwords do not match.');
        await signUp(email,password,name);
      }
    } catch(err) { alert(err.message || 'Please try again'); }
    finally { btn.disabled=false; }
  }
  document.addEventListener('click', handleClick, true);
  window.GrocerlyAuth = { isAuthenticated, apiRequest, get configured(){return configured;} };
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch('/api/public-config', {cache:'no-store'});
      const config = await res.json();
      if (!res.ok || !config.supabasePublishableKey) return;
      key = config.supabasePublishableKey;
      configured = true;
      // Hide existing simulated social logins until real OAuth is wired.
      const google=document.getElementById('btn-login-google-container');
      if(google) google.style.display='none';
      document.querySelectorAll('[data-social-provider],#btn-login-apple').forEach(el=>el.style.display='none');
      clearOldFlags();
      restore();
      if (await verify()) await finishLogin();
      else {
        clearLegacyCache();
        transitionToPage('page-login');
      }
    } catch(err) {
      console.warn('Supabase account configuration is unavailable:',err);
      // Do not quietly use the legacy plaintext login when a configured
      // deployment is expected. The backend rejects legacy credentials.
    }
  });
})();
