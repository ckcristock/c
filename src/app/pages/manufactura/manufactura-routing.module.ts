import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisenoComponent } from './diseno/diseno.component';
import { IngenieriaComponent } from './ingenieria/ingenieria.component';
import { CrearOrdenProduccionComponent } from './ordenes-produccion/crear-orden-produccion/crear-orden-produccion.component';
import { OrdenesProduccionComponent } from './ordenes-produccion/ordenes-produccion.component';
import { VerOrdenProduccionComponent } from './ordenes-produccion/ver-orden-produccion/ver-orden-produccion.component';
import { ProduccionComponent } from './produccion/produccion.component';

const routes: Routes = [
  { path: 'ordenes-produccion', component: OrdenesProduccionComponent },
  { path: 'ordenes-produccion/crear', component: CrearOrdenProduccionComponent },
  { path: 'ordenes-produccion/ver/:id', component: VerOrdenProduccionComponent },
  { path: 'ordenes-produccion/editar/:id', component: CrearOrdenProduccionComponent },
  { path: 'ordenes-produccion/copiar/:id', component: CrearOrdenProduccionComponent },
  { path: 'ingenieria', component: IngenieriaComponent },
  { path: 'diseño', component: DisenoComponent },
  { path: 'produccion', component: ProduccionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManufacturaRoutingModule { }
