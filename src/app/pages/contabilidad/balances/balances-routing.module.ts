import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalanceGeneralComponent } from './balance-general/balance-general.component';
import { MovimientoGlobalizadoComponent } from './movimiento-globalizado/movimiento-globalizado.component';

const routes: Routes = [
  { path: 'general', component: BalanceGeneralComponent },
  { path: 'movimiento-globalizado', component: MovimientoGlobalizadoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalancesRoutingModule { }
