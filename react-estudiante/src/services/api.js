// Todas las consultas usan la misma dirección; se puede cambiar con VITE_API_URL.
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function mensajeHttp(estado) {
  if (estado === 404) return 'El registro solicitado no existe.';
  if (estado === 409) return 'El horario ya está ocupado. Elige otro.';
  if (estado === 400) return 'Revisa los datos enviados.';
  if (estado === 401 || estado === 403) return 'No tienes permiso para realizar esta acción.';
  return `No se pudo completar la solicitud (HTTP ${estado}).`;
}

// Fetch no considera un 404 como una excepción: por eso comprobamos ok.
export async function consultar(ruta, signal) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, { signal, cache: 'no-store' });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('No se pudo conectar con la API. Comprueba el puerto 3000.');
  }
  if (!respuesta.ok) throw new Error(mensajeHttp(respuesta.status));
  return respuesta.json();
}

export const api = axios.create({ baseURL: API_URL, timeout: 10000 });

// El interceptor concentra la traducción de errores de todas las operaciones Axios.
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) =>
    Promise.reject(
      new Error(
        error.response
          ? mensajeHttp(error.response.status)
          : 'No se pudo conectar con la API. Intenta nuevamente.',
      ),
    ),
);
