import { Pipe, PipeTransform } from '@angular/core';
// Un pipe transforma lo que se muestra sin cambiar el dato guardado.
@Pipe({ name: 'estadoReserva', standalone: true })
export class EstadoReservaPipe implements PipeTransform {
  transform(estado: string): string {
    const textos: Record<string, string> = { pendiente: '◷ Pendiente', aprobada: '✓ Aprobada', rechazada: '× Rechazada' };
    return textos[estado] ?? estado;
  }
}
