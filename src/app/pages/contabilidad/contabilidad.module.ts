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
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
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
    MatNativeDateModule
  ],
  providers: [
    Globales
  ]
})
export class ContabilidadModule { }
