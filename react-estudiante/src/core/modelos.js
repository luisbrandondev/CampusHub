import { validarUsuario, validarLaboratorio, validarReserva } from './validadores.js';

// Esta función centraliza la conversión de una lista de errores en una excepción.
function exigirValidez(errores) {
  if (errores.length) throw new TypeError(errores.join(' '));
}

const aMinutos = (hora) => {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
};

export class Usuario {
  constructor({ id, nombre, correo, codigo, rol = 'estudiante', password = '' }) {
    exigirValidez(validarUsuario({ nombre, correo, codigo, rol }));
    Object.assign(this, { id, nombre: nombre.trim(), correo, codigo, rol, password });
  }
  get etiqueta() { return `${this.nombre} (${this.codigo})`; }
  esAdministrador() { return this.rol === 'admin'; }
  // Permite presentar un perfil sin incluir la contraseña de demostración.
  perfilPublico() {
    const { password, ...perfil } = this;
    return perfil;
  }
}

export class Laboratorio {
  constructor({ id, nombre, sede, capacidad, equipos, estado = 'disponible' }) {
    exigirValidez(validarLaboratorio({ nombre, sede, capacidad, equipos, estado }));
    Object.assign(this, { id, nombre: nombre.trim(), sede: sede.trim(), capacidad,
      equipos: [...new Set(equipos.map((equipo) => equipo.trim()))], estado });
  }
  get etiqueta() { return `${this.nombre} - ${this.sede}`; }
  estaDisponible() { return this.estado === 'disponible'; }
  admitePersonas(cantidad) { return Number.isInteger(cantidad) && cantidad > 0 && cantidad <= this.capacidad; }
}

export class Reserva {
  constructor({ id, codigo = '', laboratorioId, usuarioId, fecha, horaInicio, horaFin,
    motivo = '', estado = 'pendiente', creadoEn = new Date().toISOString() }) {
    exigirValidez(validarReserva({ laboratorioId, usuarioId, fecha, horaInicio, horaFin, estado }));
    Object.assign(this, { id, codigo, laboratorioId, usuarioId, fecha, horaInicio, horaFin, motivo, estado, creadoEn });
  }
  get activa() { return this.estado !== 'rechazada'; }
  get horario() { return `${this.horaInicio} - ${this.horaFin}`; }
  duracionHoras() { return (aMinutos(this.horaFin) - aMinutos(this.horaInicio)) / 60; }
  seCruzaCon(otra) {
    // Intervalos [inicio, fin): 08:00-10:00 y 10:00-11:00 son contiguos.
    // Una solicitud rechazada no bloquea disponibilidad.
    return this.activa && otra.estado !== 'rechazada'
      && this.laboratorioId === otra.laboratorioId && this.fecha === otra.fecha
      && aMinutos(this.horaInicio) < aMinutos(otra.horaFin)
      && aMinutos(otra.horaInicio) < aMinutos(this.horaFin);
  }
}
