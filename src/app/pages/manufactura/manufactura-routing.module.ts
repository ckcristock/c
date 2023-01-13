import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisenoComponent } from './diseno/diseno.component';
import { IngenieriaComponent } from './ingenieria/ingenieria.component';
import { CrearOrdenProduccionComponent } from './ordenes-produccion/crear-orden-produccion/crear-orden-produccion.component';
import { OrdenesProduccionComponent } from './ordenes-produccion/ordenes-produccion.component';
import { ProduccionComponent } from './produccion/produccion.component';

const routes: Routes = [
  { path: 'ordenes-produccion', component: OrdenesProduccionComponent },
  { path: 'ordenes-produccion/crear', component: CrearOrdenProduccionComponent },
  { path: 'ingenieria', component: IngenieriaComponent },
  { path: 'diseño', component: DisenoComponent },
  { path: 'produccion', component: ProduccionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManufacturaRoutingModule { }
