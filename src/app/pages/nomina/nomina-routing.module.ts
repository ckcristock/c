import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { PrestamosLibranzasComponent } from './prestamos-libranzas/prestamos-libranzas.component';
import { ViaticosComponent } from './viaticos/viaticos.component';

const routes: Routes = [
    { path:'prestamos', component: PrestamosLibranzasComponent},
    { path: 'viaticos', component: ViaticosComponent }
]

@NgModule({
    imports:[ RouterModule.forChild(routes) ],
    exports:[ RouterModule ]
})

export class NominaRoutingModule {}
