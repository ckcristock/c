import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearTercerosComponent } from './terceros/crear-terceros/crear-terceros.component';
import { TercerosComponent } from './terceros/terceros.component';
import { PersonasComponent } from './terceros/personas/personas.component';
import { ApuPiezaComponent } from './apu-pieza/apu-pieza.component';
import { CrearApuPiezaComponent } from './apu-pieza/crear-apu-pieza/crear-apu-pieza.component';
import { VerApuPiezaComponent } from './apu-pieza/ver-apu-pieza/ver-apu-pieza.component';

const routes: Routes = [
  { path: 'terceros', component: TercerosComponent },
  { path: 'crear-tercero', component: CrearTercerosComponent },
  { path: 'editar-tercero/:id', component: CrearTercerosComponent },
  { path: 'personas', component: PersonasComponent },

  { path: 'apu-pieza', component: ApuPiezaComponent },
  { path: 'crear-apu-pieza', component: CrearApuPiezaComponent },
  { path: 'ver-apu-pieza/:id', component: VerApuPiezaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
