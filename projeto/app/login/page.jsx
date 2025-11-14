'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadUsers, setSession } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const mail = email.trim().toLowerCase();
    const users = loadUsers() || [];
    const ok = users.find((u) => u.email === mail && u.password === password);
    if (!ok) {
      alert('Credenciais inválidas');
      return;
    }
    setSession({ email: mail });
    router.push('/');
  }

  return (
    <main className="container">
      <section className="hero" aria-label="Login">
        <h2 className="title">Acesse sua conta</h2>
        <p className="subtitle">Entre para gerenciar seus favoritos e continuar de onde parou.</p>

        <form id="formLogin" className="auth-form card-like" onSubmit={handleSubmit}>
          <label className="input">
            <span>📧</span>
            <input
              name="email"
              type="email"
              placeholder="email@exemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="input">
            <span>🔒</span>
            <input
              name="password"
              type="password"
              placeholder="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" type="submit">Entrar</button>

          <p className="muted">
            Não tem conta? <Link href="/register">Crie aqui</Link>.
          </p>
        </form>
      </section>
    </main>
  );
}
