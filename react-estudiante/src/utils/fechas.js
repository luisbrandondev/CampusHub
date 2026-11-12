// El campus está en Perú (UTC-05). No dependemos de la zona horaria de la PC.
export function inicioReserva(reserva) {
  return new Date(`${reserva.fecha}T${reserva.horaInicio}:00-05:00`).getTime();
}
// Desplaza cinco horas el reloj UTC para obtener el día del campus.
export function fechaCampus(ahora = new Date()) {
  return new Date(ahora.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
// Convierte AAAA-MM-DD en una fecha para leer, por ejemplo "12 de noviembre de 2026".
export function fechaLegible(fecha) {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Lima',
  }).format(new Date(`${fecha}T12:00:00-05:00`));
}
// floor calcula unidades completas; % obtiene lo que sobra en la unidad siguiente.
export function tiempoRestante(milisegundos) {
  const segundos = Math.max(0, Math.ceil(milisegundos / 1000));
  return {
    dias: Math.floor(segundos / 86400),
    horas: Math.floor(segundos / 3600) % 24,
    minutos: Math.floor(segundos / 60) % 60,
    segundos: segundos % 60,
  };
}
// Recorre la lista y conserva la reserva futura más cercana del estudiante.
export function buscarProxima(reservas, usuarioId, ahora = Date.now()) {
  let proxima = null;
  for (const reserva of reservas) {
    const esPropia = reserva.usuarioId === usuarioId;
    const estaActiva = reserva.estado !== 'rechazada';
    const esFutura = inicioReserva(reserva) > ahora;
    if (!esPropia || !estaActiva || !esFutura) continue;
    if (proxima === null || inicioReserva(reserva) < inicioReserva(proxima)) {
      proxima = reserva;
    }
  }
  return proxima;
}
