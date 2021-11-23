import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { CotizacionComponent } from './cotizacion.component';
import { CrearCotizacionComponent } from './crear-cotizacion/crear-cotizacion.component';


const routes: Routes = [
    { path: '', component: CotizacionComponent },
    { path: 'crear', component: CrearCotizacionComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CotizacionRoutingModule { }