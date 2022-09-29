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
import {CertificadosComponent} from './certificados/certificados.component';
import {ReporteHorarioComponent} from './reporte-horario/reporte-horario.component';
import {FondoEmpleadoComponent} from './fondo-empleado/fondo-empleado.component';
import { AsignarHorasExtrasComponent } from './asignar-horas-extras/asignar-horas-extras.component';
import { AlmuerzosComponent } from './almuerzos/almuerzos.component';
import { TableInventaryComponent } from './dotacion/dotaciones/table-inventary/table-inventary.component';
import { TableInventaryEppComponent } from './dotacion/dotaciones/table-inventary-epp/table-inventary-epp.component';
import { DotacionEntradasComponent } from './dotacion/dotaciones/dotacion-entradas/dotacion-entradas.component';
import { DotacionSalidasComponent } from './dotacion/dotaciones/dotacion-salidas/dotacion-salidas.component';
import { TableStockComponent } from './dotacion/dotaciones/table-stock/table-stock.component';
import { CategoryStockComponent } from './dotacion/dotaciones/category-stock/category-stock.component';
import { DescargoComponent } from './procesos/disciplinarios/descargo/descargo.component';
import { CerrarProcesoComponent } from './procesos/disciplinarios/cerrar-proceso/cerrar-proceso.component';
import { CrearProcesoComponent } from './procesos/disciplinarios/crear-proceso/crear-proceso.component';



const routes: Routes = [
  { path: 'vacantes', component: VacantesComponent },
  { path: 'vacantes-crear', component: VacantesCrearComponent },
  { path: 'vacantes-ver/:id', component: VacantesVerComponent },
  { path: 'actividades', component: ActividadesComponent },
  { path: 'novedades', component: NovedadesComponent },
  { path: 'llegadas-tarde', component: LlegadasTardesComponent },


  { path: 'dotacion/dotaciones', component: DotacionesComponent },
  { path: 'dotacion/dotaciones/table-inventary', component: TableInventaryComponent },
  { path: 'dotacion/dotaciones/table-inventary-epp', component: TableInventaryEppComponent },
  { path: 'dotacion/dotaciones/app-dotacion-entradas', component: DotacionEntradasComponent },
  { path: 'dotacion/dotaciones/app-dotacion-salidas', component: DotacionSalidasComponent },
  { path: 'dotacion/dotaciones/app-table-stock', component: TableStockComponent },
  { path: 'dotacion/inventario', component: InventarioDotacionComponent },


  { path: 'turnos/asignacion', component: AsignacionTurnosComponent },
  { path: 'turnos/horas-extras', component: HorasExtrasComponent },
  { path: 'turnos/reporte', component: ReporteHorarioComponent },
  { path: 'alertas-comun', component: AlertasComunComponent },
  { path: 'alertas-comun/:pid', component: AlertasComunComponent },
  { path: 'liquidados', component: PreliquidadosComponent },
  { path: 'liquidado/:id/:value', component: LiquidadosComponent },
  { path: 'contratos', component: ContratosComponent },
  { path: 'procesos/disciplinarios', component: DisciplinariosComponent },
  { path: 'procesos/disciplinarios/cerrar/:id', component: CerrarProcesoComponent },
  { path: 'procesos/disciplinarios/crear', component: CrearProcesoComponent },
  { path: 'procesos/disciplinarios/:id', component: DescargoComponent },
  { path: 'procesos/memorandos', component: MemorandosComponent },
  { path: 'certificados', component: CertificadosComponent },
  { path: 'fondo-empleado', component: FondoEmpleadoComponent },
  { path: 'asignar-horas-extras', component: AsignarHorasExtrasComponent },
  { path: 'almuerzos', component: AlmuerzosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RrhhRouterModule {}
