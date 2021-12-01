import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
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
import { UnidadesMedidasComponent } from './apu/unidades-medidas/unidades-medidas.component';
import { MaquinasHerramientasComponent } from './apu/maquinas-herramientas/maquinas-herramientas.component';
import { ProcesosInternosComponent } from './apu/procesos-internos/procesos-internos.component';
import { ProcesosExternosComponent } from "./apu/procesos-externos/procesos-externos.component";
import { MedidasComponent } from './apu/medidas/medidas.component';
import { CostosIndirectosComponent } from "./apu/costos-indirectos/costos-indirectos.component";
import { EspesoresComponent } from './apu/espesores/espesores.component';
import { CorteLaserMaterialComponent } from './apu/corte-laser-material/corte-laser-material.component';
import { PerfilesApuComponent } from './apu/perfiles-apu/perfiles-apu.component';
import { EstimacionViaticosComponent } from './apu/estimacion-viaticos/estimacion-viaticos.component';


const routes : Routes = [
    // { path: 'perfiles', component : PerfilesComponent },
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

    { path: 'apu/unidades-medidas', component: UnidadesMedidasComponent },
    { path: 'apu/variables-apu', component: MaquinasHerramientasComponent },
    { path: 'apu/procesos-internos', component: ProcesosInternosComponent },
    { path: 'apu/procesos-externos', component: ProcesosExternosComponent },

    { path: 'apu/medidas', component: MedidasComponent },

    { path: 'apu/costos-indirectos', component: CostosIndirectosComponent },

    { path: 'apu/espesores', component: EspesoresComponent },
    { path: 'apu/corte-laser-material', component: CorteLaserMaterialComponent },

    { path: 'apu/perfiles', component: PerfilesApuComponent },
    { path: 'apu/estimacion-viaticos', component: EstimacionViaticosComponent }
]


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class ParametrosRoutingModule {}