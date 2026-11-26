import { Reserva } from './modelos.js';

export function fechaPeru(ahora = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(ahora);
}

// La hora final es exclusiva: 07–22 genera 15 bloques, hasta 21:00–22:00.
export function crearHoras(inicio = 7, fin = 22) {
  return Array.from(
    { length: fin - inicio },
    (_, i) => `${String(inicio + i).padStart(2, '0')}:00`,
  );
}

export function crearGrilla(laboratorios, reservas, fecha, inicio = 7, fin = 22) {
  const horas = crearHoras(inicio, fin);
  // Primer map: filas (laboratorios). Segundo map: columnas (horarios).
  return laboratorios.map((laboratorio) =>
    horas.map((horaInicio, indice) => {
      const horaFin = `${String(inicio + indice + 1).padStart(2, '0')}:00`;
      const bloque = new Reserva({
        laboratorioId: laboratorio.id,
        usuarioId: 1,
        fecha,
        horaInicio,
        horaFin,
      });
      const coincidentes = reservas.filter((reserva) => bloque.seCruzaCon(reserva));
      let estado = 'libre';
      if (coincidentes.some((reserva) => reserva.estado === 'pendiente')) estado = 'pendiente';
      if (coincidentes.some((reserva) => reserva.estado === 'aprobada')) estado = 'ocupada';
      // Mantenimiento también bloquea el uso; la celda indica el motivo.
      if (laboratorio.estado === 'mantenimiento') estado = 'ocupada';
      return { laboratorio, horaInicio, horaFin, estado, reservas: coincidentes };
    }),
  );
}

// Lunes a domingo de la semana actual en Perú, independiente de la zona horaria de la PC.
export function semanaPeru(ahora = new Date()) {
  const fecha = new Date(`${fechaPeru(ahora)}T12:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() - ((fecha.getUTCDay() + 6) % 7));
  const desde = fecha.toISOString().slice(0, 10);
  fecha.setUTCDate(fecha.getUTCDate() + 6);
  return { desde, hasta: fecha.toISOString().slice(0, 10) };
}
