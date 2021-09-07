import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { TiposAgendaComponent } from './tipos-agenda/tipos-agenda.component';
import { TiposConsultaComponent } from './tipos-consulta/tipos-consulta.component';
import { TiposContratoComponent } from './tipos-contrato/tipos-contrato.component';
import { TiposSalarioComponent } from './tipos-salario/tipos-salario.component';
import { TiposDocumentoComponent } from './tipos-documento/tipos-documento.component';
import { PaisesComponent } from "./paises/paises.component";


const routes : Routes = [
    { path: 'tipos-agenda' , component: TiposAgendaComponent },
    { path: 'tipos-consulta' , component: TiposConsultaComponent },
    { path: 'tipos-contrato' , component: TiposContratoComponent },
    { path: 'tipos-salario' , component: TiposSalarioComponent },
    { path: 'tipos-documento' , component: TiposDocumentoComponent },
    { path: 'paises' , component: PaisesComponent },
]

@NgModule({
    imports : [RouterModule.forChild(routes)],
    exports : [RouterModule]
})

export class TiposRoutingModule{}