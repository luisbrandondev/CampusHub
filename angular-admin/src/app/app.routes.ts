import { Routes } from '@angular/router';
import { LaboratorioListaComponent } from './components/laboratorio-lista/laboratorio-lista.component';
import { LaboratorioDetalleComponent } from './components/laboratorio-detalle/laboratorio-detalle.component';
import { LaboratorioFormularioComponent } from './components/laboratorio-formulario/laboratorio-formulario.component';
import { ReservaListaComponent } from './components/reserva-lista/reserva-lista.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
// Las rutas concretas van antes que :id para que "nuevo" no se interprete como ID.
export const routes: Routes = [
  { path: '', redirectTo: 'laboratorios', pathMatch: 'full' },
  { path: 'laboratorios', component: LaboratorioListaComponent, title: 'Laboratorios | CampusHub' },
  { path: 'laboratorios/nuevo', component: LaboratorioFormularioComponent, title: 'Nuevo laboratorio | CampusHub' },
  { path: 'laboratorios/:id/editar', component: LaboratorioFormularioComponent, title: 'Editar laboratorio | CampusHub' },
  { path: 'laboratorios/:id', component: LaboratorioDetalleComponent, title: 'Detalle | CampusHub' },
  { path: 'reservas', component: ReservaListaComponent, title: 'Reservas | CampusHub' },
  { path: '**', component: NoEncontradoComponent, title: 'Página no encontrada | CampusHub' }
];
