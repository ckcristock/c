import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'angular2-chartjs';
import { BoardsComponent } from './boards.component';
import { BoardRrhhComponent } from './board-rrhh/board-rrhh.component';
import { BoardContabilidadComponent } from './board-contabilidad/board-contabilidad.component';
import { BoardJefeBodegaComponent } from './board-jefe-bodega/board-jefe-bodega.component';
import { BoardNominaComponent } from './board-nomina/board-nomina.component';
import { BoardJefeIngenieriaComponent } from './board-jefe-ingenieria/board-jefe-ingenieria.component';
import { FiltrosgeneralesauditorComponent } from './board-contabilidad/filtrosgeneralesauditor/filtrosgeneralesauditor.component';
import { ResolucionesxvencerComponent } from './board-contabilidad/resolucionesxvencer/resolucionesxvencer.component';
import { CardreportesComponent } from './board-contabilidad/cardreportes/cardreportes.component';
import { BoardContabilidadService } from './board-contabilidad/board-contabilidad.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule } from '@angular/material';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { ComponentsModule } from 'src/app/components/components.module';
import { BoardJefeDisenoComponent } from './board-jefe-diseno/board-jefe-diseno.component';
import { BoardJefeProduccionComponent } from './board-jefe-produccion/board-jefe-produccion.component';


@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    NgModule,
    RouterModule,
    ChartModule,
    FullCalendarModule,
    ReactiveFormsModule,
    ComponentsModule,
    DragDropModule,
    NgbModule,
    NgSelectModule,
    CKEditorModule,
    MyDateRangePickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [
    BoardsComponent,
    BoardRrhhComponent,
    BoardContabilidadComponent,
    BoardJefeBodegaComponent,
    BoardNominaComponent,
    FiltrosgeneralesauditorComponent,
    ResolucionesxvencerComponent,
    CardreportesComponent,
    BoardJefeIngenieriaComponent,
    BoardJefeDisenoComponent,
    BoardJefeProduccionComponent,
  ],
  exports: [BoardsComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }, BoardContabilidadService, // Añades esta línea en los providers
  ],
})
export class BoardsModule { }
