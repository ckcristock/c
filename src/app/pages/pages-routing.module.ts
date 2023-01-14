import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskViewComponent } from './tasks/task-view/task-view.component';
import { NoautorizadoComponent } from './noautorizado/noautorizado.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'task', component: TasksComponent },
    { path: 'task/:id', component: TaskViewComponent },
    { path: 'ajustes',          loadChildren : () => import('./ajustes/ajustes.module').then(m => m.AjustesModule )},
    { path: 'rrhh',   loadChildren : () => import('./rrhh/rrhh.module').then(m => m.RrhhModule )},
    { path: 'contabilidad',   loadChildren : () => import('./contabilidad/contabilidad.module').then(m => m.ContabilidadModule )},
    { path: 'nomina',   loadChildren : () => import('./nomina/nomina.module').then(m => m.NominaModule )},
    { path: 'crm',   loadChildren : () => import('./crm/crm.module').then(m => m.CrmModule )},
    { path: 'manufactura',   loadChildren : () => import('./manufactura/manufactura.module').then(m => m.ManufacturaModule )},
    { path: 'compras',   loadChildren : () => import('./compras/compras.module').then(m => m.ComprasModule )},
    { path: 'inventario', loadChildren: () => import('./inventario/inventario.module').then(m => m.InventarioModule) },
    { path: 'sst', loadChildren: () => import('./sst/sst.module').then(m => m.SstModule) },
    { path: 'notauthorized', component: NoautorizadoComponent}


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
