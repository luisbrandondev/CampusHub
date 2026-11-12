// Busca un laboratorio mediante el ID de la URL y muestra sus horarios ocupados.
import { Link, useParams } from 'react-router-dom';
import { useTitulo } from '../hooks/useTitulo.js';
import BadgeEstado from '../components/BadgeEstado.jsx';
import EstadoVacio from '../components/EstadoVacio.jsx';
import Icono from '../components/Icono.jsx';
import { fechaLegible, inicioReserva } from '../utils/fechas.js';
export default function DetalleLaboratorio({ laboratorios, reservas }) {
  // useParams lee texto de la URL; Number permite compararlo con el ID numérico.
  const { id } = useParams();
  const laboratorio = laboratorios.find((lab) => lab.id === Number(id));
  useTitulo(laboratorio?.nombre ?? 'Laboratorio no encontrado');
  if (!laboratorio)
    return (
      <EstadoVacio
        titulo="Laboratorio no encontrado"
        descripcion="El identificador no corresponde a un espacio del catálogo."
      >
        <Link to="/catalogo" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </EstadoVacio>
    );
  // Incluimos solicitudes activas que todavía no terminan, ordenadas por inicio.
  const ocupadas = reservas
    .filter(
      (r) =>
        r.laboratorioId === laboratorio.id &&
        r.estado !== 'rechazada' &&
        new Date(`${r.fecha}T${r.horaFin}:00-05:00`).getTime() > Date.now(),
    )
    .sort((a, b) => inicioReserva(a) - inicioReserva(b));
  return (
    <>
      <Link to="/catalogo" className="back-link">
        ← Volver al catálogo
      </Link>
      <header className="page-intro">
        <span className="eyebrow">CONOCE TU ESPACIO</span>
        <h1>{laboratorio.nombre}</h1>
        <p><Icono nombre="pin" size={18} /> {laboratorio.sede}</p>
      </header>
      <div className="row g-4">
        <div className="col-lg-7">
          <section className="surface detail-surface">
            <div className={`lab-visual detail-visual lab-color-${laboratorio.id % 4}`} aria-hidden="true">
              <Icono nombre="monitor" size={80} />
              <span>{laboratorio.nombre.replace('Lab ', '')}</span>
              <small>CAMPUSHUB LABS</small>
            </div>
            <div className="detail-copy">
              <div className="d-flex justify-content-between align-items-center">
                <h2>Un lugar para crear</h2>
                <BadgeEstado estado={laboratorio.estado} />
              </div>
              <p>
                Capacidad para <strong>{laboratorio.capacidad} personas</strong>. Elige un horario disponible para
                desarrollar tu actividad académica.
              </p>
              <h3>Equipamiento disponible</h3>
              <ul className="equipment-detail">
                {laboratorio.equipos.map((equipo, i) => (
                  <li key={`${equipo}-${i}`}>
                    <Icono nombre="check" size={18} />
                    {equipo}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
        <div className="col-lg-5">
          <section className="surface booking-side">
            <span className="eyebrow">PLANIFICA TU VISITA</span>
            <h2>Reserva este laboratorio</h2>
            <p>Selecciona la fecha, el horario y el motivo de tu actividad.</p>
            {laboratorio.estado === 'disponible' ? (
              <Link className="btn btn-primary w-100" to={`/nueva-reserva?laboratorio=${laboratorio.id}`}>
                Elegir un horario <Icono nombre="arrow" size={18} />
              </Link>
            ) : (
              <div className="alert alert-warning mb-0" role="status">
                Este espacio está en mantenimiento. Elige otro laboratorio.
              </div>
            )}
            <small>El acceso a la reserva requiere una sesión de estudiante.</small>
          </section>
          <section className="surface booking-side mt-4">
            <h2>Horarios ya solicitados</h2>
            {ocupadas.length ? (
              <ul className="schedule-list">
                {ocupadas.map((r) => (
                  <li key={r.id}>
                    <div>
                      <strong>{fechaLegible(r.fecha)}</strong>
                      <span>
                        {r.horaInicio} - {r.horaFin} h
                      </span>
                    </div>
                    <BadgeEstado estado={r.estado} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-0">No hay solicitudes activas futuras para este espacio.</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
