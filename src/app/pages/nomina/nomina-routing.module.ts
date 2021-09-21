import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { PrestamosLibranzasComponent } from './prestamos-libranzas/prestamos-libranzas.component';
import { ViaticosComponent } from './viaticos/viaticos.component';
import { CrearViaticosComponent } from './viaticos/crear-viaticos/crear-viaticos.component';
import {VerViaticosComponent} from './viaticos/ver-viaticos/ver-viaticos.component';

const routes: Routes = [
    { path:'prestamos', component: PrestamosLibranzasComponent},
    { path: 'viaticos', component: ViaticosComponent },
    { path: 'ver-viatico/:id', component: VerViaticosComponent },
    { path: 'crear-viatico', component: CrearViaticosComponent }
]

@NgModule({
    imports:[ RouterModule.forChild(routes) ],
    exports:[ RouterModule ]
})

export class NominaRoutingModule {}
