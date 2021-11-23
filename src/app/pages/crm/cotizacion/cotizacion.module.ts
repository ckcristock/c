import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgbPaginationModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../core/directives/directives.module';
import { CotizacionComponent } from './cotizacion.component';
import { CrearCotizacionComponent } from './crear-cotizacion/crear-cotizacion.component';
import { CotizacionRoutingModule } from "./cotizacion.routing.module";


@NgModule({
    declarations: [CotizacionComponent, CrearCotizacionComponent],
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
    ],
    exports: [],
})

export class CotizacionModule { }