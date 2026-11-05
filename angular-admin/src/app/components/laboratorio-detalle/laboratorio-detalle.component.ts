import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { CampusService } from '../../services/campus.service';
import { Laboratorio, Reserva } from '../../modelos';
import { EstadoReservaPipe } from '../../shared/estado-reserva.pipe';
import { ResaltarMantenimientoDirective } from '../../shared/resaltar-mantenimiento.directive';
import { ocupacionPorLaboratorio } from '../../../core/estadisticas.js';
@Component({ selector: 'app-laboratorio-detalle', standalone: true,
  imports: [RouterLink, NgClass, EstadoReservaPipe, ResaltarMantenimientoDirective], templateUrl: './laboratorio-detalle.component.html' })
export class LaboratorioDetalleComponent implements OnInit, OnDestroy {
  private readonly api = inject(CampusService);
  private readonly ruta = inject(ActivatedRoute);
  private consulta?: Subscription;
  laboratorio?: Laboratorio; reservas: Reserva[] = []; horas = 0; cargando = true; error = '';
  ngOnInit() {
    const id = Number(this.ruta.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id < 1) { this.error = 'Identificador de laboratorio inválido.'; this.cargando = false; return; }
    this.consulta = forkJoin({ laboratorio: this.api.obtenerLaboratorio(id), reservas: this.api.listarReservas(undefined, id) }).subscribe({
      next: ({ laboratorio, reservas }) => { this.laboratorio = laboratorio; this.reservas = reservas; this.horas = ocupacionPorLaboratorio(reservas).get(id) ?? 0; this.cargando = false; },
      error: (error) => { this.error = this.api.mensajeError(error); this.cargando = false; }
    });
  }
  ngOnDestroy() { this.consulta?.unsubscribe(); }
}
