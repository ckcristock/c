import { NgModule } from "@angular/core";
import { EmpresasComponent } from './empresas/empresas.component';
import { CommonModule } from '@angular/common';
import { InformacionBaseRoutingModule } from "./informacion-base-routing.module";
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { RegimenesNivelesComponent } from './regimenes-niveles/regimenes-niveles.component';
import { AseguradorasComponent } from './aseguradoras/aseguradoras.component';
import { NgbPaginationModule, NgbDropdownModule, NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { PipesModule } from "src/app/core/pipes/pipes.module";
import { DetalleFuncionarioComponent } from './funcionarios/detalle-funcionario/detalle-funcionario.component';
import { PermissionsComponent } from "./funcionarios/detalle-funcionario/permissions/permissions.component";
import { MenuChildComponent } from './funcionarios/detalle-funcionario/permissions/menu-child/menu-child.component';


@NgModule({
    declarations: [
        EmpresasComponent,  FuncionariosComponent,
        RegimenesNivelesComponent, AseguradorasComponent, 
        DetalleFuncionarioComponent,
        PermissionsComponent,
        MenuChildComponent],

    imports: [CommonModule, InformacionBaseRoutingModule,
        NgbPaginationModule, NgbDropdownModule, ChartsModule,
        ComponentsModule,
        FormsModule,
        NgSelectModule,
        NgbDropdownModule,
        NgbCollapseModule,
        PipesModule,
        NgbNavModule
    ]
})



export class InformacionBaseModule { }
