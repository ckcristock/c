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
import { MateriaPrimaComponent } from './apu-pieza/ver-apu-pieza/materia-prima/materia-prima.component';
import { MaterialesComercialesComponent } from './apu-pieza/ver-apu-pieza/materiales-comerciales/materiales-comerciales.component';
import { CorteAguaComponent } from './apu-pieza/ver-apu-pieza/corte-agua/corte-agua.component';
import { CorteLaserComponent } from './apu-pieza/ver-apu-pieza/corte-laser/corte-laser.component';
import { MaquinasHerramientasComponent } from './apu-pieza/ver-apu-pieza/maquinas-herramientas/maquinas-herramientas.component';
import { ProcesosInternosComponent } from './apu-pieza/ver-apu-pieza/procesos-internos/procesos-internos.component';
import { ProcesosExternosComponent } from './apu-pieza/ver-apu-pieza/procesos-externos/procesos-externos.component';
import { OtrosComponent } from './apu-pieza/ver-apu-pieza/otros/otros.component';
import { EditarApuConjuntoComponent } from './apu-conjunto/editar-apu-conjunto/editar-apu-conjunto.component';
import { VerApuConjuntoComponent } from './apu-conjunto/ver-apu-conjunto/ver-apu-conjunto.component';
import { ListadoPiezasConjuntosComponent } from './apu-conjunto/ver-apu-conjunto/listado-piezas-conjuntos/listado-piezas-conjuntos.component';
import { MaquinasHerramientasConjuntoComponent } from './apu-conjunto/ver-apu-conjunto/maquinas-herramientas-conjunto/maquinas-herramientas-conjunto.component';
import { OtrosConjuntoComponent } from './apu-conjunto/ver-apu-conjunto/otros-conjunto/otros-conjunto.component';
import { ProcesosInternosConjuntoComponent } from './apu-conjunto/ver-apu-conjunto/procesos-internos-conjunto/procesos-internos-conjunto.component';
import { ProcesosExternosConjuntoComponent } from './apu-conjunto/ver-apu-conjunto/procesos-externos-conjunto/procesos-externos-conjunto.component';


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
    CrearApuConjuntoComponent,
    MateriaPrimaComponent,
    MaterialesComercialesComponent,
    CorteAguaComponent,
    CorteLaserComponent,
    MaquinasHerramientasComponent,
    ProcesosInternosComponent,
    ProcesosExternosComponent,
    OtrosComponent,
    EditarApuConjuntoComponent,
    VerApuConjuntoComponent,
    ListadoPiezasConjuntosComponent,
    MaquinasHerramientasConjuntoComponent,
    OtrosConjuntoComponent,
    ProcesosInternosConjuntoComponent,
    ProcesosExternosConjuntoComponent
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
