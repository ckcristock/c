import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventarioFisicoComponent } from './inventario-fisico/inventario-fisico.component';
import { InventarioComponent } from './inventario/inventario.component';
import { ActaRecepcionComponent } from './acta-recepcion/acta-recepcion.component';
import { CrearActaRecepcionComponent } from './acta-recepcion/crear-acta-recepcion/crear-acta-recepcion.component';
import { ActaRecepionAprobadosComponent } from './acta-recepion-aprobados/acta-recepion-aprobados.component';
import { VerActaRecepcionComponent } from './acta-recepcion/ver-acta-recepcion/ver-acta-recepcion.component';
import { AcomodarActaComponent } from './acta-recepion-aprobados/acomodar-acta/acomodar-acta.component';
import { InventarioVencerComponent } from './inventario-vencer/inventario-vencer.component';
import { AlistamientoComponent } from './alistamiento/alistamiento.component';
import { AlistamientoCrearComponent } from './alistamiento/alistamiento-crear/alistamiento-crear.component';
import { InventarioEstibasComponent } from './inventario-fisico/inventario-estibas/inventario-estibas.component';
import { CrearActaRecepcionOldComponent } from './acta-recepcion/crear-acta-recepcion-old/crear-acta-recepcion-old.component';

const routes: Routes = [
  { path: 'inventario', component: InventarioComponent },
  { path: 'inventario-fisico', component: InventarioFisicoComponent },
  { path: 'acta-recepcion', component: ActaRecepcionComponent },
  { path: 'acta-recepcion/crear/:codigo/:compra', component: CrearActaRecepcionComponent },
  { path: 'acta-recepcion/crear-old/:codigo/:compra', component: CrearActaRecepcionOldComponent },
  { path: 'acta-recepcion/ver/:id', component: VerActaRecepcionComponent },
  { path: 'acta-recepcion-aprobados', component: ActaRecepionAprobadosComponent },
  { path: 'acta-recepcion-acomodar/:tipo/:id/:lugar/:idLugar', component: AcomodarActaComponent },
  { path: 'vencer', component: InventarioVencerComponent },
  { path: 'inventario-estibas/:id', component: InventarioEstibasComponent },
  { path: 'alistamiento', component: AlistamientoComponent },
  { path: 'alistamiento/crear/:id/:tipo/:idc', component: AlistamientoCrearComponent },
  { path: 'remisiones', loadChildren: () => import('./remision/remision.module').then(m => m.RemisionModule) },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventarioRoutingModule { }
