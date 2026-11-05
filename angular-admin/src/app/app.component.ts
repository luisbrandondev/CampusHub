import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
@Component({
  selector: 'app-root', standalone: true, imports: [RouterOutlet, NavbarComponent],
  template: `<a class="visually-hidden-focusable skip-link" href="#contenido">Saltar al contenido</a>
    <app-navbar />
    <main id="contenido" class="container-xxl page-shell"><router-outlet /></main>
    <footer class="container-xxl app-footer"><span>CampusHub Labs · Gestión de espacios</span><span>JavaScript Avanzado / Semana 13</span></footer>`
})
export class AppComponent {}
