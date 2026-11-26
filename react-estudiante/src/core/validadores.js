// Una expresión regular describe qué forma debe tener un texto.
export const esCorreoUTP = (valor) => typeof valor === 'string' && /^[a-z0-9._%+-]+@utp\.edu\.pe$/i.test(valor);
export const esCodigoAlumno = (valor) => typeof valor === 'string' && /^U\d{8}$/.test(valor);
export const esHora = (valor) => typeof valor === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(valor);

// La regex comprueba el formato; la segunda parte impide fechas como 2026-02-30.
export function esFecha(valor) {
  if (typeof valor !== 'string' || !/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00.000Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
}

// Se exporta para reutilizar la MISMA regla en el validador propio de Angular.
export const PATRON_NOMBRE_LABORATORIO = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .()\/-]{2,59}$/;
export const esNombreLaboratorio = (valor) => typeof valor === 'string' && PATRON_NOMBRE_LABORATORIO.test(valor.trim());
const esId = (valor) => Number.isInteger(valor) && valor > 0;

// Los mensajes usan template literals: las comillas invertidas permiten ${valor}.
export function validarUsuario(usuario) {
  const errores = [];
  if (!usuario.nombre?.trim()) errores.push(`El nombre del usuario es obligatorio.`);
  if (!esCorreoUTP(usuario.correo)) errores.push(`El correo "${usuario.correo}" debe terminar en @utp.edu.pe.`);
  const codigoValido = usuario.rol === 'admin' ? /^A\d{8}$/.test(usuario.codigo ?? '') : esCodigoAlumno(usuario.codigo);
  if (!codigoValido) errores.push(`El código "${usuario.codigo}" debe tener ${usuario.rol === 'admin' ? 'A' : 'U'} y 8 dígitos.`);
  if (!['estudiante', 'admin'].includes(usuario.rol)) errores.push(`El rol "${usuario.rol}" no es válido.`);
  return errores;
}

export function validarLaboratorio(laboratorio) {
  const errores = [];
  if (!esNombreLaboratorio(laboratorio.nombre)) errores.push(`El nombre "${laboratorio.nombre}" debe tener de 3 a 60 caracteres permitidos.`);
  if (!laboratorio.sede?.trim()) errores.push(`La sede es obligatoria.`);
  if (!Number.isInteger(laboratorio.capacidad) || laboratorio.capacidad < 1 || laboratorio.capacidad > 60) errores.push(`La capacidad ${laboratorio.capacidad} debe ser un entero entre 1 y 60.`);
  if (!Array.isArray(laboratorio.equipos) || laboratorio.equipos.length === 0 || laboratorio.equipos.some((equipo) => typeof equipo !== 'string' || !equipo.trim())) errores.push(`Registra al menos un equipo con nombre válido.`);
  if (!['disponible', 'mantenimiento'].includes(laboratorio.estado)) errores.push(`El estado "${laboratorio.estado}" no es válido.`);
  return errores;
}

export function validarReserva(reserva) {
  const errores = [];
  if (!esId(reserva.laboratorioId)) errores.push(`El laboratorio ${reserva.laboratorioId} no es válido.`);
  if (!esId(reserva.usuarioId)) errores.push(`El usuario ${reserva.usuarioId} no es válido.`);
  if (!esFecha(reserva.fecha)) errores.push(`La fecha "${reserva.fecha}" debe existir y usar AAAA-MM-DD.`);
  if (!esHora(reserva.horaInicio)) errores.push(`La hora inicial "${reserva.horaInicio}" debe usar HH:mm.`);
  if (!esHora(reserva.horaFin)) errores.push(`La hora final "${reserva.horaFin}" debe usar HH:mm.`);
  // En HH:mm de dos dígitos, el orden alfabético coincide con el orden horario.
  if (esHora(reserva.horaInicio) && esHora(reserva.horaFin) && reserva.horaFin <= reserva.horaInicio) errores.push(`La hora final ${reserva.horaFin} debe ser mayor que ${reserva.horaInicio}.`);
  if (!['pendiente', 'aprobada', 'rechazada'].includes(reserva.estado ?? 'pendiente')) errores.push(`El estado "${reserva.estado}" no es válido.`);
  return errores;
}
