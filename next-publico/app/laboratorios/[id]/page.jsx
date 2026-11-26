import Link from 'next/link';
import { notFound } from 'next/navigation';
import { consultar } from '../../../lib/api.js';
import { semanaPeru } from '../../../../core-js/disponibilidad.js';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const lab = await consultar(`/laboratorios/${encodeURIComponent(id)}`);
  return {
    title: lab?.nombre || 'Laboratorio no encontrado',
    description: lab
      ? `${lab.nombre} en ${lab.sede}: ${lab.capacidad} puestos y reservas aprobadas de esta semana.`
      : 'El laboratorio solicitado no existe.',
  };
}

export default async function Detalle({ params }) {
  const { id } = await params;
  const lab = await consultar(`/laboratorios/${encodeURIComponent(id)}`);
  if (!lab) notFound();
  const { desde, hasta } = semanaPeru();
  const reservas = await consultar(
    `/reservas?laboratorioId=${lab.id}&estado=aprobada&fecha_gte=${desde}&fecha_lte=${hasta}&_sort=fecha,horaInicio`,
  );
  return (
    <>
      <Link href="/laboratorios">← Volver al catálogo</Link>
      <p className="etiqueta espacio">CONOCE TU ESPACIO</p>
      <h1>{lab.nombre}</h1>
      <p className="intro">
        {lab.sede} · {lab.capacidad} puestos
      </p>
      <div className="dos-columnas">
        <section className="panel">
          <span className={`estado ${lab.estado}`}>{lab.estado}</span>
          <h2>Un lugar para crear</h2>
          <p>Equipamiento disponible:</p>
          <ul>
            {lab.equipos.map((equipo) => (
              <li key={equipo}>{equipo}</li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2>Reservas aprobadas de la semana</h2>
          <p>
            {desde} al {hasta} · Hora de Perú
          </p>
          {reservas.length ? (
            <ul className="horarios">
              {reservas.map((reserva) => (
                <li key={reserva.id}>
                  <strong>{reserva.fecha}</strong>
                  <span>
                    {reserva.horaInicio}–{reserva.horaFin}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay reservas aprobadas esta semana.</p>
          )}
        </section>
      </div>
    </>
  );
}
