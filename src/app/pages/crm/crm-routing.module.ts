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

const routes: Routes = [
  { path: 'terceros', component: TercerosComponent },
  { path: 'terceros/crear-tercero', component: CrearTercerosComponent },
  { path: 'terceros/editar-tercero/:id', component: CrearTercerosComponent },
  { path: 'personas', component: PersonasComponent },

  { path: 'apus', component: ApusComponent },
  // { path: 'apu/apu-pieza', component: ApuPiezaComponent },
  { path: 'negocios', component: NegociosComponent },
  { path: 'negocios/:id', component: VerNegocioComponent },

  { path: 'apu/apu-pieza', component: ApuPiezaComponent },
  { path: 'apu/crear-apu-pieza', component: CrearApuPiezaComponent },
  { path: 'apu/editar-apu-pieza/:id', component: EditarApuPiezaComponent },
  { path: 'apu/ver-apu-pieza/:id', component: VerApuPiezaComponent },

  // { path: 'apu/apu-conjunto', component: ApuConjuntoComponent },
  { path: 'apu/crear-apu-conjunto', component: CrearApuConjuntoComponent },
  { path: 'apu/editar-apu-conjunto/:id', component: EditarApuConjuntoComponent },
  { path: 'apu/ver-apu-conjunto/:id', component: VerApuConjuntoComponent },

  { path: 'apu/apu-servicio', component: ApuServicioComponent },
  { path: 'apu/crear-apu-servicio', component: CrearApuServicioComponent },
  { path: 'apu/editar-apu-servicio/:id', component: EditarApuServicioComponent },
  { path: 'apu/ver-apu-servicio/:id', component: VerApuServicioComponent },

  { path: 'presupuesto', loadChildren: () => import('./presupuesto/presupuesto.module').then(m => m.PresupuestoModule) },
  { path: 'cotizacion', loadChildren: () => import('./cotizacion/cotizacion.module').then(m => m.CotizacionModule) }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
