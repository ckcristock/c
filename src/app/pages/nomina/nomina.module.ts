import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NominaRoutingModule } from './nomina-routing.module';
import { PrestamosLibranzasComponent } from './prestamos-libranzas/prestamos-libranzas.component';
import { ModalprestamoylibranzacrearComponent } from './prestamos-libranzas/modalprestamoylibranzacrear/modalprestamoylibranzacrear.component';
import { ComponentsModule } from '../../components/components.module';
import {
  NgbDropdownModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

import { ViaticosComponent } from './viaticos/viaticos.component';
import { CrearViaticosComponent } from './viaticos/crear-viaticos/crear-viaticos.component';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerViaticosComponent } from './viaticos/ver-viaticos/ver-viaticos.component';
import { TransporteTerrestreComponent } from './viaticos/ver-viaticos/transporte-terrestre/transporte-terrestre.component';
import { HospedajeComponent } from './viaticos/ver-viaticos/hospedaje/hospedaje.component';
import { ViaticosTotalesComponent } from './viaticos/ver-viaticos/viaticos-totales/viaticos-totales.component';
import { ViaticosAlimentacionComponent } from './viaticos/ver-viaticos/viaticos-alimentacion/viaticos-alimentacion.component';
import { ViaticosViajeComponent } from './viaticos/ver-viaticos/viaticos-viaje/viaticos-viaje.component';
import { ViaticosTaxisComponent } from './viaticos/ver-viaticos/viaticos-taxis/viaticos-taxis.component';
import { EditarViaticoComponent } from './viaticos/editar-viatico/editar-viatico.component';
import { VacacionesComponent } from './vacaciones/vacaciones.component';
import { NominaComponent } from './nomina/nomina.component';
import { CardConceptoComponent } from './nomina/card-concepto/card-concepto.component';
import { HorasExtrasComponent } from './nomina/modals/horas-extras/horas-extras.component';
import { ModalNovedadesComponent } from './nomina/modals/modal-novedades/modal-novedades.component';
import { ModalIngresosPrestacionalesComponent } from './nomina/modals/modal-ingresos-prestacionales/modal-ingresos-prestacionales.component';
import { IngresoPrestacionalComponent } from './nomina/forms/ingreso-prestacional/ingreso-prestacional.component';
import { PrimasComponent } from './primas/primas.component';
import { PrimaFuncionarioComponent } from './primas/prima-funcionario/prima-funcionario.component';

@NgModule({
  imports: [
    NominaRoutingModule,
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
    NgbTooltipModule
  ],
  declarations: [
    PrestamosLibranzasComponent,
    ModalprestamoylibranzacrearComponent,
    ViaticosComponent,
    CrearViaticosComponent,
    VerViaticosComponent,
    TransporteTerrestreComponent,
    HospedajeComponent,
    ViaticosTotalesComponent,
    ViaticosAlimentacionComponent,
    ViaticosViajeComponent,
    ViaticosTaxisComponent,
    EditarViaticoComponent,
    VacacionesComponent,
    NominaComponent,
    CardConceptoComponent,
    HorasExtrasComponent,
    ModalNovedadesComponent,
    ModalIngresosPrestacionalesComponent,
    IngresoPrestacionalComponent,
    PrimasComponent,
    PrimaFuncionarioComponent
  ],
})
export class NominaModule {}
