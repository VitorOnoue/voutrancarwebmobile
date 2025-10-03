// ====== MOCK DE DADOS ======
const DB = [
  {
    id:"pizza-hut-centro",
    nome:"Pizza Hut",
    tipo:"Pizza · Italiana",
    rating:4.7,
    distancia_km:0.2,
    tempo_min:28,
    prato:"Pizza Margherita",
    img:"img/hut.png",
    ofertas:{
      "iFood":     {preco:9.90, frete:5.99, tempo:30, promo:"—",            link:"https://www.ifood.com.br/delivery/sao-paulo-sp/pizza-hut---brooklin-sao-paulo/5e974043-1ea7-4d04-bdff-182099447aa2"},
      "Rappi":     {preco:42.90, frete:0.00, tempo:27, promo:"Frete grátis", link:"#rappi"},
      "Uber Eats": {preco:37.90, frete:8.90, tempo:35, promo:"—",            link:"#uber"}
    }
  },
  {
    id:"dominos-jardins",
    nome:"Domino's Pizza",
    tipo:"Pizza · Fast-casual",
    rating:4.5,
    distancia_km:2.9,
    tempo_min:32,
    prato:"Pepperoni Clássica",
    img:"img/dominos.png",
    ofertas:{
      "iFood":     {preco:36.90, frete:6.99, tempo:32, promo:"—",          link:"https://www.ifood.com.br/"},
      "Rappi":     {preco:38.50, frete:0.00, tempo:28, promo:"Cupom R$10", link:"#rappi"},
      "Uber Eats": {preco:34.90, frete:8.90, tempo:35, promo:"—",          link:"#uber"}
    }
  },
  {
    id:"pizzaria-gen",
    nome:"Pizzaria Genérica",
    tipo:"Pizza · Tradicional",
    rating:4.2,
    distancia_km:8.0,
    tempo_min:40,
    prato:"Calabresa Família",
    img:"img/eneric.jpg",
    ofertas:{
      "iFood":     {preco:29.90, frete:5.99, tempo:42, promo:"—",            link:"https://www.ifood.com.br/"},
      "Rappi":     {preco:31.90, frete:0.00, tempo:40, promo:"Frete grátis", link:"#rappi"},
      "Uber Eats": {preco:27.90, frete:8.90, tempo:44, promo:"—",            link:"#uber"}
    }
  }
];
const APPS = ["iFood","Rappi","Uber Eats"];

// ====== UTILS ======
const $ = (s)=>document.querySelector(s);
const elList     = $('#list');
const secHome    = $('#home');
const secResults = $('#results');
const secConfirm = $('#confirm');
const dlg        = $('#compareDialog');

// ====== Sessão/Favoritos (via auth.js) ======
let currentUser = getSession?.() || null;
let currentFavs = currentUser?.email ? loadFavs(currentUser.email) : new Set();

function hydrateSessionUI(){
  // Atualiza topo (auth.js também faz isso automaticamente)
  const sess = getSession?.();
  const navUser = $('#navUser');
  const btnLogin = $('#btnLogin');
  const btnLogout = $('#btnLogout');
  const lnkFavs = $('#lnkFavs');

  if(sess?.email){
    currentUser = { email: sess.email };
    currentFavs = loadFavs(sess.email);
    if(navUser){ navUser.textContent = sess.email; navUser.hidden = false; }
    if(btnLogin){ btnLogin.hidden = true; }
    if(btnLogout){
      btnLogout.hidden = false;
      btnLogout.onclick = (e)=>{ e.preventDefault(); logoutAndRedirect(); };
    }
    if(lnkFavs){ lnkFavs.removeAttribute('aria-disabled'); }
  } else {
    currentUser = null;
    currentFavs = new Set();
  }
}

function show(section){
  [secHome,secResults,secConfirm].forEach(s=> s && (s.hidden = true));
  section && (section.hidden = false);
  window.scrollTo({top:0, behavior:'smooth'});
}
function currency(v){ return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function cheapest(ofs){
  return Object.entries(ofs)
    .map(([app,o])=>({app,...o,total:o.preco+o.frete}))
    .sort((a,b)=>a.total-b.total)[0];
}

// ====== RENDER RESULTADOS ======
function renderList(items){
  if(!elList) return;
  elList.innerHTML = "";

  // Se a lista estiver vazia e usuário for "Favoritos"
  if(items.length === 0){
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `<div class="meta"><h3>Nenhum favorito ainda</h3><p class="muted">Clique em "🤍 Favoritar" nos resultados para salvar.</p></div>`;
    elList.appendChild(li);
    show(secResults);
    return;
  }

  items.forEach(r=>{
    const best = cheapest(r.ofertas);
    const isFav = currentUser ? currentFavs.has(r.id) : false;

    const li = document.createElement('li');
    li.className = 'item';

    const fig = document.createElement('figure');
    fig.className = 'thumb';
    const src = r.img || 'img/placeholder.jpg';
    fig.innerHTML = `<img src="${src}" alt="${r.nome}">`;

    const meta  = document.createElement('section');
    meta.className = 'meta';
    meta.innerHTML = `
      <h3>${r.nome}</h3>
      <p class="muted details">
        <span>${r.tipo}</span>
        <span>· ${r.distancia_km} km</span>
        <span>· ${r.tempo_min}–${r.tempo_min+10} min</span>
      </p>
      <p class="muted note">
        <span>Prato: <b>${r.prato}</b></span>
        <span>· Nota ★ ${r.rating.toFixed(1)}</span>
      </p>
    `;

    const price = document.createElement('span');
    price.className = 'price-pill price';
    price.innerHTML = `A partir de <b>${currency(cheapest(r.ofertas).total)}</b>`;

    const actions = document.createElement('aside');
    actions.className = 'compare';
    actions.innerHTML = `
      <button class="btn btn-primary" data-open="${r.id}">Comparar preços</button>
      <button class="fav ${isFav ? 'is-active':''}" data-fav="${r.id}">${isFav?'💖 Favorito':'🤍 Favoritar'}</button>
    `;

    li.appendChild(fig);     
    li.appendChild(meta);    
    li.appendChild(actions); 
    li.appendChild(price);   
    elList.appendChild(li);
  });

  // Ações: abrir comparação
  elList.querySelectorAll('[data-open]').forEach(b=>{
    b.addEventListener('click', ()=> openCompare(b.getAttribute('data-open')));
  });

  // Ações: favoritar
  elList.querySelectorAll('[data-fav]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-fav');
      const sess = getSession?.();
      if(!sess?.email){ location.href = 'login.html'; return; }
      if(currentFavs.has(id)) currentFavs.delete(id);
      else currentFavs.add(id);
      saveFavs(sess.email, currentFavs);
      b.classList.toggle('is-active');
      b.textContent = b.classList.contains('is-active') ? '💖 Favorito' : '🤍 Favoritar';
    });
  });
}

// ====== BUSCA ======
function search(q){
  const s = (q||"").toLowerCase();
  const out = DB.filter(r =>
    r.nome.toLowerCase().includes(s) ||
    r.tipo.toLowerCase().includes(s) ||
    r.prato.toLowerCase().includes(s)
  );
  renderList(out.length? out : DB);
  show(secResults);
}

// ====== ORDENAÇÃO ======
function order(by){
  let items = [...DB];
  if(by==='preco'){
    items.sort((a,b)=>cheapest(a.ofertas).total - cheapest(b.ofertas).total);
  } else if(by==='tempo'){
    items.sort((a,b)=>a.tempo_min - b.tempo_min);
  } else if(by==='avaliacao'){
    items.sort((a,b)=>b.rating - a.rating);
  }
  renderList(items);
}

