import { Reserva } from './modelos.js';

// reduce convierte muchas reservas en UN objeto acumulador con tres contadores.
export const reservasPorEstado = (reservas) => reservas.reduce((totales, reserva) => {
  if (Object.hasOwn(totales, reserva.estado)) totales[reserva.estado] += 1;
  return totales;
}, { pendiente: 0, aprobada: 0, rechazada: 0 });

// Ocupación = horas APROBADAS del conjunto recibido; no es un porcentaje.
export function ocupacionPorLaboratorio(reservas) {
  const horas = new Map();
  reservas.filter((reserva) => reserva.estado === 'aprobada').forEach((datos) => {
    const reserva = new Reserva(datos);
    horas.set(reserva.laboratorioId, (horas.get(reserva.laboratorioId) ?? 0) + reserva.duracionHoras());
  });
  return horas;
}

// map extrae las sedes y Set elimina las repetidas.
export const sedesUnicas = (laboratorios) => [...new Set(laboratorios.map((lab) => lab.sede))].sort((a, b) => a.localeCompare(b, 'es'));

export function rankingLaboratorios(laboratorios, reservas) {
  const cantidades = new Map();
  reservas.filter((reserva) => reserva.estado !== 'rechazada').forEach((reserva) => {
    cantidades.set(reserva.laboratorioId, (cantidades.get(reserva.laboratorioId) ?? 0) + 1);
  });
  // spread crea una copia: sort NO modifica el catálogo original.
  return [...laboratorios].map((lab) => ({ ...lab, totalReservas: cantidades.get(lab.id) ?? 0 }))
    .sort((a, b) => b.totalReservas - a.totalReservas || a.nombre.localeCompare(b.nombre, 'es'));
}

export function crearGeneradorCodigos(inicio = 1) {
  if (!Number.isSafeInteger(inicio) || inicio < 1) throw new RangeError('El inicio debe ser un entero positivo.');
  let siguiente = inicio;
  // Closure: la función recuerda "siguiente" aunque la función exterior ya terminó.
  return () => `RES-${String(siguiente++).padStart(4, '0')}`;
}
