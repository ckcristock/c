import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearTercerosComponent } from './terceros/crear-terceros/crear-terceros.component';
import { TercerosComponent } from './terceros/terceros.component';
import { PersonasComponent } from './terceros/personas/personas.component';

const routes: Routes = [
  { path: 'terceros', component: TercerosComponent },
  
  { path: 'crear-tercero', component: CrearTercerosComponent },
  { path: 'editar-tercero/:id', component: CrearTercerosComponent },

  { path: 'personas', component: PersonasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
