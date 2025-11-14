'use client';

import { useEffect, useMemo, useState } from 'react';
import { DB, currency, cheapest, orderDB, searchDB } from '../lib/data';
import { getSession, loadFavs, saveFavs, logout } from '../lib/auth';

function NavBar({ sessionEmail, onLogout, onShowHome, onShowFavs }) {
  return (
    <header>
      <nav className="container nav" aria-label="Barra superior">
        <h1 className="logo">
          <span className="logo-badge" aria-hidden="true"></span> Favoris
        </h1>
        <ul className="nav-actions" aria-label="Navegação principal">
          <li>
            <button className="btn btn-outline" onClick={onShowHome}>
              Início
            </button>
          </li>
          <li>
            <button className="btn btn-outline" onClick={onShowFavs}>
              Favoritos
            </button>
          </li>
          <li>
            {sessionEmail ? (
              <span className="pill" id="navUser">
                {sessionEmail}
              </span>
            ) : null}
          </li>
          <li>
            {!sessionEmail && (
              <button
                className="btn btn-outline"
                id="btnLogin"
                onClick={() => (window.location.href = '/login')}
              >
                Entrar
              </button>
            )}
          </li>
          <li>
            {sessionEmail && (
              <button
                className="btn btn-outline"
                id="btnLogout"
                onClick={onLogout}
              >
                Sair
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  const [pax, setPax] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(q);
  }

  return (
    <form
      id="searchForm"
      className="searchbar"
      role="search"
      aria-label="Busca"
      onSubmit={handleSubmit}
    >
      <label className="input">
        <span aria-hidden="true">🔎</span>
        <input
          id="q"
          name="q"
          placeholder="Prato ou restaurante (ex.: Pizza Margherita, Pizza Hut)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          required
        />
      </label>
      <label className="input">
        <span aria-hidden="true">📍</span>
        <input
          id="loc"
          name="loc"
          placeholder="Bairro ou cidade (opcional)"
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
        />
      </label>
      <label className="input">
        <span aria-hidden="true">👥</span>
        <input
          id="pax"
          name="pax"
          placeholder="2 pessoas"
          value={pax}
          onChange={(e) => setPax(e.target.value)}
        />
      </label>
      <button className="btn btn-primary">Pesquisar</button>
    </form>
  );
}

function CategoryGrid({ onClickCat }) {
  return (
    <ul className="grid-cats" aria-label="Categorias">
      <li>
        <button type="button" className="cat" onClick={() => onClickCat('pizza')}>
          🍕 Pizza
        </button>
      </li>
      <li>
        <button
          type="button"
          className="cat"
          onClick={() => onClickCat('hamburguer')}
        >
          🍔 Hambúrguer
        </button>
      </li>
      <li>
        <button type="button" className="cat" onClick={() => onClickCat('sushi')}>
          🍣 Sushi
        </button>
      </li>
      <li>
        <button type="button" className="cat" onClick={() => onClickCat('promo')}>
          💸 Promoções
        </button>
      </li>
    </ul>
  );
}

function FiltersBar({ onOrder, onEditSearch }) {
  return (
    <nav className="filters" aria-label="Filtros">
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onOrder('preco')}
      >
        Ordenar: menor preço
      </button>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onOrder('tempo')}
      >
        Menor tempo
      </button>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onOrder('avaliacao')}
      >
        Melhor avaliado
      </button>
      <button
        type="button"
        className="btn btn-outline"
        id="editSearch"
        onClick={onEditSearch}
      >
        Alterar busca
      </button>
    </nav>
  );
}

