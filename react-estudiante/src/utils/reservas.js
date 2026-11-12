// Aplica las reglas del formulario y construye reservas con el núcleo JavaScript compartido.
import { esFecha, esHora } from '../core/validadores.js';
import { Reserva } from '../core/modelos.js';
import { crearGeneradorCodigos } from '../core/estadisticas.js';
import { inicioReserva } from './fechas.js';

// Devuelve errores por CAMPO para que el formulario los muestre bajo cada control.
export function validarFormularioReserva(valores, usuarioId, laboratorios, reservas, ahora = Date.now()) {
  // Cada clave coincide con el name del control: errores.fecha se muestra bajo Fecha.
  const errores = {};
  const laboratorio = laboratorios.find((l) => l.id === Number(valores.laboratorioId));
  if (!laboratorio) errores.laboratorioId = 'Selecciona un laboratorio del catálogo.';
  else if (laboratorio.estado !== 'disponible') errores.laboratorioId = 'Este laboratorio está en mantenimiento.';
  // Estas funciones vienen de core-js: verifican fechas reales y el formato HH:mm.
  if (!esFecha(valores.fecha)) errores.fecha = 'Selecciona una fecha válida.';
  if (!esHora(valores.horaInicio)) errores.horaInicio = 'Ingresa la hora de inicio en formato HH:mm.';
  if (!esHora(valores.horaFin)) errores.horaFin = 'Ingresa la hora final en formato HH:mm.';
  if (!errores.horaInicio && !errores.horaFin && valores.horaFin <= valores.horaInicio)
    errores.horaFin = 'La hora final debe ser posterior al inicio.';
  if (!valores.motivo?.trim() || valores.motivo.trim().length < 5)
    errores.motivo = 'Describe el motivo con al menos 5 caracteres.';
  else if (valores.motivo.trim().length > 200) errores.motivo = 'El motivo admite hasta 200 caracteres.';
  if (!errores.fecha && !errores.horaInicio && inicioReserva(valores) <= ahora)
    errores.fecha = 'La reserva debe comenzar en una fecha y hora futuras (hora de Perú).';
  // Solo construimos la clase cuando los campos son válidos; find busca el primer cruce.
  if (Object.keys(errores).length === 0) {
    const candidata = new Reserva({ ...valores, laboratorioId: Number(valores.laboratorioId), usuarioId });
    const cruce = reservas.find((otra) => candidata.seCruzaCon(otra));
    if (cruce)
      errores.horaInicio = `Se cruza con ${cruce.codigo} (${cruce.horaInicio} - ${cruce.horaFin}). Elige otro horario.`;
  }
  return errores;
}

// Genera los datos de la nueva solicitud, siempre pendiente y del usuario en sesión.
export function construirReserva(valores, usuarioId, reservas, ahora = new Date()) {
  // Un recorrido sencillo busca el mayor ID y el mayor número de código existentes.
  let mayorId = 0;
  let mayorCodigo = 0;
  for (const reserva of reservas) {
    const numeroCodigo = Number(reserva.codigo.replace('RES-', ''));
    if (reserva.id > mayorId) mayorId = reserva.id;
    if (numeroCodigo > mayorCodigo) mayorCodigo = numeroCodigo;
  }
  const siguienteCodigo = crearGeneradorCodigos(mayorCodigo + 1);
  const nueva = new Reserva({
    ...valores,
    motivo: valores.motivo.trim(),
    laboratorioId: Number(valores.laboratorioId),
    id: mayorId + 1,
    codigo: siguienteCodigo(),
    usuarioId,
    estado: 'pendiente',
    creadoEn: ahora.toISOString(),
  });
  // Copiamos sus datos a un objeto común para guardarlo en el estado React.
  return { ...nueva };
}
