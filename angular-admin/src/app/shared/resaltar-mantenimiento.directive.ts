import { Directive, HostBinding, Input } from '@angular/core';
// Directiva de atributo: añade una clase visual al elemento que la recibe.
@Directive({ selector: '[appResaltarMantenimiento]', standalone: true })
export class ResaltarMantenimientoDirective {
  @Input() appResaltarMantenimiento = '';
  @HostBinding('class.en-mantenimiento') get enMantenimiento() {
    return this.appResaltarMantenimiento === 'mantenimiento';
  }
}
