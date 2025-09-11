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
    img:"assets/hut.png",
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
    img:"assets/dominos.png",
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
    img:"assets/generic.jpg",
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

function show(section){
  [secHome,secResults,secConfirm].forEach(s=> s.hidden = true);
  section.hidden = false;
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
  elList.innerHTML = "";
  items.forEach(r=>{
    const best = cheapest(r.ofertas);

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

  // depois do meta, crie a pílula posicionada na “área price”
  const price = document.createElement('span');
  price.className = 'price-pill price';
  price.innerHTML = `A partir de <b>${currency(cheapest(r.ofertas).total)}</b>`;


    const actions = document.createElement('aside');
    actions.className = 'compare'
    actions.innerHTML =  `<button class="btn btn-primary" data-open="${r.id}">Comparar preços</button>`;;


    li.appendChild(fig);     
    li.appendChild(meta);    
    li.appendChild(actions); 
    li.appendChild(price);   
    elList.appendChild(li);

  });

  elList.querySelectorAll ('[data-open]').forEach(b=>{
    b.addEventListener('click', ()=> openCompare(b.getAttribute('data-open')));
  })
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
  $('#modalRestaurant').textContent = r.nome;
  $('#modalDish').textContent = r.prato;
  const tbody = $('#modalRows'); tbody.innerHTML = "";
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
  $('#btnGoCheapest').onclick = ()=>{
    const best = rows[0];
    $('#confirmMsg').innerHTML =
      `Você escolheu <b>${r.nome}</b> via <b>${best.app}</b> por <b>${currency(best.total)}</b>.`;
    const a = $('#openApp'); a.href = best.link || '#';
    dlg.close();
    show(secConfirm);
  };
}

// ====== EVENTOS UI ======
$('#searchForm').addEventListener('submit', e=>{
  e.preventDefault();
  search($('#q').value);
});
document.querySelectorAll('.cat').forEach(c=>{
  c.addEventListener('click', ()=> search(c.dataset.cat));
});
document.querySelectorAll('.filters [data-order]').forEach(b=>{
  b.addEventListener('click', ()=> order(b.getAttribute('data-order')));
});
$('#editSearch').addEventListener('click', ()=> show(secHome));
$('#backResults').addEventListener('click', ()=> show(secResults));
$('#closeDialog').addEventListener('click', ()=> dlg.close());
$('#lnkHome').addEventListener('click', e=>{e.preventDefault(); show(secHome);});

// ====== CARGA INICIAL ======
renderList(DB);
