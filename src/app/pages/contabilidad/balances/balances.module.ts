import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BalancesRoutingModule } from './balances-routing.module';
import { BalanceGeneralComponent } from './balance-general/balance-general.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MovimientoGlobalizadoComponent } from './movimiento-globalizado/movimiento-globalizado.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../../../components/components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';


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
    ComponentsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    DatePipe,
  ],
})
export class BalancesModule { }
