import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { VacantesComponent } from './vacantes/vacantes.component';
import { VacantesCrearComponent } from "./vacantes/vacantes-crear/vacantes-crear.component";
import { LlegadasTardesComponent } from "./llegadas-tardes/llegadas-tardes.component";
import { VacantesVerComponent } from "./vacantes/vacantes-ver/vacantes-ver.component";
import { NovedadesComponent } from './novedades/novedades.component';
import { DotacionesComponent } from './dotacion/dotaciones/dotaciones.component';
import { InventarioDotacionComponent } from './dotacion/inventario-dotacion/inventario-dotacion.component';
import { ActividadesComponent } from "./actividades/actividades.component";
import { ContratosComponent } from "./contratos/contratos.component";
import { DisciplinariosComponent } from "./procesos/disciplinarios/disciplinarios.component";
import { MemorandosComponent } from "./procesos/memorandos/memorandos.component";



const routes: Routes = [
    { path: 'vacantes', component: VacantesComponent },
    { path: 'vacantes-crear', component: VacantesCrearComponent },
    { path: 'vacantes-ver/:id', component: VacantesVerComponent },
    { path: 'actividades', component: ActividadesComponent },
    { path: 'novedades', component: NovedadesComponent },
    { path: 'llegadas-tarde', component: LlegadasTardesComponent },
    { path: 'contratos', component: ContratosComponent },
    { path: 'dotacion/dotaciones', component: DotacionesComponent },
    { path: 'dotacion/inventario', component: InventarioDotacionComponent },
    { path: 'procesos/disciplinarios', component: DisciplinariosComponent },
    { path: 'procesos/memorandos', component: MemorandosComponent }
]


@NgModule({
    imports: [RouterModule.forChild(routes),

    ],
    exports: [RouterModule],
})

export class RrhhRouterModule { }
