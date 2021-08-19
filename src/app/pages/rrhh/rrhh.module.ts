import { NgModule } from "@angular/core";
import { RrhhRouterModule } from "./rrhh-routing.module";
import { VacantesComponent } from './vacantes/vacantes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'; */

import { NgbPaginationModule, NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { VacantesCrearComponent } from './vacantes/vacantes-crear/vacantes-crear.component';
import { PipesModule } from '../../core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "src/app/components/components.module";
import { LlegadasTardesComponent } from './llegadas-tardes/llegadas-tardes.component';

import { ChartsModule } from 'ng2-charts';
import { NovedadesComponent } from './novedades/novedades.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { VacantesVerComponent } from './vacantes/vacantes-ver/vacantes-ver.component';
import { CrearNovedadComponent } from './novedades/crear-novedad/crear-novedad.component';
import { InventarioDotacionComponent } from './dotacion/inventario-dotacion/inventario-dotacion.component';
import { DotacionesComponent } from './dotacion/dotaciones/dotaciones.component';
import { ActividadesComponent } from "./actividades/actividades.component";


import { FullCalendarModule } from '@fullcalendar/angular';
import { DetalleLlegadaComponent } from './llegadas-tardes/detalle-llegada/detalle-llegada.component';

@NgModule({
    declarations:[VacantesComponent, ActividadesComponent, VacantesCrearComponent, LlegadasTardesComponent, NovedadesComponent, VacantesVerComponent, CrearNovedadComponent, InventarioDotacionComponent, DotacionesComponent, DetalleLlegadaComponent],
    imports:[RrhhRouterModule,
        CommonModule,
        ChartsModule,
        FormsModule,
        ReactiveFormsModule,
/*         SweetAlert2Module, */
        NgbPaginationModule,
        NgbDropdownModule,
        MyDateRangePickerModule,
        PipesModule,
        ComponentsModule,
        NgSelectModule,
        NgbTypeaheadModule,
        FullCalendarModule
    ],
    exports:[],
})

export class RrhhModule {}
