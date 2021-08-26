import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VacantesComponent } from './vacantes/vacantes.component';
import { VacantesCrearComponent } from './vacantes/vacantes-crear/vacantes-crear.component';
import { LlegadasTardesComponent } from './llegadas-tardes/llegadas-tardes.component';
import { VacantesVerComponent } from './vacantes/vacantes-ver/vacantes-ver.component';
import { NovedadesComponent } from './novedades/novedades.component';
import { DotacionesComponent } from './dotacion/dotaciones/dotaciones.component';
import { InventarioDotacionComponent } from './dotacion/inventario-dotacion/inventario-dotacion.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { AsignacionTurnosComponent } from './asignacion-turnos/asignacion-turnos.component';

const routes: Routes = [
  { path: 'vacantes', component: VacantesComponent },
  { path: 'vacantes-crear', component: VacantesCrearComponent },
  { path: 'vacantes-ver/:id', component: VacantesVerComponent },
  { path: 'actividades', component: ActividadesComponent },
  { path: 'novedades', component: NovedadesComponent },
  { path: 'llegadas-tarde', component: LlegadasTardesComponent },
  { path: 'dotacion/dotaciones', component: DotacionesComponent },
  { path: 'dotacion/inventario', component: InventarioDotacionComponent },

  { path: 'turnos/asignacion', component: AsignacionTurnosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RrhhRouterModule {}
