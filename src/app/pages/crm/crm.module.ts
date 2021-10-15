import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrmRoutingModule } from './crm-routing.module';
import { TercerosComponent } from './terceros/terceros.component';
import { CrearTercerosComponent } from './terceros/crear-terceros/crear-terceros.component';
import { ComponentsModule } from '../../components/components.module';
import {  NgbDropdownModule, 
          NgbPaginationModule, 
          NgbCollapseModule, 
          NgbNavModule, 
          NgbTooltipModule, 
          NgbTypeaheadModule
        } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from '../../core/pipes/pipes.module';
import { PersonasComponent } from './terceros/personas/personas.component';


@NgModule({
  declarations: [
    TercerosComponent,
    CrearTercerosComponent,
    PersonasComponent
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    NgbPaginationModule,
    NgbDropdownModule,
    ComponentsModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    NgbDropdownModule,
    NgbCollapseModule,
    PipesModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbTypeaheadModule
  ]
})
export class CrmModule { }
