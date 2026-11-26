const API_URL = process.env.API_URL || 'http://127.0.0.1:3000';

// Esta función se ejecuta en el servidor de Next: los datos llegan dentro del HTML.
export async function consultar(ruta) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (respuesta.status === 404) return null;
  if (!respuesta.ok) throw new Error(`La API respondió con HTTP ${respuesta.status}.`);
  return respuesta.json();
}
