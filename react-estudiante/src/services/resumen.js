import { createAlova, invalidateCache } from 'alova';
import adapterFetch from 'alova/fetch';
import ReactHook from 'alova/react';
import { API_URL, mensajeHttp } from './api.js';

const alova = createAlova({
  baseURL: API_URL,
  statesHook: ReactHook,
  requestAdapter: adapterFetch(),
  responded: async (respuesta) => {
    if (!respuesta.ok) throw new Error(mensajeHttp(respuesta.status));
    return respuesta.json();
  },
});

// Cada estudiante tiene una entrada distinta de caché, válida durante 30 segundos.
export const pedirResumen = (usuarioId) => alova.Get(`/reservas?usuarioId=${usuarioId}`, { cacheFor: 30000 });
export const invalidarResumen = (usuarioId) => invalidateCache(pedirResumen(usuarioId));
