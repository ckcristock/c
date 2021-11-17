import { NgModule } from "@angular/core";
import { PresupuestoRoutingModule } from './presupuesto-routing.module';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';

import { PresupuestosComponent } from './presupuestos.component';
import { CrearPresupuestoComponent } from './crear-presupuesto/crear-presupuesto.component';
import { DirectivesModule } from '../../../core/directives/directives.module';


@NgModule({
    declarations: [PresupuestosComponent,  CrearPresupuestoComponent],
    imports: [
        PresupuestoRoutingModule,
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

export class PresupuestoModule { }