import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionEmpresaComponent } from './configuracion-empresa/configuracion-empresa.component';
import { CamposTercerosComponent } from './campos-terceros/campos-terceros.component';


const routes : Routes = [
    { path: 'configuracion-empresa', component: ConfiguracionEmpresaComponent },
    { path: 'campos-terceros', component: CamposTercerosComponent }
]


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class ConfiguracionRoutingModule {}