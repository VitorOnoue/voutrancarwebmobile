// lib/data.js
export const DB = [
  {
    id: 'pizza-hut-centro',
    nome: 'Pizza Hut',
    tipo: 'Pizza · Italiana',
    rating: 4.7,
    distancia_km: 0.2,
    tempo_min: 28,
    prato: 'Pizza Margherita',
    img: '/img/hut.png',
    ofertas: {
      iFood:     { preco: 9.90, frete: 5.99, tempo: 30, promo: '—',            link: 'https://www.ifood.com.br/delivery/sao-paulo-sp/pizza-hut---brooklin-sao-paulo/5e974043-1ea7-4d04-bdff-182099447aa2' },
      Rappi:     { preco: 42.90, frete: 0.00, tempo: 27, promo: 'Frete grátis', link: '#rappi' },
      'Uber Eats': { preco: 37.90, frete: 8.90, tempo: 35, promo: '—',          link: '#uber' },
    },
  },
  {
    id: 'dominos-jardins',
    nome: "Domino's Pizza",
    tipo: 'Pizza · Fast-casual',
    rating: 4.5,
    distancia_km: 2.9,
    tempo_min: 32,
    prato: 'Pepperoni Clássica',
    img: '/img/dominos.png',
    ofertas: {
      iFood:     { preco: 36.90, frete: 6.99, tempo: 32, promo: '—',          link: 'https://www.ifood.com.br/' },
      Rappi:     { preco: 38.50, frete: 0.00, tempo: 28, promo: 'Cupom R$10', link: '#rappi' },
      'Uber Eats': { preco: 34.90, frete: 8.90, tempo: 35, promo: '—',        link: '#uber' },
    },
  },
  {
    id: 'pizzaria-gen',
    nome: 'Pizzaria Genérica',
    tipo: 'Pizza · Tradicional',
    rating: 4.2,
    distancia_km: 8.0,
    tempo_min: 40,
    prato: 'Calabresa Família',
    img: '/img/generic.jpg',
    ofertas: {
      iFood:     { preco: 29.90, frete: 5.99, tempo: 42, promo: '—',            link: 'https://www.ifood.com.br/' },
      Rappi:     { preco: 31.90, frete: 0.00, tempo: 40, promo: 'Frete grátis', link: '#rappi' },
      'Uber Eats': { preco: 27.90, frete: 8.90, tempo: 44, promo: '—',          link: '#uber' },
    },
  },
];

export const APPS = ['iFood', 'Rappi', 'Uber Eats'];

export function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function cheapest(ofs) {
  return Object.entries(ofs)
    .map(([app, o]) => ({ app, ...o, total: o.preco + o.frete }))
    .sort((a, b) => a.total - b.total)[0];
}

export function searchDB(q) {
  const s = (q || '').toLowerCase();
  const out = DB.filter(
    (r) =>
      r.nome.toLowerCase().includes(s) ||
      r.tipo.toLowerCase().includes(s) ||
      r.prato.toLowerCase().includes(s),
  );
  return out.length ? out : DB;
}

export function orderDB(by) {
  const items = [...DB];
  if (by === 'preco') {
    items.sort((a, b) => cheapest(a.ofertas).total - cheapest(b.ofertas).total);
  } else if (by === 'tempo') {
    items.sort((a, b) => a.tempo_min - b.tempo_min);
  } else if (by === 'avaliacao') {
    items.sort((a, b) => b.rating - a.rating);
  }
  return items;
}
