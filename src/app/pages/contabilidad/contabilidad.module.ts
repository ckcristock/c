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
import { DepreciacionesComponent } from './depreciaciones/depreciaciones.component';
import { DepreciacionComponent } from './depreciaciones/depreciacion/depreciacion.component';
import { CajasComponent } from './cajas/cajas.component';
import { CrearCajaComponent } from './cajas/crear-caja/crear-caja.component';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    PlanCuentasComponent,
    CentroCostosComponent,
    ActivosFijosComponent,
    ActivosFijosCrearComponent,
    ActivosFijosVerComponent,
    TablaActivoFijoComponent,
    AdicionesActivoFijoComponent,
    DepreciacionesComponent,
    DepreciacionComponent,
    CajasComponent,
    CrearCajaComponent
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
    NgSelectModule
  ]
})
export class ContabilidadModule { }
