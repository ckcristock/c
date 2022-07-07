import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemisionesComponent } from './remisiones.component';
import { RemisionRoutes } from './remision.routing';
import { NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemisioncrearnuevoComponent } from './remisioncrearnuevo/remisioncrearnuevo.component';
import { ProductosremisionnuevoComponent } from './remisioncrearnuevo/productosremisionnuevo/productosremisionnuevo.component';
import { ModalproductoremisionnuevoComponent } from './modalproductoremisionnuevo/modalproductoremisionnuevo.component';
import { ModalcambiarproductossimilarnuevoComponent } from './modalcambiarproductossimilarnuevo/modalcambiarproductossimilarnuevo.component';
//import { TruncateModule } from 'ng2-truncate';
import { RemisioneditarComponent } from './remisioneditar/remisioneditar.component';
import { RemisionComponent } from './remision/remision.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
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
    NgbModule,
    CommonModule,
    RemisionRoutes,
    HttpClientModule,
    FormsModule,
    ComponentsModule,
    MyDateRangePickerModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbDropdownModule,
    NgSelectModule,
    PipesModule,
    SweetAlert2Module.forRoot(),
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatIconModule,
    //TruncateModule
  ],
  declarations: [
    RemisionesComponent,
    RemisionComponent,
    RemisioneditarComponent,
    RemisioncrearnuevoComponent,
    ProductosremisionnuevoComponent,
    ModalproductoremisionnuevoComponent,
    ModalcambiarproductossimilarnuevoComponent
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
export class RemisionModule { }
