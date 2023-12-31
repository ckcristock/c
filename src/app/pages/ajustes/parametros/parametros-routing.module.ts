import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { GeometriasComponent } from './apu/geometrias/geometrias.component';
import { CrearGeometriaComponent } from './apu/geometrias/crear-geometria/crear-geometria.component';
import { VerGeometriaComponent } from './apu/geometrias/ver-geometria/ver-geometria.component';
import { UnidadesMedidasComponent } from './apu/unidades-medidas/unidades-medidas.component';
import { MaquinasHerramientasComponent } from './apu/maquinas-herramientas/maquinas-herramientas.component';
import { MedidasComponent } from './apu/medidas/medidas.component';
import { CostosIndirectosComponent } from "./apu/costos-indirectos/costos-indirectos.component";
import { EspesoresComponent } from './apu/espesores/espesores.component';
import { CorteLaserMaterialComponent } from './apu/corte-laser-material/corte-laser-material.component';
import { PerfilesApuComponent } from './apu/perfiles-apu/perfiles-apu.component';
import { EstimacionViaticosComponent } from './apu/estimacion-viaticos/estimacion-viaticos.component';
import { ValorAlmuerzosComponent } from './valor-almuerzos/valor-almuerzos.component';
import { MaterialesComponent } from "./apu/materiales/materiales.component";
import { NominaComponent } from "./nomina/nomina.component";
import { ViaticosComponent } from "./viaticos/viaticos.component";
import { VacantesComponent } from "./vacantes/vacantes.component";
import { TercerosComponent } from "./terceros/terceros.component";
import { ContratoComponent } from "../tipos/contrato/contrato.component";
import { ParametrosNominaComponent } from "./params-nomina/parametros-nomina/parametros-nomina.component";
// import { RgpComponent } from './rgp/rgp.component';
// import { NotasTecnicasComponent } from './notas-tecnicas/notas-tecnicas.component';
// import { ZonasComponent } from "./zonas/zonas.component";
// import { EpsComponent } from "./eps/eps.component";
// import { BancosComponent } from './bancos/bancos.component';
// import { CuentasBancariasComponent } from "./cuentas-bancarias/cuentas-bancarias.component";
// import { HotelesComponent } from './viaticos/hoteles/hoteles.component';
// import { TaxisComponent } from './viaticos/taxis/taxis.component';
// import { LicenciaConduccionComponent } from './vacantes/licencia-conduccion/licencia-conduccion.component';
// import { ProcesosInternosComponent } from './apu/procesos-internos/procesos-internos.component';
// import { ProcesosExternosComponent } from "./apu/procesos-externos/procesos-externos.component";
// import { EstimacionViaticosValuesComponent } from './apu/estimacion-viaticos-values/estimacion-viaticos-values.component';
//import { MaterialesComponent } from './apu/materiales/materiales.component';


const routes: Routes = [
  { path: 'viaticos', component: ViaticosComponent },
  { path: 'vacantes', component: VacantesComponent },
  { path: 'terceros', component: TercerosComponent },
  { path: 'contratos', component: ContratoComponent },
  { path: 'nomina', component: NominaComponent },
  { path: 'apu/geometrias', component: GeometriasComponent },
  { path: 'apu/crear-geometria', component: CrearGeometriaComponent },
  { path: 'apu/editar-geometria/:id', component: CrearGeometriaComponent },
  { path: 'apu/ver-geometria/:id', component: VerGeometriaComponent },
  { path: 'apu/materiales', component: MaterialesComponent },
  { path: 'apu/unidades-medidas', component: UnidadesMedidasComponent },
  { path: 'apu/variables-apu', component: MaquinasHerramientasComponent },
  { path: 'apu/medidas', component: MedidasComponent },
  { path: 'apu/costos-indirectos', component: CostosIndirectosComponent },
  { path: 'apu/espesores', component: EspesoresComponent },
  { path: 'apu/corte-laser-material', component: CorteLaserMaterialComponent },
  { path: 'apu/perfiles', component: PerfilesApuComponent },
  { path: 'apu/estimacion-viaticos', component: EstimacionViaticosComponent },
  { path: 'valor-almuerzos', component: ValorAlmuerzosComponent },
  { path: 'params-nomina', component: ParametrosNominaComponent }
  // { path: 'perfiles', component : PerfilesComponent },
  // { path: 'rgp', component : RgpComponent },
  /* { path: 'zonas', component : ZonasComponent }, */
  /* { path: 'notas-tecnicas', component : NotasTecnicasComponent }, */
  /* { path: 'cuentas-bancarias', component : CuentasBancariasComponent }, */
  // { path: 'categorias', component : CategoriasComponent },
  // { path: 'subcategorias', component : SubcategoriasComponent },
  // { path: 'valor-almuerzos', component: ValorAlmuerzosComponent },
  //{ path: 'apu/est-viaticos-valores', component: EstimacionViaticosValuesComponent },
  // path: 'apu/procesos-internos', component: ProcesosInternosComponent },
  // { path: 'apu/procesos-externos', component: ProcesosExternosComponent },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ParametrosRoutingModule { }
