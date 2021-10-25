import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { RgpComponent } from './rgp/rgp.component';
import { NotasTecnicasComponent } from './notas-tecnicas/notas-tecnicas.component';
import { ZonasComponent } from "./zonas/zonas.component";
import { EpsComponent } from "./eps/eps.component";
import { DepartamentosComponent } from "./departamentos/departamentos.component";
import { BancosComponent } from './bancos/bancos.component';
import { CuentasBancariasComponent } from "./cuentas-bancarias/cuentas-bancarias.component";
import { HotelesComponent } from './viaticos/hoteles/hoteles.component';
import { TaxisComponent } from './viaticos/taxis/taxis.component';
import { LicenciaConduccionComponent } from './vacantes/licencia-conduccion/licencia-conduccion.component';


const routes : Routes = [
    { path: 'perfiles', component : PerfilesComponent },
    { path: 'rgp', component : RgpComponent },
    { path: 'zonas', component : ZonasComponent },
    { path: 'eps', component:  EpsComponent},
    { path: 'notas-tecnicas', component : NotasTecnicasComponent },
    { path: 'departamentos', component : DepartamentosComponent },
    { path: 'bancos', component : BancosComponent },
    { path: 'cuentas-bancarias', component : CuentasBancariasComponent },
    { path: 'viaticos/hoteles', component: HotelesComponent },
    { path: 'viaticos/taxis', component: TaxisComponent },
    { path: 'vacantes/licencia-conduccion', component: LicenciaConduccionComponent }
]


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class ParametrosRoutingModule {}