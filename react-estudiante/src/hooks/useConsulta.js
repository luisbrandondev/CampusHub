import { useEffect, useState } from 'react';
import { consultar } from '../services/api.js';

// Un hook reutilizable separa las consultas Fetch de los componentes visuales.
export function useConsulta(ruta) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    setCargando(true);
    setError('');
    setDatos(null);
    consultar(ruta, controlador.signal)
      .then(setDatos)
      .catch((fallo) => {
        if (!controlador.signal.aborted) setError(fallo.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });
    // Impide que una respuesta anterior reemplace los datos al cambiar de página.
    return () => controlador.abort();
  }, [ruta, version]);

  return { datos, cargando, error, actualizar: () => setVersion((valor) => valor + 1) };
}
