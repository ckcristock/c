import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrmRoutingModule } from './crm-routing.module';
import { TercerosComponent } from './terceros/terceros.component';
import { CrearTercerosComponent } from './terceros/crear-terceros/crear-terceros.component';
import { ComponentsModule } from '../../components/components.module';
import {
  NgbDropdownModule,
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
import { ApuServicioComponent } from './apu-servicio/apu-servicio.component';
import { CrearApuServicioComponent } from './apu-servicio/crear-apu-servicio/crear-apu-servicio.component';
import { VerApuServicioComponent } from './apu-servicio/ver-apu-servicio/ver-apu-servicio.component';
import { EditarApuServicioComponent } from './apu-servicio/editar-apu-servicio/editar-apu-servicio.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ValidacionDimensionalComponent } from './apu-servicio/ver-apu-servicio/validacion-dimensional/validacion-dimensional.component';
import { MontajePuestaMarchaComponent } from './apu-servicio/ver-apu-servicio/montaje-puesta-marcha/montaje-puesta-marcha.component';
import { ApusComponent } from './apus/apus.component';
import { NegociosComponent } from './negocios/negocios.component';
import { VerNegocioComponent } from './negocios/ver-negocio/ver-negocio.component';
import { DndModule } from 'ngx-drag-drop';
import { TareasNegocioComponent } from './negocios/tareas-negocio/tareas-negocio.component';
import { TableNegociosComponent } from './negocios/table-negocios/table-negocios.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { HistorialNegocioComponent } from './negocios/historial-negocio/historial-negocio.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material';
import { ConfiguracionModule } from '../ajustes/configuracion/configuracion.module';
import { PagesModule } from '../pages.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ViewThirdComponent } from './terceros/view-third/view-third.component';
import { ModalNuevoNegocioComponent } from './negocios/modal-nuevo-negocio/modal-nuevo-negocio.component';
import { ChartModule } from 'angular2-chartjs';
import { ChartsModule } from 'ng2-charts';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
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
    ProcesosExternosConjuntoComponent,
    ApuServicioComponent,
    CrearApuServicioComponent,
    VerApuServicioComponent,
    EditarApuServicioComponent,
    ValidacionDimensionalComponent,
    MontajePuestaMarchaComponent,
    ApusComponent,
    NegociosComponent,
    VerNegocioComponent,
    TareasNegocioComponent,
    HistorialNegocioComponent,
    TableNegociosComponent,
    ViewThirdComponent,
    ModalNuevoNegocioComponent,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    NgbPaginationModule,
    ConfiguracionModule,
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
    NgxDropzoneModule,
    PerfectScrollbarModule,
    DndModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatPaginatorModule,
    MatTableModule,
    PagesModule,
    NgbTypeaheadModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    ChartModule,
    ChartsModule
  ]
})
export class CrmModule { }
