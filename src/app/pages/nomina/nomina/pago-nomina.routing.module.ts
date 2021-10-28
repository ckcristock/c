import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NominaComponent } from './nomina.component';

const routes : Routes = [
    { path:'/', component:NominaComponent }
]


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class PagoNominaRoutingModule{}
