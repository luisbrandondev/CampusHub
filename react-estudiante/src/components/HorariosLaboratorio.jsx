import BadgeEstado from './BadgeEstado.jsx';
import EstadoConsulta from './EstadoConsulta.jsx';
import { fechaLegible } from '../utils/fechas.js';

export default function HorariosLaboratorio({ consulta, reservas }) {
  return (
    <section className="surface booking-side mt-4">
      <h2>Horarios ya solicitados</h2>
      <EstadoConsulta {...consulta} onActualizar={consulta.actualizar} />
      {!consulta.cargando &&
        !consulta.error &&
        (reservas.length ? (
          <ul className="schedule-list">
            {reservas.map((reserva) => (
              <li key={reserva.id}>
                <div>
                  <strong>{fechaLegible(reserva.fecha)}</strong>
                  <span>
                    {reserva.horaInicio} - {reserva.horaFin} h
                  </span>
                </div>
                <BadgeEstado estado={reserva.estado} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-0">No hay solicitudes activas futuras para este espacio.</p>
        ))}
    </section>
  );
}
