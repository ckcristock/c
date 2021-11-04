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
import { ApuPiezaComponent } from './apu-pieza/apu-pieza.component';
import { CrearApuPiezaComponent } from './apu-pieza/crear-apu-pieza/crear-apu-pieza.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { VerApuPiezaComponent } from './apu-pieza/ver-apu-pieza/ver-apu-pieza.component';
import { EditarApuPiezaComponent } from './apu-pieza/editar-apu-pieza/editar-apu-pieza.component';
import { ApuConjuntoComponent } from './apu-conjunto/apu-conjunto.component';
import { CrearApuConjuntoComponent } from './apu-conjunto/crear-apu-conjunto/crear-apu-conjunto.component';


@NgModule({
  declarations: [
    TercerosComponent,
    CrearTercerosComponent,
    PersonasComponent,
    ApuPiezaComponent,
    CrearApuPiezaComponent,
    VerApuPiezaComponent,
    EditarApuPiezaComponent,
    ApuConjuntoComponent,
    CrearApuConjuntoComponent
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
    NgbTypeaheadModule,
    NgxDropzoneModule
  ]
})
export class CrmModule { }
