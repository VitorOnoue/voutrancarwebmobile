'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadUsers, saveUsers, setSession } from '../../lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const mail = email.trim().toLowerCase();
    if (!mail || !password) {
      alert('Preencha e-mail e senha');
      return;
    }

    const users = loadUsers() || [];
    if (users.find((u) => u.email === mail)) {
      alert('E-mail já cadastrado. Faça login.');
      router.push('/login');
      return;
    }

    users.push({ email: mail, password });
    saveUsers(users);
    setSession({ email: mail });

    try {
      await fetch('/api/csv/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mail, password }),
      });
    } catch (err) {
      console.warn('TESTE123', err);
    }

    router.push('/');
  }

  return (
    <main className="container">
      <section className="hero" aria-label="Cadastro">
        <h2 className="title">Crie sua conta</h2>
        <p className="subtitle">Seus dados ficam salvos no seu navegador (somente na sua máquina).</p>

        <form id="formRegister" className="auth-form card-like" onSubmit={handleSubmit}>
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

          <button className="btn btn-primary" type="submit">Criar conta</button>

          <p className="muted">
            Já tem conta? <Link href="/login">Entre aqui</Link>.
          </p>
        </form>
      </section>
    </main>
  );
}
