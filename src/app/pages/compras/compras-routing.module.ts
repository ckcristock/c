import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompraNacionalComponent } from './compra-nacional/compra-nacional.component';
import { CrearCompraNacionalComponent } from './compra-nacional/crear-compra-nacional/crear-compra-nacional.component';
import { VerCompraNacionalComponent } from './compra-nacional/ver-compra-nacional/ver-compra-nacional.component';
import { SolicitudesCompraComponent } from './solicitudes-compra/solicitudes-compra.component';
import { SolicitudCompraCrearComponent } from './solicitudes-compra/solicitud-compra-crear/solicitud-compra-crear.component';
import { SolicitudesCompraEditarComponent } from './solicitudes-compra/solicitudes-compra-editar/solicitudes-compra-editar.component';
import { SolicitudCompraVerComponent } from './solicitudes-compra/solicitud-compra-ver/solicitud-compra-ver.component';


const routes: Routes = [
  { path: 'compra-nacional', component: CompraNacionalComponent },
  { path: 'crear-nacional', component: CrearCompraNacionalComponent },
  { path: 'crear-nacional/:solicitud_id', component: CrearCompraNacionalComponent },
  { path: 'ver-nacional/:id', component: VerCompraNacionalComponent },
  { path: 'solicitud', component: SolicitudesCompraComponent },
  { path: 'solicitud/crear', component: SolicitudCompraCrearComponent },
  { path: 'solicitud/editar/:id', component: SolicitudesCompraEditarComponent },
  { path: 'solicitud/ver/:id', component: SolicitudCompraVerComponent },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasRoutingModule { }

