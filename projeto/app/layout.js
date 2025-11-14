// app/layout.js
import './global.css';

export const metadata = {
  title: 'Favoris — Comparador de Delivery',
  description: 'Compare preços de delivery em um só lugar',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}