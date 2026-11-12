// Muestra un mensaje cuando no hay resultados; children permite añadir un botón o enlace.
import Icono from './Icono.jsx';
export default function EstadoVacio({ titulo, descripcion, children }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icono nombre="calendar" size={30} />
      </div>
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
      {children}
    </div>
  );
}
