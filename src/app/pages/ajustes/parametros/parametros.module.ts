import { NgModule } from "@angular/core";
import { ParametrosRoutingModule } from "./parametros-routing.module";
import { PerfilesComponent } from './perfiles/perfiles.component';
import { RgpComponent } from './rgp/rgp.component';
import { NotasTecnicasComponent } from './notas-tecnicas/notas-tecnicas.component';
import { ZonasComponent } from './zonas/zonas.component';
import { ComponentsModule } from "src/app/components/components.module";
import { HttpClientModule } from "@angular/common/http";
import { NgbDropdownModule, NgbPagination, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { CommonModule } from "@angular/common";
import { EpsComponent } from './eps/eps.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { MunicipiosComponent } from './municipios/municipios.component';
import { BancosComponent } from './bancos/bancos.component';
import { CuentasBancariasComponent } from './cuentas-bancarias/cuentas-bancarias.component';
import { HotelesComponent } from './viaticos/hoteles/hoteles.component';
import { TaxisComponent } from './viaticos/taxis/taxis.component';
import { LicenciaConduccionComponent } from './vacantes/licencia-conduccion/licencia-conduccion.component';



@NgModule({
    declarations : [
        NotasTecnicasComponent, 
        PerfilesComponent, 
        ZonasComponent, 
        RgpComponent, 
        EpsComponent, 
        DepartamentosComponent, 
        MunicipiosComponent, 
        BancosComponent, 
        CuentasBancariasComponent,
        HotelesComponent,
        TaxisComponent,
        LicenciaConduccionComponent
    ],
    imports: [ 
        ParametrosRoutingModule,
        ReactiveFormsModule,
        ComponentsModule,
        HttpClientModule,
        NgbDropdownModule,
        NgbPaginationModule,
        FormsModule,
        NgSelectModule,
        CommonModule
    ],
    exports: []
})

export class ParametrosModule {}