import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { CotizacionComponent } from './cotizacion.component';
import { CrearCotizacionComponent } from './crear-cotizacion/crear-cotizacion.component';
import { ViewQuotationComponent } from "./view-quotation/view-quotation.component";


const routes: Routes = [
    { path: '', component: CotizacionComponent },
    { path: 'crear', component: CrearCotizacionComponent },
    { path: 'editar/:id', component: CrearCotizacionComponent },
    { path: 'copiar/:id', component: CrearCotizacionComponent },
    { path: 'ver/:id', component: ViewQuotationComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CotizacionRoutingModule { }
