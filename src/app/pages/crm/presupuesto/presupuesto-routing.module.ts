import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { PresupuestosComponent } from './presupuestos.component';
import { CrearPresupuestoComponent } from './crear-presupuesto/crear-presupuesto.component';
import { EditarPresupuestoComponent } from './editar-presupuesto/editar-presupuesto.component';

const routes: Routes = [
    { path: '', component: PresupuestosComponent },
    { path: 'crear', component: CrearPresupuestoComponent },
    { path: 'editar/:id', component: EditarPresupuestoComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PresupuestoRoutingModule { }