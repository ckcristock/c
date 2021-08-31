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
import { HorasExtrasComponent } from './horas-extras/horas-extras.component';
import { ContratosComponent } from './contratos/contratos.component';
import { PreliquidadosComponent } from './preliquidados/preliquidados.component';
import { LiquidadosComponent } from './preliquidados/liquidados/liquidados.component';
import { AlertasComunComponent } from './alertas-comun/alertas-comun.component';
import { DisciplinariosComponent } from './procesos/disciplinarios/disciplinarios.component';
import { MemorandosComponent } from './procesos/memorandos/memorandos.component';

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
  { path: 'turnos/horas-extras', component: HorasExtrasComponent },
  { path: 'alertas-comun', component: AlertasComunComponent },
  { path: 'preliquidados', component: PreliquidadosComponent },
  { path: 'liquidado/:id', component: LiquidadosComponent },
  { path: 'contratos', component: ContratosComponent },
  { path: 'procesos/disciplinarios', component: DisciplinariosComponent },
  { path: 'procesos/memorandos', component: MemorandosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RrhhRouterModule {}
