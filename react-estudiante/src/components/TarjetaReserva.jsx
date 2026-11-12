// Presenta una reserva y avisa al padre cuando el estudiante confirma cancelarla.
import { Link } from 'react-router-dom';
import BadgeEstado from './BadgeEstado.jsx';
import { fechaLegible, inicioReserva } from '../utils/fechas.js';
import Icono from './Icono.jsx';
export default function TarjetaReserva({ reserva, laboratorio, onCancelar }) {
  const puedeCancelar = reserva.estado !== 'rechazada' && inicioReserva(reserva) > Date.now();
  // onCancelar es una función recibida por props: App es quien modifica la lista.
  function cancelar() {
    if (confirm(`¿Cancelar la reserva ${reserva.codigo}?`)) onCancelar(reserva.id);
  }
  return (
    <article className="reservation-card" aria-label={`Reserva ${reserva.codigo}`}>
      <div className="reservation-date" aria-hidden="true">
        <Icono nombre="calendar" size={27} />
        <strong>{reserva.fecha.slice(8)}</strong>
        <small>{reserva.fecha.slice(0, 7)}</small>
      </div>
      <div className="reservation-body">
        <div className="reservation-top">
          <span className="eyebrow">{reserva.codigo}</span>
          <BadgeEstado estado={reserva.estado} />
        </div>
        <h2>
          <Link to={`/catalogo/${reserva.laboratorioId}`}>{laboratorio?.nombre ?? 'Laboratorio'}</Link>
        </h2>
        <p className="reservation-meta">
          {fechaLegible(reserva.fecha)} · {reserva.horaInicio} - {reserva.horaFin} h
        </p>
        <p className="reservation-reason">{reserva.motivo}</p>
      </div>
      {puedeCancelar && (
        <button className="btn btn-outline-danger btn-sm" onClick={cancelar} aria-label={`Cancelar ${reserva.codigo}`}>
          Cancelar reserva
        </button>
      )}
    </article>
  );
}
