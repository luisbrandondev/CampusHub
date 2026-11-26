import Link from 'next/link';
import BuscadorReserva from '../components/BuscadorReserva.jsx';

export const metadata = {
  title: 'Consulta pública',
  description: 'Encuentra un laboratorio y consulta tu reserva por código sin iniciar sesión.',
};

export default function Inicio() {
  return (
    <>
      <section className="hero">
        <p className="etiqueta">TU CAMPUS, ABIERTO A TUS IDEAS</p>
        <h1>Un espacio para<br /><em>lo que viene.</em></h1>
        <p className="intro">Conoce nuestros laboratorios y revisa el estado de tu solicitud.</p>
        <Link className="boton" href="/laboratorios">Explorar laboratorios →</Link>
      </section>
      <section className="panel consulta">
        <div><p className="etiqueta">SIGUE TU SOLICITUD</p><h2>Consulta tu reserva</h2><p>Solo necesitas el código que recibiste al reservar.</p></div>
        <BuscadorReserva />
      </section>
    </>
  );
}
