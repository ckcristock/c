import { NgModule } from "@angular/core";
import { TiposRoutingModule } from "./tipos-routing.module";
import { TiposAgendaComponent } from './tipos-agenda/tipos-agenda.component';
import { TiposConsultaComponent } from './tipos-consulta/tipos-consulta.component';
import { TiposContratoComponent } from './tipos-contrato/tipos-contrato.component';
import { TiposSalarioComponent } from './tipos-salario/tipos-salario.component';
import { TiposDocumentoComponent } from './tipos-documento/tipos-documento.component';
import { ComponentsModule } from '../../../components/components.module';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { TiposNovedadesComponent } from './tipos-novedades/tipos-novedades.component';
import { TiposGlosaComponent } from './tipos-glosa/tipos-glosa.component';
import { TiposRetencionesComponent } from './tipos-retenciones/tipos-retenciones.component';
import { TiposEgresoComponent } from './tipos-egreso/tipos-egreso.component';
import { TiposIngresoComponent } from './tipos-ingreso/tipos-ingreso.component';
import { TiposEstadoFinancieroComponent } from './tipos-estado-financiero/tipos-estado-financiero.component';
import { TiposAnulacionComponent } from './tipos-anulacion/tipos-anulacion.component';
import { TiposRechazoComponent } from './tipos-rechazo/tipos-rechazo.component';
import { TiposActivoFijoComponent } from './tipos-activo-fijo/tipos-activo-fijo.component';


@NgModule({
    declarations : [
        TiposAgendaComponent,
        TiposConsultaComponent,
        TiposContratoComponent,
        TiposSalarioComponent, 
        TiposDocumentoComponent, 
        TiposNovedadesComponent, 
        TiposGlosaComponent, 
        TiposRetencionesComponent, 
        TiposEgresoComponent, 
        TiposIngresoComponent, 
        TiposEstadoFinancieroComponent,
        TiposAnulacionComponent, 
        TiposRechazoComponent, 
        TiposActivoFijoComponent
    ],
    imports : [
        TiposRoutingModule,
        ComponentsModule,
        NgbDropdownModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        NgbPaginationModule
    ]
})

export class TiposModule{}