// ====== MODAL DE COMPARAÇÃO ======
let current = null;
function openCompare(id){
  const r = DB.find(x=>x.id===id);
  current = r;
  const mRest = $('#modalRestaurant');
  const mDish = $('#modalDish');
  const tbody = $('#modalRows');
  if(!mRest || !mDish || !tbody || !dlg){ return; }

  mRest.textContent = r.nome;
  mDish.textContent = r.prato;
  tbody.innerHTML = "";
  const rows = Object.entries(r.ofertas)
    .map(([app,o])=>({app,...o,total:o.preco+o.frete}))
    .sort((a,b)=>a.total-b.total);

  rows.forEach((o,idx)=>{
    const tr = document.createElement('tr');
    const best = idx===0;
    tr.innerHTML = `
      <td><span class="badge ${best?'best':''}">${o.app}</span></td>
      <td>${currency(o.preco)}</td>
      <td>${o.frete===0?'<span class="free">Grátis</span>':currency(o.frete)}</td>
      <td>${o.tempo} min</td>
      <td>${o.promo || '—'}</td>
      <td><b>${currency(o.total)}</b> ${best?'<span class="badge best" style="margin-left:6px">Mais barato</span>':''}</td>
    `;
    tbody.appendChild(tr);
  });

  dlg.showModal();
  const go = $('#btnGoCheapest');
  if(go){
    go.onclick = ()=>{
      const best = rows[0];
      const msg = $('#confirmMsg');
      const a = $('#openApp');
      if(msg) msg.innerHTML = `Você escolheu <b>${r.nome}</b> via <b>${best.app}</b> por <b>${currency(best.total)}</b>.`;
      if(a) a.href = best.link || '#';
      dlg.close();
      show(secConfirm);
    };
  }
}

// ====== EVENTOS UI ======
const searchForm = $('#searchForm');
if(searchForm){
  searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    search($('#q').value);
  });
}
document.querySelectorAll('.cat').forEach(c=>{
  c.addEventListener('click', ()=> search(c.dataset.cat));
});
document.querySelectorAll('.filters [data-order]').forEach(b=>{
  b.addEventListener('click', ()=> order(b.getAttribute('data-order')));
});
$('#editSearch')?.addEventListener('click', ()=> show(secHome));
$('#backResults')?.addEventListener('click', ()=> show(secResults));
$('#closeDialog')?.addEventListener('click', ()=> dlg?.close());
$('#lnkHome')?.addEventListener('click', e=>{ e.preventDefault(); show(secHome); });

// Favoritos no topo
$('#lnkFavs')?.addEventListener('click', (e)=>{
  e.preventDefault();
  const sess = getSession?.();
  if(!sess?.email){ location.href = 'login.html'; return; }
  const favs = loadFavs(sess.email);
  const items = DB.filter(r=>favs.has(r.id));
  renderList(items.length? items : []);
  show(secResults);
});

// ====== CARGA INICIAL ======
hydrateSessionUI();
renderList(DB);

// ====== API MAPAS ======
let gmap, gPlaces;
const gMarkers = [];
const DEFAULT_CENTER = { lat: -1.455, lng: -48.503 }; // Belém-PA
const MAP_STYLE_HIDE_POIS = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] }
];

function requestUserLocation() {
  if (!('geolocation' in navigator)) {
    console.warn('Geolocation não suportada pelo navegador.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      gmap.setCenter(coords);
      gmap.setZoom(15);
      loadNearby(coords);
    },
    (err) => { console.warn('Geolocation negada/erro:', err); },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
  );
}

function initMap() {
  const el = document.getElementById('map');
  if (!el) { console.error('Contêiner #map não encontrado.'); return; }

  gmap = new google.maps.Map(el, {
    center: DEFAULT_CENTER,
    zoom: 14,
    styles: MAP_STYLE_HIDE_POIS,
    mapId: 'DEMO_MAP_ID',
  });

  gPlaces = new google.maps.places.PlacesService(gmap);
  loadNearby(DEFAULT_CENTER);
  requestUserLocation();
}
window.initMap = window.initMap || initMap;

function loadNearby(center) {
  const req = { location: center, radius: 2000, type: 'restaurant' };
  gPlaces.nearbySearch(req, (results, status, pagination) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
      console.error('Places error:', status);
      return;
    }
    gMarkers.forEach(m => m.setMap(null));
    gMarkers.length = 0;
    results.forEach(place => {
      if (!place.geometry?.location) return;
      const marker = new google.maps.Marker({
        map: gmap,
        position: place.geometry.location,
        title: place.name || 'Restaurante',
      });
      gMarkers.push(marker);
    });
    if (pagination?.hasNextPage) {
      setTimeout(() => pagination.nextPage(), 350);
    }
  });
}
