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
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerViaticosComponent } from './viaticos/ver-viaticos/ver-viaticos.component';
import { TransporteTerrestreComponent } from './viaticos/ver-viaticos/transporte-terrestre/transporte-terrestre.component';
import { HospedajeComponent } from './viaticos/ver-viaticos/hospedaje/hospedaje.component';
import { ViaticosTotalesComponent } from './viaticos/ver-viaticos/viaticos-totales/viaticos-totales.component';
import { ViaticosAlimentacionComponent } from './viaticos/ver-viaticos/viaticos-alimentacion/viaticos-alimentacion.component';
import { ViaticosViajeComponent } from './viaticos/ver-viaticos/viaticos-viaje/viaticos-viaje.component';

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
    NgSelectModule
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
    ViaticosViajeComponent
  ],
})
export class NominaModule {}
