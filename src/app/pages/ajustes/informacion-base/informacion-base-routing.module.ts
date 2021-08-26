import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresasComponent } from './empresas/empresas.component';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { AseguradorasComponent } from './aseguradoras/aseguradoras.component';
import { RegimenesNivelesComponent } from './regimenes-niveles/regimenes-niveles.component';
import { DetalleFuncionarioComponent } from './funcionarios/detalle-funcionario/detalle-funcionario.component';
import { CreateComponent } from './funcionarios/create/create.component';
import { EstructuraEmpresaComponent } from './estructura-empresa/estructura-empresa.component';
import { TurnosComponent } from './turnos/turnos.component';
import { CreateTurnoFijoComponent } from './turnos/turno-fijo/create-turno-fijo/create-turno-fijo.component';

const routes: Routes = [
  { path: 'empresas', component: EmpresasComponent },

  { path: 'funcionarios', component: FuncionariosComponent },
  { path: 'funcionario/:id', component: DetalleFuncionarioComponent },
  { path: 'funcionario/crear', component: CreateComponent },

  { path: 'regimenes-niveles', component: RegimenesNivelesComponent },
  { path: 'aseguradoras', component: AseguradorasComponent },
  { path: 'estructura-empresa', component: EstructuraEmpresaComponent },

  { path: 'turnos', component: TurnosComponent },
  { path: 'turnos/crear', component: CreateTurnoFijoComponent },
  { path: 'turnos/crear/:id', component: CreateTurnoFijoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionBaseRoutingModule {}
