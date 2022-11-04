import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionEmpresaComponent } from './configuracion-empresa/configuracion-empresa.component';
import { CamposTercerosComponent } from './campos-terceros/campos-terceros.component';
import { DepartamentosComponent } from './departamentos-municipios/departamentos/departamentos.component';
import { CiudadesComponent } from './paises-ciudades/ciudades/ciudades.component';
import { PaisesCiudadesComponent } from "./paises-ciudades/paises-ciudades.component";
import { DepartamentosMunicipiosComponent } from './departamentos-municipios/departamentos-municipios.component';
import { BaseCalculosComponent } from "./base-calculos/base-calculos.component";
import { NominaComponent } from "./nomina/nomina.component";
import { LocalidadesComponent } from "./localidades/localidades.component";



const routes : Routes = [
    { path: 'configuracion-empresa/:value', component: ConfiguracionEmpresaComponent },
    { path: 'campos-terceros', component: CamposTercerosComponent },
    { path: 'ubicaciones', component: LocalidadesComponent },
    { path: 'base-calculos', component: BaseCalculosComponent },
    { path: 'configuracion-nomina', component: NominaComponent },
]


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class ConfiguracionRoutingModule {}
