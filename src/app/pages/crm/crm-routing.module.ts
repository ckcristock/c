import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearTercerosComponent } from './terceros/crear-terceros/crear-terceros.component';
import { TercerosComponent } from './terceros/terceros.component';
import { PersonasComponent } from './terceros/personas/personas.component';
import { ApuPiezaComponent } from './apu-pieza/apu-pieza.component';
import { CrearApuPiezaComponent } from './apu-pieza/crear-apu-pieza/crear-apu-pieza.component';
import { VerApuPiezaComponent } from './apu-pieza/ver-apu-pieza/ver-apu-pieza.component';
import { EditarApuPiezaComponent } from './apu-pieza/editar-apu-pieza/editar-apu-pieza.component';
import { ApuConjuntoComponent } from './apu-conjunto/apu-conjunto.component';
import { CrearApuConjuntoComponent } from './apu-conjunto/crear-apu-conjunto/crear-apu-conjunto.component';
import { EditarApuConjuntoComponent } from './apu-conjunto/editar-apu-conjunto/editar-apu-conjunto.component';
import { VerApuConjuntoComponent } from './apu-conjunto/ver-apu-conjunto/ver-apu-conjunto.component';
import { ApuServicioComponent } from './apu-servicio/apu-servicio.component';
import { CrearApuServicioComponent } from './apu-servicio/crear-apu-servicio/crear-apu-servicio.component';
import { EditarApuServicioComponent } from './apu-servicio/editar-apu-servicio/editar-apu-servicio.component';
import { VerApuServicioComponent } from './apu-servicio/ver-apu-servicio/ver-apu-servicio.component';
import { ApusComponent } from './apus/apus.component';
import { NegociosComponent } from './negocios/negocios.component';
import { VerNegocioComponent } from './negocios/ver-negocio/ver-negocio.component';
import { ViewThirdComponent } from './terceros/view-third/view-third.component';
import { CopiarApuPiezaComponent } from './apu-pieza/copiar-apu-pieza/copiar-apu-pieza.component';
import { CopiarApuConjuntoComponent } from './apu-conjunto/copiar-apu-conjunto/copiar-apu-conjunto.component';
import { CopiarApuServicioComponent } from './apu-servicio/copiar-apu-servicio/copiar-apu-servicio.component';
import { ModalNuevoNegocioComponent } from './negocios/modal-nuevo-negocio/modal-nuevo-negocio.component';

const routes: Routes = [
  { path: 'terceros', component: TercerosComponent },
  { path: 'terceros/ver/:id', component: ViewThirdComponent },
  { path: 'terceros/crear-tercero', component: CrearTercerosComponent },
  { path: 'terceros/editar-tercero/:id', component: CrearTercerosComponent },
  { path: 'personas', component: PersonasComponent },

  { path: 'apus', component: ApusComponent },
  // { path: 'apu/apu-pieza', component: ApuPiezaComponent },
  { path: 'negocios', component: NegociosComponent },
  { path: 'negocios/crear', component: ModalNuevoNegocioComponent },
  { path: 'negocios/editar/:id', component: ModalNuevoNegocioComponent },
  { path: 'negocios/:id', component: VerNegocioComponent },

  { path: 'apu/apu-pieza', component: ApuPiezaComponent },
  { path: 'apu/crear-apu-pieza', component: CrearApuPiezaComponent },
  { path: 'apu/editar-apu-pieza/:id', component: EditarApuPiezaComponent },
  { path: 'apu/copiar-apu-pieza/:id', component: CopiarApuPiezaComponent },
  { path: 'apu/ver-apu-pieza/:id', component: VerApuPiezaComponent },

  // { path: 'apu/apu-conjunto', component: ApuConjuntoComponent },
  { path: 'apu/crear-apu-conjunto', component: CrearApuConjuntoComponent },
  { path: 'apu/editar-apu-conjunto/:id', component: EditarApuConjuntoComponent },
  { path: 'apu/ver-apu-conjunto/:id', component: VerApuConjuntoComponent },
  { path: 'apu/copiar-apu-conjunto/:id', component: CopiarApuConjuntoComponent },

  { path: 'apu/apu-servicio', component: ApuServicioComponent },
  { path: 'apu/crear-apu-servicio', component: CrearApuServicioComponent },
  { path: 'apu/editar-apu-servicio/:id', component: EditarApuServicioComponent },
  { path: 'apu/ver-apu-servicio/:id', component: VerApuServicioComponent },
  { path: 'apu/copiar-apu-servicio/:id', component: CopiarApuServicioComponent },

  { path: 'presupuesto', loadChildren: () => import('./presupuesto/presupuesto.module').then(m => m.PresupuestoModule) },
  { path: 'cotizacion', loadChildren: () => import('./cotizacion/cotizacion.module').then(m => m.CotizacionModule) }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
