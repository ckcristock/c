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
import { PrimasComponent } from './primas/primas.component';
import { PrimaFuncionarioComponent } from './primas/prima-funcionario/prima-funcionario.component';
import { LegalizarComponent } from './viaticos/legalizar/legalizar.component';
import { HistorialPagosComponent } from './historial-pagos/historial-pagos.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CesantiasComponent } from './cesantias/cesantias.component';
import { CesantiaCurrentComponent } from './cesantias/cesantia-current/cesantia-current.component';
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
    NgbTooltipModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    CurrencyMaskModule,
    MatTooltipModule
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
    PrimasComponent,
    PrimaFuncionarioComponent,
    LegalizarComponent,
    HistorialPagosComponent,
    CesantiasComponent,
    CesantiaCurrentComponent,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NominaModule { }
