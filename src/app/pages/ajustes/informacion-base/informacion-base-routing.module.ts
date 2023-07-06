import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresasComponent } from './empresas/empresas.component';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { AseguradorasComponent } from './aseguradoras/aseguradoras.component';
import { DetalleFuncionarioComponent } from './funcionarios/detalle-funcionario/detalle-funcionario.component';
import { CreateComponent } from './funcionarios/create/create.component';
import { TurnosComponent } from './turnos/turnos.component';
import { CreateTurnoFijoComponent } from './turnos/turno-fijo/create-turno-fijo/create-turno-fijo.component';
import { ConfiguracionEmpresaComponent } from '../configuracion/configuracion-empresa/configuracion-empresa.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { CrearProductoComponent } from './productos/crear-producto/crear-producto.component';
import { ProductoComponent } from './productos/producto/producto.component';
import { VerLiquidacionComponent } from './funcionarios/detalle-funcionario/ver-liquidacion/ver-liquidacion.component';
import { BodegasComponent } from './bodegas/bodegas.component';
import { CrearbodegaComponent } from './bodegas/crearbodega/crearbodega.component';
import { GrupoestibaComponent } from './bodegas/grupoestiba/grupoestiba.component';
import { EditarProductoComponent } from './productos/editar-producto/editar-producto.component';
import { ResponsablesComponent } from './responsables/responsables.component';

const routes: Routes = [
  { path: 'empresas', component: EmpresasComponent },
  { path: 'funcionarios', component: FuncionariosComponent },
  { path: 'funcionario/:id', component: DetalleFuncionarioComponent },
  { path: 'funcionario/:id/liquidacion', component: VerLiquidacionComponent },
  { path: 'funcionarios/crear', component: CreateComponent },
  { path: 'aseguradoras', component: AseguradorasComponent },
  { path: 'turnos', component: TurnosComponent },
  { path: 'turnos/crear', component: CreateTurnoFijoComponent },
  { path: 'turnos/crear/:id', component: CreateTurnoFijoComponent },
  { path: 'configuracion-empresa', component: ConfiguracionEmpresaComponent },
  /**Productos */
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'catalogo/crear', component: CrearProductoComponent },
  { path: 'catalogo/ver/:id', component: ProductoComponent },
  { path: 'catalogo/editar/:id', component: EditarProductoComponent },
  //sedes
  { path: 'bodegas', component: BodegasComponent },
  { path: 'responsables', component: ResponsablesComponent },
  { path: 'bodegas/crear', component: CrearbodegaComponent },
  { path: 'bodegas/grupoestiba/:id', component: GrupoestibaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionBaseRoutingModule { }
