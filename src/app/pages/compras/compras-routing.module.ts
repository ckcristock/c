import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompraNacionalComponent } from './compra-nacional/compra-nacional.component';
import { CrearCompraNacionalComponent } from './compra-nacional/crear-compra-nacional/crear-compra-nacional.component';
import { VerCompraNacionalComponent } from './compra-nacional/ver-compra-nacional/ver-compra-nacional.component';
import { SolicitudesCompraComponent } from './solicitudes-compra/solicitudes-compra.component';
import { SolicitudCompraCrearComponent } from './solicitudes-compra/solicitud-compra-crear/solicitud-compra-crear.component';

const routes: Routes = [
  { path: 'compra-nacional', component: CompraNacionalComponent },
  { path: 'crear-nacional', component: CrearCompraNacionalComponent },
  { path: 'ver-nacional/:id', component: VerCompraNacionalComponent },
  { path: 'solicitud', component: SolicitudesCompraComponent },
  { path: 'solicitud/crear', component: SolicitudCompraCrearComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasRoutingModule {}
