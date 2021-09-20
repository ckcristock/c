import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanCuentasComponent } from './plan-cuentas/plan-cuentas.component';
import { CentroCostosComponent } from './centro-costos/centro-costos.component';
import { ActivosFijosComponent } from './activos-fijos/activos-fijos.component';
import { ActivosFijosCrearComponent } from './activos-fijos/activos-fijos-crear/activos-fijos-crear.component';
import { ActivosFijosVerComponent } from './activos-fijos/activos-fijos-ver/activos-fijos-ver.component';
import { DepreciacionesComponent } from './depreciaciones/depreciaciones.component';
import { DepreciacionComponent } from './depreciaciones/depreciacion/depreciacion.component';

const routes: Routes = [
    { path: 'plan-cuentas', component: PlanCuentasComponent },
    { path: 'centro-costos', component: CentroCostosComponent },
    { path: 'activos-fijos', component: ActivosFijosComponent },
    { path: 'crear', component: ActivosFijosCrearComponent },
    { path: 'ver', component: ActivosFijosVerComponent },
    { path: 'depreciaciones', component: DepreciacionesComponent },
    { path: 'depreciacion', component: DepreciacionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContabilidadRoutingModule {}