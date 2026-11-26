import { Link } from 'react-router-dom';
import BadgeEstado from './BadgeEstado.jsx';
import Icono from './Icono.jsx';

export default function DetalleEspacio({ laboratorio }) {
  return (
    <section className="surface detail-surface">
      <div
        className={`lab-visual detail-visual lab-color-${laboratorio.id % 4}`}
        aria-hidden="true"
      >
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
          Capacidad para <strong>{laboratorio.capacidad} personas</strong>. Elige un horario
          disponible para desarrollar tu actividad académica.
        </p>
        <h3>Equipamiento disponible</h3>
        <ul className="equipment-detail">
          {laboratorio.equipos.map((equipo, indice) => (
            <li key={`${equipo}-${indice}`}>
              <Icono nombre="check" size={18} />
              {equipo}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