function RestaurantCard({ r, isFav, onOpenCompare, onToggleFav }) {
  const best = cheapest(r.ofertas);
  return (
    <li className="item">
      <figure className="thumb">
        <img src={r.img || '/img/placeholder.jpg'} alt={r.nome} />
      </figure>
      <section className="meta">
        <h3>{r.nome}</h3>
        <p className="muted details">
          <span>{r.tipo}</span>
          <span>· {r.distancia_km} km</span>
          <span>
            · {r.tempo_min}–{r.tempo_min + 10} min
          </span>
        </p>
        <p className="muted note">
          <span>
            Prato: <b>{r.prato}</b>
          </span>
          <span>· Nota ★ {r.rating.toFixed(1)}</span>
        </p>
      </section>
      <aside className="compare">
        <button className="btn btn-primary" onClick={() => {
          console.log("TESTE");
          onOpenCompare(r)}}>
          Comparar preços
        </button>
        <button
          className={`fav ${isFav ? 'is-active' : ''}`}
          onClick={() => onToggleFav(r.id)}
        >
          {isFav ? '💖 Favorito' : '🤍 Favoritar'}
        </button>
      </aside>
      <span className="price-pill price">
        A partir de <b>{currency(best.total)}</b>
      </span>
    </li>
  );
}

