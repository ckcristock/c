import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import { ComponentsModule } from '../../../components/components.module';
/*EndModules */


import { CardConceptoComponent } from './card-concepto/card-concepto.component';
import { DeduccionesComponent } from './forms/deducciones/deducciones.component';
import { IngresoNoPrestacionalComponent } from './forms/ingreso-no-prestacional/ingreso-no-prestacional.component';
import { IngresoPrestacionalComponent } from './forms/ingreso-prestacional/ingreso-prestacional.component';
import { HorasExtrasComponent } from './modals/horas-extras/horas-extras.component';
import { ModalDeduccionesComponent } from './modals/modal-deducciones/modal-deducciones.component';
import { ModalIngresosNoPrestacionalesComponent } from './modals/modal-ingresos-no-prestacionales/modal-ingresos-no-prestacionales.component';
import { ModalIngresosPrestacionalesComponent } from './modals/modal-ingresos-prestacionales/modal-ingresos-prestacionales.component';
import { ModalNovedadesComponent } from './modals/modal-novedades/modal-novedades.component';
import { NominaComponent } from './nomina.component';
import { ColillaPagoComponent } from './calculos/colilla-pago/colilla-pago.component';
import { PagoNominaRoutingModule } from './pago-nomina.routing.module';
import { ResumenColillaComponent } from './calculos/colilla-pago/components/resumen-colilla/resumen-colilla.component';
import { DiasTrabajadosComponent } from './calculos/colilla-pago/components/dias-trabajados/dias-trabajados.component';
import { SalarioComponent } from './calculos/colilla-pago/components/salario/salario.component';
import { ExtrasRecargosComponent } from './calculos/colilla-pago/components/extras-recargos/extras-recargos.component';
import { NovedadesComponent } from './calculos/colilla-pago/components/novedades/novedades.component';
import { RetencionesComponent } from './calculos/colilla-pago/components/retenciones/retenciones.component';
import { NominaFuncionarioComponent } from './calculos/nomina-funcionario.component';

@NgModule({
  declarations: [
    NominaComponent,
    CardConceptoComponent,
    HorasExtrasComponent,
    ModalNovedadesComponent,
    ModalIngresosPrestacionalesComponent,
    IngresoPrestacionalComponent,
    IngresoNoPrestacionalComponent,
    ModalIngresosNoPrestacionalesComponent,
    ModalDeduccionesComponent,
    DeduccionesComponent,
    ColillaPagoComponent,
    ResumenColillaComponent,
    DiasTrabajadosComponent,
    SalarioComponent,
    ExtrasRecargosComponent,
    NovedadesComponent,
    RetencionesComponent,
    NominaFuncionarioComponent,
  ],
  imports: [
    PagoNominaRoutingModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    NgbTypeaheadModule,
    PipesModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    HttpClientModule,
    NgSelectModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
  ],
  exports: [],
})
export class PagoNominaModule {}
