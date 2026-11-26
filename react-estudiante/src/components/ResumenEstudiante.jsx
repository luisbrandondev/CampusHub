import { useEffect } from 'react';
import { useRequest } from 'alova/client';
import { pedirResumen } from '../services/resumen.js';
import { reservasPorEstado } from '../core/estadisticas.js';

export default function ResumenEstudiante({ usuarioId, revision }) {
  const { data, loading, error, send } = useRequest(() => pedirResumen(usuarioId), {
    initialData: [],
    immediate: false,
    // send(true) ignora la caché cuando el usuario pulsa Actualizar resumen.
    force: ({ args }) => Boolean(args[0]),
  });
  useEffect(() => {
    send().catch(() => {});
  }, [usuarioId, revision, send]);
  const conteos = reservasPorEstado(data);
  return (
    <section className="surface p-4 mb-4" aria-label="Resumen del estudiante">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Tu resumen</h2>
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={loading}
          onClick={() => send(true).catch(() => {})}
        >
          Actualizar resumen
        </button>
      </div>
      {loading ? (
        <p role="status">Cargando resumen...</p>
      ) : error ? (
        <p role="alert">No se pudo obtener el resumen. Intenta actualizar.</p>
      ) : data.length === 0 ? (
        <p>Aún no tienes reservas.</p>
      ) : (
        <div className="reservation-stats">
          {Object.entries(conteos).map(([estado, cantidad]) => (
            <div key={estado}>
              <strong>{cantidad}</strong>
              <span>{estado}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