function RestaurantsList({ items, favs, onOpenCompare, onToggleFav }) {
  if (!items.length) {
    return (
      <ul className="list">
        <li className="item">
          <div className="meta">
            <h3>Nenhum favorito ainda</h3>
            <p className="muted">
              Clique em &quot;🤍 Favoritar&quot; nos resultados para salvar.
            </p>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <ul id="list" className="list" role="list">
      {items.map((r) => (
        <RestaurantCard
          key={r.id}
          r={r}
          isFav={favs.has(r.id)}
          onOpenCompare={onOpenCompare}
          onToggleFav={onToggleFav}
        />
      ))}
    </ul>
  );
}

function CompareDialog({ open, restaurant, onClose, onGoCheapest }) {
  if (!open || !restaurant) return null;

  const rows = Object.entries(restaurant.ofertas)
    .map(([app, o]) => ({ app, ...o, total: o.preco + o.frete }))
    .sort((a, b) => a.total - b.total);

  const best = rows[0];

  return (
    <div className="dialog-backdrop">
      <dialog open className="dialog" aria-label="Comparação de preços">
        <header className="modal-head">
          <section>
            <span className="pill" id="modalRestaurant">
              {restaurant.nome}
            </span>
            <h3 id="modalDish" style={{ margin: '6px 0 0' }}>
              {restaurant.prato}
            </h3>
          </section>
          <button className="x" id="closeDialog" aria-label="Fechar" onClick={onClose}>
            ✕
          </button>
        </header>

        <section className="modal-body">
          <table aria-label="Tabela de comparação">
            <thead>
              <tr>
                <th>App</th>
                <th>Preço</th>
                <th>Frete</th>
                <th>Tempo</th>
                <th>Promo</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody id="modalRows">
              {rows.map((o, idx) => {
                const bestRow = idx === 0;
                return (
                  <tr key={o.app}>
                    <td>
                      <span className={`badge ${bestRow ? 'best' : ''}`}>{o.app}</span>
                    </td>
                    <td>{currency(o.preco)}</td>
                    <td>
                      {o.frete === 0 ? (
                        <span className="free">Grátis</span>
                      ) : (
                        currency(o.frete)
                      )}
                    </td>
                    <td>{o.tempo} min</td>
                    <td>{o.promo || '—'}</td>
                    <td>
                      <b>{currency(o.total)}</b>{' '}
                      {bestRow && (
                        <span className="badge best" style={{ marginLeft: 6 }}>
                          Mais barato
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <footer className="modal-foot">
          <p className="muted">
            O menor total recebe o selo <b>Mais barato</b>.
          </p>
          <button
            className="btn btn-primary"
            id="btnGoCheapest"
            onClick={() => onGoCheapest(best, restaurant)}
          >
            Pedir no mais barato
          </button>
        </footer>
      </dialog>
    </div>
  );
}

function ConfirmSection({ data, onBack }) {
  if (!data) return null;
  return (
    <section id="confirm" aria-label="Confirmação">
      <article className="confirm">
        <section className="card">
          <h2>Economia feita 🎉</h2>
          <p id="confirmMsg" className="muted">
            Você escolheu <b>{data.restaurant.nome}</b> via <b>{data.app}</b> por{' '}
            <b>{currency(data.total)}</b>.
          </p>
          <nav className="actions" aria-label="Ações de confirmação">
            <a className="btn btn-primary" id="openApp" href={data.link}>
              Continuar para o app
            </a>
            <button className="btn btn-outline" id="backResults" onClick={onBack}>
              Voltar aos resultados
            </button>
          </nav>
        </section>
      </article>
    </section>
  );
}

export default function HomePage() {
  const [view, setView] = useState('home'); // 'home' | 'results' | 'confirm'
  const [sessionEmail, setSessionEmail] = useState(null);
  const [favs, setFavs] = useState(new Set());
  const [items, setItems] = useState(DB);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  // Carrega sessão e favoritos ao montar
  useEffect(() => {
    const sess = getSession();
    if (sess?.email) {
      setSessionEmail(sess.email);
      setFavs(loadFavs(sess.email));
    }
  }, []);

  function handleSearch(q) {
    setItems(searchDB(q));
    setView('results');
  }

  function handleClickCat(cat) {
    handleSearch(cat);
  }

  function handleOrder(by) {
    setItems(orderDB(by));
  }

  function handleEditSearch() {
    setView('home');
  }

  function handleShowFavs() {
    if (!sessionEmail) {
      window.location.href = '/login';
      return;
    }
    const favSet = loadFavs(sessionEmail);
    const favItems = DB.filter((r) => favSet.has(r.id));
    setItems(favItems);
    setView('results');
  }

  function handleOpenCompare(r) {
    setSelectedRestaurant(r);
    setCompareOpen(true);
  }

  function handleToggleFav(id) {
    if (!sessionEmail) {
      window.location.href = '/login';
      return;
    }
    const next = new Set(favs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavs(next);
    saveFavs(sessionEmail, next);
  }

  function handleGoCheapest(best, restaurant) {
    setConfirmData({
      restaurant,
      app: best.app,
      total: best.total,
      link: best.link || '#',
    });
    setCompareOpen(false);
    setView('confirm');
  }

  function handleLogout() {
    logout();
    setSessionEmail(null);
    setFavs(new Set());
    setView('home');
  }

  const showHome = view === 'home';
  const showResults = view === 'results';
  const showConfirm = view === 'confirm';

  return (
    <>
      <NavBar
        sessionEmail={sessionEmail}
        onLogout={handleLogout}
        onShowHome={() => setView('home')}
        onShowFavs={handleShowFavs}
      />

      <main className="container">
        {showHome && (
          <section id="home" className="hero" aria-label="Página inicial">
            <h2 className="title">Compare preços de delivery em um click</h2>
            <p className="subtitle">
              Veja <b>preço</b> + <b>frete</b> + <b>tempo</b> no iFood, Rappi e Uber Eats em
              um só lugar.
            </p>
            <SearchBar onSearch={handleSearch} />
            <CategoryGrid onClickCat={handleClickCat} />
          </section>
        )}

        {showResults && (
          <section id="results" aria-label="Resultados da busca">
            <FiltersBar onOrder={handleOrder} onEditSearch={handleEditSearch} />
            <section className="results-wrap" aria-label="Lista e mapa">
              <aside className="panel" aria-label="Lista de restaurantes">
                <RestaurantsList
                  items={items}
                  favs={favs}
                  onOpenCompare={handleOpenCompare}
                  onToggleFav={handleToggleFav}
                />
              </aside>
              <section className="panel" aria-label="Mapa (ilustrativo)">
                {/* Aqui você pode integrar o Google Maps com next/script depois. */}
                <section
                  id="map"
                  className="map"
                  role="region"
                  aria-label="Mapa de restaurantes"
                >
                  Mapa aqui (integrar Google Maps depois)
                </section>
              </section>
            </section>
          </section>
        )}

        {showConfirm && <ConfirmSection data={confirmData} onBack={() => setView('results')} />}

        <CompareDialog
          open={compareOpen}
          restaurant={selectedRestaurant}
          onClose={() => setCompareOpen(false)}
          onGoCheapest={handleGoCheapest}
        />
      </main>

      <footer className="container" style={{ color: '#9aa3af', paddingBottom: 36 }}>
        © 2025 Favoris — Protótipo educacional
      </footer>
    </>
  );
}
