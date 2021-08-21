import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';


const routes : Routes = [
    { path: 'informacion-base',
             loadChildren : () => import('./informacion-base/informacion-base.module').then(m=>m.InformacionBaseModule) },

    { path : 'tipos', loadChildren : () => import('./tipos/tipos.module').then( m => m.TiposModule )},
    { path : 'parametros', loadChildren : () => import('./parametros/parametros.module').then( m => m.ParametrosModule )},
    { path : 'encuestas', loadChildren : () => import('./encuestas/encuestas.module').then( m => m.EncuestasModule )}
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class AjustesRoutingModule{}