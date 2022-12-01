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
import { MatButtonModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSelectModule } from "@angular/material";
import { ItemsQuotationComponent } from "./crear-cotizacion/components/items-quotation/items-quotation.component";
import { SubitemsQuotationComponent } from "./crear-cotizacion/components/subitems-quotation/subitems-quotation.component";
import { NumberPipePipe } from "src/app/core/pipes/number-pipe.pipe";


@NgModule({
  declarations: [
    CotizacionComponent,
    CrearCotizacionComponent,
    ItemsQuotationComponent,
    SubitemsQuotationComponent
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
    DirectivesModule,
  ],
  exports: [],
  providers: [NumberPipePipe]
})

export class CotizacionModule { }
