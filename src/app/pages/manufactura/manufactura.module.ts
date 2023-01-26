import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManufacturaRoutingModule } from './manufactura-routing.module';
import { OrdenesProduccionComponent } from './ordenes-produccion/ordenes-produccion.component';
import { IngenieriaComponent } from './ingenieria/ingenieria.component';
import { DisenoComponent } from './diseno/diseno.component';
import { ProduccionComponent } from './produccion/produccion.component';
import { NgbDropdownModule, NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CrearOrdenProduccionComponent } from './ordenes-produccion/crear-orden-produccion/crear-orden-produccion.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { VerOrdenProduccionComponent } from './ordenes-produccion/ver-orden-produccion/ver-orden-produccion.component';
import { VerIngenieriaComponent } from './ingenieria/ver-ingenieria/ver-ingenieria.component';
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
    OrdenesProduccionComponent,
    IngenieriaComponent,
    DisenoComponent,
    ProduccionComponent,
    CrearOrdenProduccionComponent,
    VerOrdenProduccionComponent,
    VerIngenieriaComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ManufacturaRoutingModule,
    NgbDropdownModule,
    ComponentsModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    PipesModule,
    NgbNavModule,
    NgbTypeaheadModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatTooltipModule,
    CKEditorModule,
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
export class ManufacturaModule { }
