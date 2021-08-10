import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { EmpresasComponent } from './empresas/empresas.component';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { AseguradorasComponent } from './aseguradoras/aseguradoras.component';
import { RegimenesNivelesComponent } from './regimenes-niveles/regimenes-niveles.component';
import { DetalleFuncionarioComponent } from './funcionarios/detalle-funcionario/detalle-funcionario.component';
import {CreateComponent} from "./funcionarios/create/create.component";


const routes : Routes = [
    {path:'empresas',component:EmpresasComponent},
    {path:'funcionarios',component:FuncionariosComponent},
    {path:'funcionario/:id',component:DetalleFuncionarioComponent},
    {path:'funcionario-crear',component:CreateComponent},
    {path:'regimenes-niveles',component:RegimenesNivelesComponent},
    {path:'aseguradoras',component:AseguradorasComponent},
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class InformacionBaseRoutingModule {}
