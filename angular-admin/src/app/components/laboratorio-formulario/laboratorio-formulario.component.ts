import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampusService } from '../../services/campus.service';
import { DatosLaboratorio, EstadoLaboratorio } from '../../modelos';
import { nombreLaboratorioValidator } from '../../shared/nombre-laboratorio.validator';
import { validarLaboratorio } from '../../../core/validadores.js';

@Component({ selector: 'app-laboratorio-formulario', standalone: true,
  imports: [ReactiveFormsModule, RouterLink], templateUrl: './laboratorio-formulario.component.html' })
export class LaboratorioFormularioComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(CampusService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private consulta?: Subscription;
  private operacion?: Subscription;
  id?: number; cargando = false; guardando = false; cargaFallida = false; error = '';
  // Reactive Forms: el modelo del formulario vive en TypeScript.
  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, nombreLaboratorioValidator]],
    sede: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(/\S/)]],
    capacidad: [30, [Validators.required, Validators.min(1), Validators.max(60), Validators.pattern(/^\d+$/)]],
    equipos: ['', [Validators.required, Validators.maxLength(300), Validators.pattern(/\S/)]],
    estado: ['disponible' as EstadoLaboratorio, [Validators.required, Validators.pattern(/^(disponible|mantenimiento)$/)]]
  });
  ngOnInit() {
    const parametro = this.ruta.snapshot.paramMap.get('id');
    if (!parametro) return;
    this.id = Number(parametro);
    if (!Number.isInteger(this.id) || this.id < 1) { this.error = 'Identificador de laboratorio inválido.'; this.cargaFallida = true; return; }
    this.cargando = true;
    this.consulta = this.api.obtenerLaboratorio(this.id).subscribe({
      next: (lab) => { this.formulario.patchValue({ ...lab, equipos: lab.equipos.join(', ') }); this.cargando = false; },
      error: (error) => { this.error = this.api.mensajeError(error); this.cargando = false; this.cargaFallida = true; }
    });
  }
  invalido(campo: keyof typeof this.formulario.controls) {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }
  guardar() {
    if (this.guardando || this.cargando || this.cargaFallida) return;
    this.formulario.markAllAsTouched(); this.error = '';
    if (this.formulario.invalid) return;
    const valores = this.formulario.getRawValue();
    const datos: DatosLaboratorio = { ...valores, nombre: valores.nombre.trim(), sede: valores.sede.trim(),
      capacidad: Number(valores.capacidad), equipos: [...new Set(valores.equipos.split(',').map((equipo) => equipo.trim()).filter(Boolean))] };
    const errores = validarLaboratorio(datos);
    if (errores.length) { this.error = errores.join(' '); return; }
    this.guardando = true;
    const peticion = this.id ? this.api.actualizarLaboratorio(this.id, datos) : this.api.crearLaboratorio(datos);
    this.operacion = peticion.subscribe({
      next: () => this.router.navigate(['/laboratorios'], { state: { mensaje: `${datos.nombre} se ${this.id ? 'actualizó' : 'creó'} correctamente.` } }),
      error: (error) => { this.guardando = false; this.error = this.api.mensajeError(error); }
    });
  }
  ngOnDestroy() { this.consulta?.unsubscribe(); this.operacion?.unsubscribe(); }
}
