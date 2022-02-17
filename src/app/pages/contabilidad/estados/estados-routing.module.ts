import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadosResultadosComponent } from './estados-resultados/estados-resultados.component';

const routes: Routes = [
  { path: 'estados-resultantes', component: EstadosResultadosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadosRoutingModule { }
