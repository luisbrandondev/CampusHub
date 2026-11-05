import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { esNombreLaboratorio } from '../../core/validadores.js';
// Adapta una validación de JS puro al contrato ValidatorFn de Angular.
export const nombreLaboratorioValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null; // required se encarga de los campos vacíos.
  return esNombreLaboratorio(control.value) ? null : { nombreLaboratorio: true };
};
