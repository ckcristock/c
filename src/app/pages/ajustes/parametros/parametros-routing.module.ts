import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { RgpComponent } from './rgp/rgp.component';
import { NotasTecnicasComponent } from './notas-tecnicas/notas-tecnicas.component';
import { ZonasComponent } from "./zonas/zonas.component";
import { EpsComponent } from "./eps/eps.component";
import { BancosComponent } from './bancos/bancos.component';
import { CuentasBancariasComponent } from "./cuentas-bancarias/cuentas-bancarias.component";
import { HotelesComponent } from './viaticos/hoteles/hoteles.component';
import { TaxisComponent } from './viaticos/taxis/taxis.component';
import { LicenciaConduccionComponent } from './vacantes/licencia-conduccion/licencia-conduccion.component';
import { GeometriasComponent } from './apu/geometrias/geometrias.component';
import { CrearGeometriaComponent } from './apu/geometrias/crear-geometria/crear-geometria.component';
import { VerGeometriaComponent } from './apu/geometrias/ver-geometria/ver-geometria.component';
import { MaterialesComponent } from './apu/materiales/materiales.component';


const routes : Routes = [
    { path: 'perfiles', component : PerfilesComponent },
    { path: 'rgp', component : RgpComponent },
    { path: 'zonas', component : ZonasComponent },
    { path: 'eps', component:  EpsComponent},
    { path: 'notas-tecnicas', component : NotasTecnicasComponent },
    { path: 'bancos', component : BancosComponent },
    { path: 'cuentas-bancarias', component : CuentasBancariasComponent },
    { path: 'viaticos/hoteles', component: HotelesComponent },
    { path: 'viaticos/taxis', component: TaxisComponent },
    { path: 'vacantes/licencia-conduccion', component: LicenciaConduccionComponent },
    { path: 'apu/geometrias', component: GeometriasComponent },
    { path: 'apu/crear-geometria', component: CrearGeometriaComponent },
    { path: 'apu/editar-geometria/:id', component: CrearGeometriaComponent },
    { path: 'apu/ver-geometria/:id', component: VerGeometriaComponent },

    { path: 'apu/materiales', component: MaterialesComponent },
]


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class ParametrosRoutingModule {}