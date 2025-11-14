// lib/auth.js
const LS_USERS_KEY = 'auth:users';
const LS_SESSION_KEY = 'auth:session';
const LS_FAV_PREFIX = 'fav:';

function hasWindow() {
  return typeof window !== 'undefined';
}

export function loadUsers() {
  if (!hasWindow()) return [];
  try {
    return JSON.parse(window.localStorage.getItem(LS_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveUsers(arr) {
  if (!hasWindow()) return;
  window.localStorage.setItem(LS_USERS_KEY, JSON.stringify(arr));
}

export function getSession() {
  if (!hasWindow()) return null;
  try {
    return JSON.parse(window.localStorage.getItem(LS_SESSION_KEY));
  } catch {
    return null;
  }
}

export function setSession(sess) {
  if (!hasWindow()) return;
  if (sess) window.localStorage.setItem(LS_SESSION_KEY, JSON.stringify(sess));
  else window.localStorage.removeItem(LS_SESSION_KEY);
}

function favKey(email) {
  return `${LS_FAV_PREFIX}${email}`;
}

export function loadFavs(email) {
  if (!hasWindow() || !email) return new Set();
  try {
    return new Set(JSON.parse(window.localStorage.getItem(favKey(email))) || []);
  } catch {
    return new Set();
  }
}

export function saveFavs(email, set) {
  if (!hasWindow() || !email) return;
  window.localStorage.setItem(favKey(email), JSON.stringify(Array.from(set)));
}

export function logout() {
  setSession(null);
}
