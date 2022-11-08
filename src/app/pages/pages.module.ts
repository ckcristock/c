import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ComponentsModule } from '../components/components.module';
import { HttpClientModule } from '@angular/common/http';
//import { GraficalModuleModule } from './grafical-module/grafical-module.module';
import { TasksComponent } from './tasks/tasks.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModule, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { TaskViewComponent } from './tasks/task-view/task-view.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BoardsComponent } from './boards/boards.component';
import { BoardRrhhComponent } from './boards/board-rrhh/board-rrhh.component';
import { BoardContabilidadComponent } from './boards/board-contabilidad/board-contabilidad.component';
import { BoardNominaComponent } from './boards/board-nomina/board-nomina.component';
import { ChartModule } from 'angular2-chartjs';
import { BoardJefeBodegaComponent } from './boards/board-jefe-bodega/board-jefe-bodega.component';
import { FiltrosgeneralesauditorComponent } from './boards/board-contabilidad/filtrosgeneralesauditor/filtrosgeneralesauditor.component';
import { BoardContabilidadService } from './boards/board-contabilidad/board-contabilidad.service';
import { ResolucionesxvencerComponent } from './boards/board-contabilidad/resolucionesxvencer/resolucionesxvencer.component';
import { CardreportesComponent } from './boards/board-contabilidad/cardreportes/cardreportes.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
//import { AngularFileUploaderModule } from "angular-file-uploader";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoautorizadoComponent } from './noautorizado/noautorizado.component';
import { NewTaskComponent } from './tasks/new-task/new-task.component';
import { CardTaskComponent } from './tasks/card-task/card-task.component';

registerLocaleData(localeEs, 'es');


@NgModule({
    declarations: [
        DashboardComponent,
        TasksComponent,
        TaskViewComponent,
        BoardsComponent,
        BoardRrhhComponent,
        BoardContabilidadComponent,
        BoardJefeBodegaComponent,
        BoardNominaComponent,
        FiltrosgeneralesauditorComponent,
        ResolucionesxvencerComponent,
        CardreportesComponent,
        NoautorizadoComponent,
        NewTaskComponent,
        CardTaskComponent
    ],
    imports: [
        FullCalendarModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        PagesRoutingModule,
        ComponentsModule,
        //GraficalModuleModule,
        DragDropModule,
        NgbModule,
        NgSelectModule,
        CKEditorModule,
        ChartModule,
        MyDateRangePickerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        //AngularFileUploaderModule,
    ],
    exports: [
        NewTaskComponent
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'es' }, BoardContabilidadService, // Añades esta línea en los providers
    ],
})

export class PagesModule { }
