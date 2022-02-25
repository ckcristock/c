import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RemisionesComponent } from './remisiones.component';
import { RemisioncrearnuevoComponent } from './remisioncrearnuevo/remisioncrearnuevo.component';
import { RemisioneditarComponent } from './remisioneditar/remisioneditar.component';
import { RemisionComponent } from './remision/remision.component';

const routes: Routes = [
  {
    path: '', component: RemisionesComponent
  },
  {
    path: 'remisioncrearnuevo', component: RemisioncrearnuevoComponent
  },
  {
    path: 'remision/:id', component: RemisionComponent
  },
  {
    path: 'remisioneditar/:id', component: RemisioneditarComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemisionRoutes { };
