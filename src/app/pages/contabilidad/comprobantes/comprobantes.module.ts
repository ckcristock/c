import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotasContablesComponent } from './notas-contables/notas-contables.component';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComponentsModule } from '../../../components/components.module';
import { CrearNotaContableComponent } from './notas-contables/crear-nota-contable/crear-nota-contable.component';
import { ComprobantesRoutingModule } from './comprobantes-routing.module';



@NgModule({
  declarations: [
    NotasContablesComponent,
    CrearNotaContableComponent
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbPaginationModule,
    NgSelectModule,
    ComponentsModule,
    ComprobantesRoutingModule,
    NgbTypeaheadModule
  ]
})
export class ComprobantesModule { }
