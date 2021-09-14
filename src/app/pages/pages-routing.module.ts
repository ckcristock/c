import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'ajustes',          loadChildren : () => import('./ajustes/ajustes.module').then(m => m.AjustesModule )},
    { path: 'rrhh',   loadChildren : () => import('./rrhh/rrhh.module').then(m => m.RrhhModule )},
    { path: 'nomina',   loadChildren : () => import('./nomina/nomina.module').then(m => m.NominaModule )},

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
