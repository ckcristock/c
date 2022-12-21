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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatPaginatorModule } from "@angular/material/paginator";
import { AutoFocusDirectiveDirective } from './crear-presupuesto/components/items/auto-focus-directive.directive';


@NgModule({
    declarations: [PresupuestosComponent, CrearPresupuestoComponent, SubItemsComponent, ItemsComponent, EditarPresupuestoComponent, VerPresupuestoComponent, ShowItemsPresupuestoComponent, AutoFocusDirectiveDirective],
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
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatPaginatorModule
    ],
    exports: [AutoFocusDirectiveDirective],
})

export class PresupuestoModule { }
