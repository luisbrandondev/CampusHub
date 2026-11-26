// Muestra siempre una salida útil mientras esperamos o cuando falla una consulta.
export default function EstadoConsulta({ cargando, error, onActualizar }) {
  if (error) return (
    <div className="alert alert-danger" role="alert">
      {error} <button className="btn btn-outline-danger btn-sm" onClick={onActualizar}>Reintentar</button>
    </div>
  );
  if (cargando) return <p role="status">Cargando información...</p>;
  return null;
}
