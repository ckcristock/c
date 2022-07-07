import { NgModule } from '@angular/core';

import { MyDateRangePickerModule } from 'mydaterangepicker';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../components/components.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import {
  NgbModalModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { InventarioRoutingModule } from './inventario-routing.module';
import { InventarioComponent } from './inventario/inventario.component';
import { HttpClientModule } from '@angular/common/http';
import { InventarioFisicoComponent } from './inventario-fisico/inventario-fisico.component';
import {
  ModalAlert,
  ModalformComponent,
} from './inventario-fisico/modalform/modalform.component';
import { ModaldataInitComponent } from './inventario-fisico/modaldata-init/modaldata-init.component';
import { ActaRecepcionComponent } from './acta-recepcion/acta-recepcion.component';
import { ActaRecepionAprobadosComponent } from './acta-recepion-aprobados/acta-recepion-aprobados.component';
import { AcomodarActaComponent } from './acta-recepion-aprobados/acomodar-acta/acomodar-acta.component';
import { PipesModule } from '../../core/pipes/pipes.module';
import { VerActaRecepcionComponent } from './acta-recepcion/ver-acta-recepcion/ver-acta-recepcion.component';
import { InventarioVencerComponent } from './inventario-vencer/inventario-vencer.component';
import { AlistamientoComponent } from './alistamiento/alistamiento.component';
import { AlistamientoCrearComponent } from './alistamiento/alistamiento-crear/alistamiento-crear.component';
import { ArchwizardModule } from 'angular-archwizard';
import { CrearActaRecepcionComponent } from './acta-recepcion/crear-acta-recepcion/crear-acta-recepcion.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    ModalAlert,
    ModalformComponent,
    ModaldataInitComponent,
    InventarioComponent,
    InventarioFisicoComponent,
    ActaRecepcionComponent,
    CrearActaRecepcionComponent,
    ActaRecepionAprobadosComponent,
    AcomodarActaComponent,
    VerActaRecepcionComponent,
    InventarioVencerComponent,
    AlistamientoComponent,
    AlistamientoCrearComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    InventarioRoutingModule,
    ComponentsModule,
    MyDateRangePickerModule,
    NgbTypeaheadModule,
    SweetAlert2Module.forRoot(),
    NgbPaginationModule,
    NgbModalModule,
    NgbDropdownModule,
    PipesModule,
    ArchwizardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
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
export class InventarioModule { }
