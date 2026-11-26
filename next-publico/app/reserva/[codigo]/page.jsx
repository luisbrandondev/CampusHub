import Link from 'next/link';
import { notFound } from 'next/navigation';
import { consultar } from '../../../lib/api.js';

export async function generateMetadata({ params }) {
  const { codigo } = await params;
  return {
    title: `Reserva ${codigo.toUpperCase()}`,
    description: 'Consulta pública del estado y horario de una reserva de CampusHub.',
  };
}

export default async function ReservaPublica({ params }) {
  const { codigo } = await params;
  if (!/^RES-\d{4,}$/i.test(codigo)) notFound();
  const reservas = await consultar(`/reservas?codigo=${encodeURIComponent(codigo.toUpperCase())}`);
  const reserva = reservas[0];
  if (!reserva) notFound();
  const lab = await consultar(`/laboratorios/${reserva.laboratorioId}`);
  // La consulta pública no muestra nombre, correo, contraseña ni motivo del estudiante.
  return (
    <>
      <p className="etiqueta">ESTADO DE TU SOLICITUD</p>
      <h1>{reserva.codigo}</h1>
      <section className="panel reserva">
        <span className={`estado ${reserva.estado}`}>{reserva.estado}</span>
        <h2>{lab?.nombre || 'Laboratorio no disponible'}</h2>
        <p>{lab?.sede}</p>
        <dl>
          <dt>Fecha</dt>
          <dd>{reserva.fecha}</dd>
          <dt>Horario</dt>
          <dd>
            {reserva.horaInicio}–{reserva.horaFin} · Hora de Perú
          </dd>
        </dl>
        <p>
          {reserva.estado === 'pendiente'
            ? 'Tu solicitud está esperando revisión.'
            : reserva.estado === 'aprobada'
              ? 'Tu solicitud fue aprobada.'
              : 'Tu solicitud fue rechazada.'}
        </p>
        <Link href="/">Consultar otra reserva →</Link>
      </section>
    </>
  );
}
