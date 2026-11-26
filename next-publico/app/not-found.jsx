import Link from 'next/link';
export const metadata = {
  title: 'No encontrado',
  description: 'No encontramos el laboratorio o la reserva solicitada.',
};
export default function NoEncontrado() {
  return (
    <section className="panel">
      <p className="etiqueta">404</p>
      <h1>No encontramos ese registro.</h1>
      <p>Revisa el código de reserva o la dirección del laboratorio.</p>
      <Link href="/">Volver al inicio</Link>
    </section>
  );
}
