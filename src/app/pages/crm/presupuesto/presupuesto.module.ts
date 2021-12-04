import { NgModule } from "@angular/core";
import { PresupuestoRoutingModule } from './presupuesto-routing.module';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule, NgbDropdownModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';

import { PresupuestosComponent } from './presupuestos.component';
import { CrearPresupuestoComponent } from './crear-presupuesto/crear-presupuesto.component';
import { DirectivesModule } from '../../../core/directives/directives.module';
import { SubItemsComponent } from './crear-presupuesto/components/sub-items/sub-items.component';
import { ItemsComponent } from './crear-presupuesto/components/items/items.component';
import { EditarPresupuestoComponent } from './editar-presupuesto/editar-presupuesto.component';
import { VerPresupuestoComponent } from './ver-presupuesto/ver-presupuesto.component';
import { ShowItemsPresupuestoComponent } from './ver-presupuesto/show-items-presupuesto/show-items-presupuesto.component';


@NgModule({
    declarations: [PresupuestosComponent,  CrearPresupuestoComponent, SubItemsComponent, ItemsComponent, EditarPresupuestoComponent, VerPresupuestoComponent, ShowItemsPresupuestoComponent],
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
        NgbTypeaheadModule,
    ],
    exports: [],
})

export class PresupuestoModule { }