// === auth.js: helpers de autenticação e favoritos (local, via localStorage) ===
const LS_USERS_KEY = "auth:users";
const LS_SESSION_KEY = "auth:session";
const LS_FAV_PREFIX = "fav:"; // fav:<email> => JSON string array

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(LS_USERS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveUsers(arr) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(arr));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(LS_SESSION_KEY));
  } catch {
    return null;
  }
}
function setSession(sess) {
  if (sess) localStorage.setItem(LS_SESSION_KEY, JSON.stringify(sess));
  else localStorage.removeItem(LS_SESSION_KEY);
}

function favKey(email) {
  return `${LS_FAV_PREFIX}${email}`;
}
function loadFavs(email) {
  if (!email) return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(favKey(email))) || []);
  } catch {
    return new Set();
  }
}
function saveFavs(email, set) {
  localStorage.setItem(favKey(email), JSON.stringify(Array.from(set)));
}

function logoutAndRedirect() {
  setSession(null);
  location.href = "../pages/index.html";
}

function ensureLogged() {
  const sess = getSession();
  if (!sess?.email) {
    location.href = "../pages/login.html";
    return null;
  }
  return sess;
}

// Exibe estado no topo (quando existir os elementos)
function hydrateTopbar() {
  const sess = getSession();
  const navUser = document.querySelector("#navUser");
  const btnLogin = document.querySelector("#btnLogin");
  const btnLogout = document.querySelector("#btnLogout");
  const lnkFavs = document.querySelector("#lnkFavs");

  if (sess?.email) {
    if (navUser) {
      navUser.textContent = sess.email;
      navUser.hidden = false;
    }
    if (btnLogin) {
      btnLogin.hidden = TrueIf(
        btnLogin.getAttribute("data-hide-when-logged") || "1"
      );
    }
    if (btnLogout) {
      btnLogout.hidden = false;
      btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        logoutAndRedirect();
      });
    }
    if (lnkFavs) {
      lnkFavs.removeAttribute("aria-disabled");
    }
  } else {
    if (navUser) {
      navUser.hidden = true;
    }
    if (btnLogin) {
      btnLogin.hidden = false;
    }
    if (btnLogout) {
      btnLogout.hidden = true;
    }
  }

  function TrueIf(v) {
    return String(v) === "1";
  }
}

document.addEventListener("DOMContentLoaded", hydrateTopbar);
