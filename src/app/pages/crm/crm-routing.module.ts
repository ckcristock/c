import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TercerosComponent } from '../ajustes/informacion-base/terceros/terceros.component';

const routes: Routes = [
  { path: 'clientes', component: TercerosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
