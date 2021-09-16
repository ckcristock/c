import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViaticosComponent } from './viaticos/viaticos.component';

const routes: Routes = [
  { path: 'viaticos', component: ViaticosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContabilidadRoutingModule {}