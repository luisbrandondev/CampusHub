import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { API_URL } from '../config/api.config';
import { DatosLaboratorio, Laboratorio, Reserva, Usuario } from '../modelos';

@Injectable({ providedIn: 'root' })
export class CampusService {
  private readonly http = inject(HttpClient);
  listarLaboratorios(sede = '', q = '') {
    let params = new HttpParams();
    if (sede) params = params.set('sede', sede);
    if (q.trim()) params = params.set('q', q.trim());
    return this.http.get<Laboratorio[]>(`${API_URL}/laboratorios`, { params });
  }
  obtenerLaboratorio(id: number) { return this.http.get<Laboratorio>(`${API_URL}/laboratorios/${id}`); }
  crearLaboratorio(datos: DatosLaboratorio) { return this.http.post<Laboratorio>(`${API_URL}/laboratorios`, datos); }
  actualizarLaboratorio(id: number, datos: DatosLaboratorio) { return this.http.put<Laboratorio>(`${API_URL}/laboratorios/${id}`, { ...datos, id }); }
  eliminarLaboratorio(id: number) { return this.http.delete<object>(`${API_URL}/laboratorios/${id}`); }
  listarReservas(usuarioId?: number, laboratorioId?: number) {
    let params = new HttpParams();
    if (usuarioId) params = params.set('usuarioId', usuarioId);
    if (laboratorioId) params = params.set('laboratorioId', laboratorioId);
    return this.http.get<Reserva[]>(`${API_URL}/reservas`, { params });
  }
  listarUsuarios() { return this.http.get<Usuario[]>(`${API_URL}/usuarios`); }
  mensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'No se pudo conectar con la API. Comprueba que npm run api esté activo en el puerto 3000.';
      if (error.status === 404) return 'El registro solicitado ya no existe.';
      return `La API respondió con el error ${error.status}. Intenta nuevamente.`;
    }
    return 'No se pudo completar la operación.';
  }
}
