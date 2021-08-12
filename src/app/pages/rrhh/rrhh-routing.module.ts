import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { VacantesComponent } from './vacantes/vacantes.component';
import { PostulantesComponent } from './postulantes/postulantes.component';
import { VacantesCrearComponent } from "./vacantes/vacantes-crear/vacantes-crear.component";
import { LlegadasTardesComponent } from "./llegadas-tardes/llegadas-tardes.component";
import { VacantesVerComponent } from "./vacantes/vacantes-ver/vacantes-ver.component";



const routes: Routes = [
    { path: 'vacantes', component: VacantesComponent },
    { path: 'vacantes-crear', component: VacantesCrearComponent },
    { path: 'vacantes-ver/:id', component: VacantesVerComponent },
    { path: 'postulantes', component: PostulantesComponent },
    { path: 'llegadas-tarde', component: LlegadasTardesComponent },
]


@NgModule({
    imports: [RouterModule.forChild(routes),

    ],
    exports: [RouterModule],
})

export class RrhhRouterModule { }