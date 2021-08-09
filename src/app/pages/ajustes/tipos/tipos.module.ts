import { NgModule } from "@angular/core";
import { TiposRoutingModule } from "./tipos-routing.module";
import { TiposAgendaComponent } from './tipos-agenda/tipos-agenda.component';
import { TiposConsultaComponent } from './tipos-consulta/tipos-consulta.component';


@NgModule({
    declarations : [TiposAgendaComponent, TiposConsultaComponent],
    imports : [TiposRoutingModule]
})

export class TiposModule{}