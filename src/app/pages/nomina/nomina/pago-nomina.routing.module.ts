import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NominaComponent } from './nomina.component';
import { ColillaPagoComponent } from './calculos/colilla-pago/colilla-pago.component';
import { NominaFuncionarioComponent } from './calculos/nomina-funcionario.component';

const routes : Routes = [
    { path:'/', component:NominaComponent},
    { path:'colilla/:pid/:inicio/:fin', component:NominaFuncionarioComponent}
]


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class PagoNominaRoutingModule{}
