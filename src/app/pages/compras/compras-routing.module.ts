import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompraNacionalComponent } from './compra-nacional/compra-nacional.component';
import { CrearCompraNacionalComponent } from './compra-nacional/crear-compra-nacional/crear-compra-nacional.component';
import { VerCompraNacionalComponent } from './compra-nacional/ver-compra-nacional/ver-compra-nacional.component';

const routes: Routes = [
  { path: 'compra-nacional', component: CompraNacionalComponent },
  { path: 'crear-nacional', component: CrearCompraNacionalComponent },
  { path: 'ver-nacional/:id', component: VerCompraNacionalComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasRoutingModule {}
