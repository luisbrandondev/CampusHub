// Interfaces: TypeScript comprueba la forma de los datos mientras programamos.
// No reemplazan las validaciones que se ejecutan en el formulario.
export interface Usuario {
  id: number; nombre: string; correo: string; codigo: string;
  rol: 'estudiante' | 'admin'; password: string;
}
export type EstadoLaboratorio = 'disponible' | 'mantenimiento';
export interface Laboratorio {
  id: number; nombre: string; sede: string; capacidad: number;
  equipos: string[]; estado: EstadoLaboratorio;
}
export type EstadoReserva = 'pendiente' | 'aprobada' | 'rechazada';
export interface Reserva {
  id: number; codigo: string; laboratorioId: number; usuarioId: number;
  fecha: string; horaInicio: string; horaFin: string; motivo: string;
  estado: EstadoReserva; creadoEn: string;
}
export type DatosLaboratorio = Omit<Laboratorio, 'id'>;
