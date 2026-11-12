// Recibe una lista por props y crea una tarjeta por laboratorio, o un mensaje vacío.
import TarjetaLaboratorio from './TarjetaLaboratorio.jsx';
import EstadoVacio from './EstadoVacio.jsx';
export default function ListaLaboratorios({ laboratorios, onLimpiar }) {
  // Renderizado condicional: una lista vacía necesita un mensaje, no tarjetas.
  if (!laboratorios.length)
    return (
      <EstadoVacio titulo="No encontramos laboratorios" descripcion="Prueba con otra sede o cambia tu búsqueda.">
        {onLimpiar && (
          <button className="btn btn-outline-primary" onClick={onLimpiar}>
            Limpiar filtros
          </button>
        )}
      </EstadoVacio>
    );
  return (
    <div className="row g-4 lab-grid">
      {/* map crea elementos JSX; key permite a React reconocer cada laboratorio. */}
      {laboratorios.map((lab) => (
        <div key={lab.id} className="col-md-6 col-xl-4">
          <TarjetaLaboratorio laboratorio={lab} />
        </div>
      ))}
    </div>
  );
}
