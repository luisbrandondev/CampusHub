import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: { default: 'CampusHub Labs', template: '%s | CampusHub' },
  description: 'Consulta nuestros laboratorios y el estado de tus reservas en CampusHub Labs.',
};

export default function Layout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="barra">
          <Link href="/" className="marca">
            CampusHub <span>LABS</span>
          </Link>
          <nav aria-label="Navegación principal">
            <Link href="/laboratorios">Laboratorios</Link>
            <Link href="/">Consultar reserva</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer>CampusHub Labs · Conoce tu próximo espacio.</footer>
      </body>
    </html>
  );
}
