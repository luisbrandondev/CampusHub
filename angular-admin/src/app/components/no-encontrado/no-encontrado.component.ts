import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-no-encontrado', standalone: true, imports: [RouterLink],
  template: `<section class="panel state-box my-5"><div class="eyebrow">ERROR 404</div><h1>Página no encontrada</h1><p>La dirección no corresponde a una vista del panel.</p><a routerLink="/laboratorios" class="btn btn-primary">Volver a laboratorios</a></section>` })
export class NoEncontradoComponent {}
