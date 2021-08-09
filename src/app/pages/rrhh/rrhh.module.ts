import { NgModule } from "@angular/core";
import { RrhhRouterModule } from "./rrhh-routing.module";
import { VacantesComponent } from './vacantes/vacantes.component';
import { PostulantesComponent } from './postulantes/postulantes.component';
import { FormsModule } from '@angular/forms';
/* import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'; */

import { NgbPaginationModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { VacantesCrearComponent } from './vacantes/vacantes-crear/vacantes-crear.component';
import { PipesModule } from '../../core/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "src/app/components/components.module";
import { LlegadasTardesComponent } from './llegadas-tardes/llegadas-tardes.component';

import { ChartsModule } from 'ng2-charts';
import { NovedadesComponent } from './novedades/novedades.component';



@NgModule({
    declarations:[VacantesComponent, PostulantesComponent, VacantesCrearComponent, LlegadasTardesComponent, NovedadesComponent],
    imports:[RrhhRouterModule,
        CommonModule,
        ChartsModule,
        FormsModule,
/*         SweetAlert2Module, */
        NgbPaginationModule,
        NgbDropdownModule,
        MyDateRangePickerModule,
        PipesModule,
        ComponentsModule
    ],
    exports:[],
})

export class RrhhModule {}