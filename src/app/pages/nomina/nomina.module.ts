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

@NgModule({
  imports: [
    NominaRoutingModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    NgbTypeaheadModule,
    PipesModule,
    NgbDropdownModule,
    ReactiveFormsModule

  ],
  declarations: [
    
    PrestamosLibranzasComponent,
    ModalprestamoylibranzacrearComponent,
    ViaticosComponent
  ],
})
export class NominaModule {}
