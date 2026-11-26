import { useCallback, useEffect, useRef, useState } from 'react';
import { api, consultar } from '../services/api.js';
import { invalidarResumen } from '../services/resumen.js';
import { construirReserva, validarFormularioReserva } from '../utils/reservas.js';
import { inicioReserva } from '../utils/fechas.js';

// Centraliza lectura, creación y cancelación; las páginas reciben datos y funciones.
export function useReservas(usuarioId) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const operando = useRef(false);
  const consulta = useRef(null);
  const ultimaLista = useRef('');

  const actualizar = useCallback(async () => {
    consulta.current?.abort();
    const controlador = new AbortController();
    consulta.current = controlador;
    if (!usuarioId) { setDatos([]); setCargando(false); setError(''); return; }
    setCargando(true);
    setError('');
    try {
      const reservas = await consultar(`/reservas?usuarioId=${usuarioId}`, controlador.signal);
      setDatos(reservas);
      // Si Angular cambió un estado, el resumen también debe descartar su caché.
      const listaActual = JSON.stringify(reservas);
      if (listaActual !== ultimaLista.current) {
        ultimaLista.current = listaActual;
        invalidarResumen(usuarioId);
        setRevision((valor) => valor + 1);
      }
    } catch (fallo) {
      if (!controlador.signal.aborted) setError(fallo.message);
    } finally {
      if (!controlador.signal.aborted) setCargando(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    setDatos([]);
    ultimaLista.current = '';
    actualizar();
    // Angular puede aprobar una reserva mientras el estudiante mantiene esta página abierta.
    const intervalo = setInterval(actualizar, 15000);
    return () => { clearInterval(intervalo); consulta.current?.abort(); };
  }, [actualizar]);

  async function crear(valores) {
    if (!usuarioId) return { errores: { general: 'Inicia sesión para reservar.' } };
    if (operando.current) return { errores: { general: 'Espera a que termine la solicitud.' } };
    operando.current = true;
    try {
      // Consultamos TODAS las reservas: un horario ocupado por otro usuario también bloquea.
      const [laboratorios, reservas] = await Promise.all([consultar('/laboratorios'), consultar('/reservas')]);
      const errores = validarFormularioReserva(valores, usuarioId, laboratorios, reservas);
      if (Object.keys(errores).length) return { errores };
      const nueva = construirReserva(valores, usuarioId, reservas);
      delete nueva.id; // JSON Server asigna el identificador al persistir.
      const { data: reserva } = await api.post('/reservas', nueva);
      invalidarResumen(usuarioId);
      await actualizar();
      return { reserva };
    } catch (fallo) {
      return { errores: { general: fallo.message } };
    } finally {
      operando.current = false;
    }
  }

  async function cancelar(id) {
    if (operando.current) throw new Error('Espera a que termine la solicitud.');
    operando.current = true;
    try {
      const reserva = await consultar(`/reservas/${id}`);
      if (reserva.usuarioId !== usuarioId || reserva.estado === 'rechazada' || inicioReserva(reserva) <= Date.now()) {
        throw new Error('Solo puedes cancelar tus reservas activas futuras.');
      }
      await api.delete(`/reservas/${id}`);
      invalidarResumen(usuarioId);
      await actualizar();
    } finally {
      operando.current = false;
    }
  }

  return { datos, cargando, error, crear, cancelar, actualizar, revision };
}
