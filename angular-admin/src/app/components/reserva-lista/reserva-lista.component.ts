import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { CampusService } from '../../services/campus.service';
import { Laboratorio, Reserva, Usuario } from '../../modelos';
import { EstadoReservaPipe } from '../../shared/estado-reserva.pipe';
import { reservasPorEstado, rankingLaboratorios } from '../../../core/estadisticas.js';

@Component({ selector: 'app-reserva-lista', standalone: true,
  imports: [NgClass, FormsModule, RouterLink, EstadoReservaPipe], templateUrl: './reserva-lista.component.html' })
export class ReservaListaComponent implements OnInit, OnDestroy {
  private readonly api = inject(CampusService);
  private consulta?: Subscription;
  reservas: Reserva[] = []; laboratorios: Laboratorio[] = []; usuarios: Usuario[] = [];
  usuarioId = ''; estado = ''; laboratorioId = ''; cargando = true; error = '';
  conteos = { pendiente: 0, aprobada: 0, rechazada: 0 };
  favorito = 'Sin solicitudes activas';
  get estudiantes() { return this.usuarios.filter((u) => u.rol === 'estudiante'); }
  get visibles() { return this.reservas.filter((r) => (!this.estado || r.estado === this.estado) && (!this.laboratorioId || r.laboratorioId === Number(this.laboratorioId))); }
  nombreLaboratorio(id: number) { return this.laboratorios.find((lab) => lab.id === id)?.nombre ?? `Laboratorio #${id}`; }
  nombreUsuario(id: number) { return this.usuarios.find((usuario) => usuario.id === id)?.nombre ?? `Usuario #${id}`; }
  ngOnInit() { this.cargar(); }
  cargar() {
    this.consulta?.unsubscribe(); this.cargando = true; this.error = '';
    this.consulta = forkJoin({ reservas: this.api.listarReservas(this.usuarioId ? Number(this.usuarioId) : undefined), laboratorios: this.api.listarLaboratorios(), usuarios: this.api.listarUsuarios() }).subscribe({
      next: ({ reservas, laboratorios, usuarios }) => {
        this.reservas = reservas; this.laboratorios = laboratorios; this.usuarios = usuarios;
        this.conteos = reservasPorEstado(reservas);
        const ranking = rankingLaboratorios(laboratorios, reservas);
        this.favorito = ranking[0]?.totalReservas ? `${ranking[0].nombre} · ${ranking[0].totalReservas} solicitudes activas` : 'Sin solicitudes activas';
        this.cargando = false;
      },
      error: (error) => { this.error = this.api.mensajeError(error); this.cargando = false; }
    });
  }
  limpiar() { this.usuarioId = ''; this.estado = ''; this.laboratorioId = ''; this.cargar(); }
  ngOnDestroy() { this.consulta?.unsubscribe(); }
}
