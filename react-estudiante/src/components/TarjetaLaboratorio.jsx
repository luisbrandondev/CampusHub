// Presenta un laboratorio recibido por props y enlaza a su detalle.
import { Link } from 'react-router-dom';
import BadgeEstado from './BadgeEstado.jsx';
import Icono from './Icono.jsx';
export default function TarjetaLaboratorio({ laboratorio }) {
  // Desestructurar extrae las propiedades del objeto recibido del padre.
  const { id, nombre, sede, capacidad, equipos, estado } = laboratorio;
  return (
    <article className="lab-card" aria-label={nombre}>
      <div className={`lab-visual lab-color-${id % 4}`} aria-hidden="true">
        <Icono nombre="monitor" size={47} />
        <span>{nombre.replace('Lab ', '')}</span>
        <small>ESPACIO DE APRENDIZAJE</small>
      </div>
      <div className="lab-body">
        <div className="d-flex justify-content-between align-items-center gap-2">
          <h3>{nombre}</h3>
          <BadgeEstado estado={estado} />
        </div>
        <div className="lab-location">
          <Icono nombre="pin" size={15} />
          {sede}
          <span>·</span>
          <Icono nombre="users" size={15} />
          {capacidad} puestos
        </div>
        <div className="equipment-list">
          {equipos.map((equipo, index) => (
            <span key={`${equipo}-${index}`}>{equipo}</span>
          ))}
        </div>
        <Link className="lab-detail-link" to={`/catalogo/${id}`} aria-label={`Ver detalle de ${nombre}`}>
          Explorar laboratorio <Icono nombre="arrow" size={18} />
        </Link>
      </div>
    </article>
  );
}
