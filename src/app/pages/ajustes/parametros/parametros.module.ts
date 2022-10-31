import { NgModule } from "@angular/core";
import { ParametrosRoutingModule } from "./parametros-routing.module";
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
import { BancosComponent } from './bancos/bancos.component';
import { CuentasBancariasComponent } from './cuentas-bancarias/cuentas-bancarias.component';
import { HotelesComponent } from './viaticos/hoteles/hoteles.component';
import { TaxisComponent } from './viaticos/taxis/taxis.component';
import { LicenciaConduccionComponent } from './vacantes/licencia-conduccion/licencia-conduccion.component';
import { GeometriasComponent } from './apu/geometrias/geometrias.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CrearGeometriaComponent } from './apu/geometrias/crear-geometria/crear-geometria.component';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { VerGeometriaComponent } from './apu/geometrias/ver-geometria/ver-geometria.component';
//import { MaterialesComponent } from './apu/materiales/materiales.component';
import { UnidadesMedidasComponent } from './apu/unidades-medidas/unidades-medidas.component';
import { MaquinasHerramientasComponent } from './apu/maquinas-herramientas/maquinas-herramientas.component';
import { ProcesosInternosComponent } from './apu/procesos-internos/procesos-internos.component';
import { ProcesosExternosComponent } from './apu/procesos-externos/procesos-externos.component';
import { MedidasComponent } from './apu/medidas/medidas.component';
import { CostosIndirectosComponent } from './apu/costos-indirectos/costos-indirectos.component';
import { EspesoresComponent } from './apu/espesores/espesores.component';
import { CorteLaserMaterialComponent } from './apu/corte-laser-material/corte-laser-material.component';
import { PerfilesApuComponent } from './apu/perfiles-apu/perfiles-apu.component';
import { EstimacionViaticosComponent } from './apu/estimacion-viaticos/estimacion-viaticos.component';
import { EstimacionViaticosValuesComponent } from './apu/estimacion-viaticos-values/estimacion-viaticos-values.component';
import { ValorAlmuerzosComponent } from './valor-almuerzos/valor-almuerzos.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { SubcategoriasComponent } from './subcategorias/subcategorias.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from "@angular/material/paginator";
import { NominaComponent } from './nomina/nomina.component';
import { InformacionBaseModule } from "../informacion-base/informacion-base.module";



@NgModule({
    declarations: [
        NotasTecnicasComponent,
        // PerfilesComponent,
        ZonasComponent,
        RgpComponent,
        EpsComponent,
        BancosComponent,
        CuentasBancariasComponent,
        HotelesComponent,
        TaxisComponent,
        LicenciaConduccionComponent,
        GeometriasComponent,
        CrearGeometriaComponent,
        VerGeometriaComponent,
        //MaterialesComponent,
        UnidadesMedidasComponent,
        MaquinasHerramientasComponent,
        ProcesosInternosComponent,
        ProcesosExternosComponent,
        MedidasComponent,
        CostosIndirectosComponent,
        EspesoresComponent,
        CorteLaserMaterialComponent,
        PerfilesApuComponent,
        EstimacionViaticosComponent,
        EstimacionViaticosValuesComponent,
        ValorAlmuerzosComponent,
        CategoriasComponent,
        SubcategoriasComponent,
        NominaComponent
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
        CommonModule,
        PerfectScrollbarModule,
        PipesModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatToolbarModule,
        MatPaginatorModule,
        SweetAlert2Module.forRoot(),
        InformacionBaseModule
    ],
    exports: []
})

export class ParametrosModule { }
