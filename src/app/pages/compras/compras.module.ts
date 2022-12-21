import { NgModule } from '@angular/core';
import { ComprasRoutingModule } from './compras-routing.module';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CompraNacionalComponent } from './compra-nacional/compra-nacional.component';
import { ComponentsModule } from '../../components/components.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrearCompraNacionalComponent } from './compra-nacional/crear-compra-nacional/crear-compra-nacional.component';
import {
  NgbTypeaheadModule,
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from '../../core/pipes/pipes.module';
import { VerCompraNacionalComponent } from './compra-nacional/ver-compra-nacional/ver-compra-nacional.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { PresupuestoModule } from '../crm/presupuesto/presupuesto.module';

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
    CompraNacionalComponent,
    CrearCompraNacionalComponent,
    VerCompraNacionalComponent,
  ],
  providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
      },
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
  imports: [
    PresupuestoModule,
    NgSelectModule,
    HttpClientModule,
    PipesModule,
    CommonModule,
    FormsModule,
    ComprasRoutingModule,
    ComponentsModule,
    MyDateRangePickerModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCheckboxModule,
    NgbPaginationModule,
    MatInputModule,
    MatSelectModule,
    SweetAlert2Module.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,

  ],

})
export class ComprasModule { }
