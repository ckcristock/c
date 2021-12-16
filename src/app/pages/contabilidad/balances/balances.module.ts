import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalancesRoutingModule } from './balances-routing.module';
import { BalanceGeneralComponent } from './balance-general/balance-general.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MovimientoGlobalizadoComponent } from './movimiento-globalizado/movimiento-globalizado.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    BalanceGeneralComponent,
    MovimientoGlobalizadoComponent
  ],
  imports: [
    CommonModule,
    BalancesRoutingModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    NgbTypeaheadModule,
    ComponentsModule
  ]
})
export class BalancesModule { }
