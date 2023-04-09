import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgbPaginationModule, NgbDropdownModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../core/directives/directives.module';
import { CotizacionComponent } from './cotizacion.component';
import { CrearCotizacionComponent } from './crear-cotizacion/crear-cotizacion.component';
import { CotizacionRoutingModule } from "./cotizacion.routing.module";
import { MatButtonModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSlideToggleModule } from "@angular/material";
import { ItemsQuotationComponent } from "./crear-cotizacion/components/items-quotation/items-quotation.component";
import { NumberPipePipe } from "src/app/core/pipes/number-pipe.pipe";
import { ViewQuotationComponent } from "./view-quotation/view-quotation.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgxCurrencyModule } from "ngx-currency";
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
    CotizacionComponent,
    CrearCotizacionComponent,
    ItemsQuotationComponent,
    ViewQuotationComponent,
  ],
  imports: [
    CotizacionRoutingModule,
    CommonModule,
    NgbPaginationModule,
    NgbDropdownModule,
    ComponentsModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    DirectivesModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    NgbTypeaheadModule,
    MatSlideToggleModule,
    MatRadioModule,
    CKEditorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatExpansionModule,
    NgxCurrencyModule,
  ],
  exports: [],
  providers: [
    NumberPipePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class CotizacionModule { }
