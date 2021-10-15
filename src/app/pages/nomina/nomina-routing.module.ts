import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { PrestamosLibranzasComponent } from './prestamos-libranzas/prestamos-libranzas.component';
import { ViaticosComponent } from './viaticos/viaticos.component';
import { CrearViaticosComponent } from './viaticos/crear-viaticos/crear-viaticos.component';
import {VerViaticosComponent} from './viaticos/ver-viaticos/ver-viaticos.component';
import { EditarViaticoComponent } from './viaticos/editar-viatico/editar-viatico.component';
import { VacacionesComponent } from './vacaciones/vacaciones.component';
import { NominaComponent } from './nomina/nomina.component';
import { PrimasComponent } from './primas/primas.component';
import { PrimaFuncionarioComponent } from './primas/prima-funcionario/prima-funcionario.component';

const routes: Routes = [
    { path:'prestamos', component: PrestamosLibranzasComponent},
    { path: 'viaticos', component: ViaticosComponent },
    { path: 'ver-viatico/:id', component: VerViaticosComponent },
    { path: 'crear-viatico', component: CrearViaticosComponent },
    { path: 'editar-viatico/:id', component: EditarViaticoComponent },
    { path: 'vacaciones', component: VacacionesComponent},
    { path: 'nomina', component: NominaComponent},
    { path: 'primas', component: PrimasComponent},
    { path: 'prima/:anio/:periodo', component: PrimaFuncionarioComponent},
]

@NgModule({
    imports:[ RouterModule.forChild(routes) ],
    exports:[ RouterModule ]
})

export class NominaRoutingModule {}
