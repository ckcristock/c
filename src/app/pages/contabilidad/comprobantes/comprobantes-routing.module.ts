import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotasContablesComponent } from './notas-contables/notas-contables.component';
import { CrearNotaContableComponent } from './notas-contables/crear-nota-contable/crear-nota-contable.component';

const routes: Routes = [
    { path: 'notas-contables', component: NotasContablesComponent },
    { path: 'crear-nota-contable', component: CrearNotaContableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprobantesRoutingModule {}
