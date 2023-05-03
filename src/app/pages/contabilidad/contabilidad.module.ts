import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContabilidadRoutingModule } from './contabilidad-routing.module';
import { PlanCuentasComponent } from './plan-cuentas/plan-cuentas.component';
import { NgbTooltipModule, NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CentroCostosComponent } from './centro-costos/centro-costos.component';
import { PipesModule } from '../../core/pipes/pipes.module';
import { ActivosFijosComponent } from './activos-fijos/activos-fijos.component';
import { ActivosFijosCrearComponent } from './activos-fijos/activos-fijos-crear/activos-fijos-crear.component';
import { ActivosFijosVerComponent } from './activos-fijos/activos-fijos-ver/activos-fijos-ver.component';
import { TablaActivoFijoComponent } from './activos-fijos/activos-fijos-ver/tabla-activo-fijo/tabla-activo-fijo.component';
import { AdicionesActivoFijoComponent } from './activos-fijos/activos-fijos-ver/adiciones-activo-fijo/adiciones-activo-fijo.component';
import { CajasComponent } from './cajas/cajas.component';
import { CrearCajaComponent } from './cajas/crear-caja/crear-caja.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CustumetypeaheadComponent } from './custumetypeahead/custumetypeahead.component';
import { DepreciacionComponent } from './depreciacion/depreciacion.component';
import { TabladepreciacionComponent } from './depreciacion/tabladepreciacion/tabladepreciacion.component';
import { TabladepreciacionesComponent } from './depreciacion/tabladepreciaciones/tabladepreciaciones.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { Globales } from './globales';
import { CierresContablesComponent } from './cierres-contables/cierres-contables.component';
import { FacturaAdministrativaComponent } from './factura-administrativa/factura-administrativa.component';
import { VerFacturaAdministrativaComponent } from './factura-administrativa/ver-factura-administrativa/ver-factura-administrativa.component';
import { CrearFacturaAdministrativaComponent } from './factura-administrativa/crear-factura-administrativa/crear-factura-administrativa.component';
import { ModalcierrecontableComponent } from './cierres-contables/modalcierrecontable/modalcierrecontable.component';
import { ModalplancuentasComponent } from './cierres-contables/modalplancuentas/modalplancuentas.component';
import { InventariosValorizadosComponent } from './inventarios-valorizados/inventarios-valorizados.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from 'saturn-datepicker';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatTooltip, MatTooltipModule } from '@angular/material';
import { ImportPucComponent } from './plan-cuentas/import-puc/import-puc.component';
import { ImportInitialBalancesComponent } from './plan-cuentas/import-initial-balances/import-initial-balances.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@NgModule({
  declarations: [
    PlanCuentasComponent,
    CentroCostosComponent,
    ActivosFijosComponent,
    ActivosFijosCrearComponent,
    ActivosFijosVerComponent,
    TablaActivoFijoComponent,
    AdicionesActivoFijoComponent,
    CajasComponent,
    CrearCajaComponent,
    CustumetypeaheadComponent,
    DepreciacionComponent,
    TabladepreciacionComponent,
    TabladepreciacionesComponent,
    CierresContablesComponent,
    FacturaAdministrativaComponent,
    VerFacturaAdministrativaComponent,
    CrearFacturaAdministrativaComponent,
    ModalcierrecontableComponent,
    ModalplancuentasComponent,
    InventariosValorizadosComponent,
    ImportPucComponent,
    ImportInitialBalancesComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ContabilidadRoutingModule,
    NgbTooltipModule,
    NgbDropdownModule,
    ComponentsModule,
    NgbPaginationModule,
    PipesModule,
    NgbTypeaheadModule,
    NgSelectModule,
    ComponentsModule,
    SweetAlert2Module.forRoot(),
    MyDateRangePickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PerfectScrollbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgbTooltipModule,
    MatCheckboxModule,
    NgxCurrencyModule,
    DirectivesModule
  ],
  providers: [
    Globales,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ContabilidadModule { }
