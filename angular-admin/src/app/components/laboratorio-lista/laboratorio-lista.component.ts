import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription, forkJoin, switchMap, throwError } from 'rxjs';
import { CampusService } from '../../services/campus.service';
import { Laboratorio } from '../../modelos';
import { ResaltarMantenimientoDirective } from '../../shared/resaltar-mantenimiento.directive';
import { sedesUnicas } from '../../../core/estadisticas.js';

@Component({
  selector: 'app-laboratorio-lista', standalone: true,
  imports: [NgClass, FormsModule, RouterLink, ResaltarMantenimientoDirective],
  templateUrl: './laboratorio-lista.component.html'
})
export class LaboratorioListaComponent implements OnInit, OnDestroy {
  private readonly api = inject(CampusService);
  private consulta?: Subscription;
  private operacion?: Subscription;
  laboratorios: Laboratorio[] = [];
  catalogo: Laboratorio[] = [];
  sedes: string[] = [];
  sede = ''; texto = ''; cargando = true; eliminando = false;
  error = ''; mensaje = '';
  get disponibles() { return this.catalogo.filter((lab) => lab.estado === 'disponible').length; }
  get mantenimiento() { return this.catalogo.length - this.disponibles; }
  get puestos() { return this.catalogo.reduce((total, lab) => total + lab.capacidad, 0); }
  ngOnInit() { this.mensaje = history.state?.mensaje ?? ''; this.cargar(); }
  cargar() {
    this.consulta?.unsubscribe(); // Evita que una búsqueda antigua sobrescriba la más reciente.
    this.cargando = true; this.error = '';
    this.consulta = forkJoin({ catalogo: this.api.listarLaboratorios(), filtrados: this.api.listarLaboratorios(this.sede, this.texto) }).subscribe({
      next: ({ catalogo, filtrados }) => { this.catalogo = catalogo; this.sedes = sedesUnicas(catalogo); this.laboratorios = filtrados; this.cargando = false; },
      error: (error) => { this.error = this.api.mensajeError(error); this.cargando = false; }
    });
  }
  limpiar() { this.texto = ''; this.sede = ''; this.cargar(); }
  eliminar(lab: Laboratorio) {
    if (this.eliminando || !confirm(`¿Eliminar ${lab.nombre}? Esta acción elimina el registro.`)) return;
    this.eliminando = true; this.error = ''; this.mensaje = '';
    // Conserva la referencia de las reservas existentes: elimina un lab nuevo para la demo.
    this.operacion = this.api.listarReservas(undefined, lab.id).pipe(switchMap((reservas) => {
      if (reservas.length) return throwError(() => new Error('CON_RESERVAS'));
      return this.api.eliminarLaboratorio(lab.id);
    })).subscribe({
      next: () => { this.eliminando = false; this.mensaje = `${lab.nombre} se eliminó correctamente.`; this.cargar(); },
      error: (error) => {
        this.eliminando = false;
        this.error = error?.message === 'CON_RESERVAS' ? 'Este laboratorio tiene reservas asociadas. Puedes editar su estado a mantenimiento. Para demostrar la eliminación, crea y elimina un laboratorio de prueba.' : this.api.mensajeError(error);
      }
    });
  }
  ngOnDestroy() { this.consulta?.unsubscribe(); this.operacion?.unsubscribe(); }
}
