import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { TiposAgendaComponent } from './tipos-agenda/tipos-agenda.component';
import { TiposConsultaComponent } from './tipos-consulta/tipos-consulta.component';
import { TiposRiesgoComponent } from './tipos-riesgo/tipos-riesgo.component';
import { TiposNovedadesComponent } from "./tipos-novedades/tipos-novedades.component";
import { TiposEgresoComponent } from './tipos-egreso/tipos-egreso.component';
import { TiposIngresoComponent } from './tipos-ingreso/tipos-ingreso.component';
import { ProfesionesComponent } from './profesiones/profesiones.component';
import { TiposActivoFijoComponent } from './tipos-activo-fijo/tipos-activo-fijo.component';
import { TiposRetencionesComponent } from './tipos-retenciones/tipos-retenciones.component';
import { TiposRegimenComponent } from './tipos-regimen/tipos-regimen.component';
import { TiposVisaComponent } from './tipos-visa/tipos-visa.component';
import { TiposActividadesComponent } from './tipos-actividades/tipos-actividades.component';
import { ResponsabilidadesFiscalesComponent } from "./responsabilidades-fiscales/responsabilidades-fiscales.component";

const routes: Routes = [
    { path: 'tipos-agenda', component: TiposAgendaComponent },
    { path: 'tipos-consulta', component: TiposConsultaComponent },
    { path: 'tipos-riesgo', component: TiposRiesgoComponent },
    { path: 'tipos-novedad', component: TiposNovedadesComponent },
    { path: 'tipos-egreso', component: TiposEgresoComponent },
    { path: 'tipos-ingreso', component: TiposIngresoComponent },
    { path: 'profesiones', component: ProfesionesComponent },
    { path: 'tipos-activo-fijo', component: TiposActivoFijoComponent },
    { path: 'tipos-retenciones', component: TiposRetencionesComponent },
    { path: 'tipos-regimen', component: TiposRegimenComponent },
    { path: 'responsabilidades-fiscales', component: ResponsabilidadesFiscalesComponent },
    { path: 'tipos-visa', component: TiposVisaComponent },
    { path: 'tipos-actividades', component: TiposActividadesComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TiposRoutingModule { }
