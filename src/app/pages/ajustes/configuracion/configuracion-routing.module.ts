import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionEmpresaComponent } from './configuracion-empresa.component';


const routes : Routes = [
    { path: 'configuracion-empresa', component: ConfiguracionEmpresaComponent }
]


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class ConfiguracionRoutingModule {}