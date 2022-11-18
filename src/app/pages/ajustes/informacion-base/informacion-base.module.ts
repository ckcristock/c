import { NgModule } from '@angular/core';
import { EmpresasComponent } from './empresas/empresas.component';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


import { InformacionBaseRoutingModule } from './informacion-base-routing.module';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { RegimenesNivelesComponent } from './regimenes-niveles/regimenes-niveles.component';
import { AseguradorasComponent } from './aseguradoras/aseguradoras.component';
import {
  NgbPaginationModule,
  NgbDropdownModule,
  NgbCollapseModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DetalleFuncionarioComponent } from './funcionarios/detalle-funcionario/detalle-funcionario.component';
import { PermissionsComponent } from './funcionarios/detalle-funcionario/permissions/permissions.component';
import { MenuChildComponent } from './funcionarios/detalle-funcionario/permissions/menu-child/menu-child.component';
import { SetFuncionarioComponent } from './funcionarios/detalle-funcionario/set-funcionario/set-funcionario.component';
import { CreateComponent } from './funcionarios/create/create.component';
import { ArchwizardModule } from 'angular-archwizard';
import { DatosFuncionarioComponent } from './funcionarios/create/datos-funcionario/datos-funcionario.component';
import { InformacionEmpresaComponent } from './funcionarios/create/informacion-empresa/informacion-empresa.component';
import { PrestacionesSocialesComponent } from './funcionarios/create/prestaciones-sociales/prestaciones-sociales.component';
import { DotacionTallasComponent } from './funcionarios/create/dotacion-tallas/dotacion-tallas.component';
import { EstructuraEmpresaComponent } from './estructura-empresa/estructura-empresa.component';
import { VerFuncionarioComponent } from './funcionarios/detalle-funcionario/ver-funcionario/ver-funcionario.component';
import { DatosBasicosComponent } from './funcionarios/detalle-funcionario/ver-funcionario/datos-basicos/datos-basicos.component';
import { SalarioComponent } from './funcionarios/detalle-funcionario/ver-funcionario/salario/salario.component';
import { DatosEmpresaComponent } from './funcionarios/detalle-funcionario/ver-funcionario/datos-empresa/datos-empresa.component';
import { AfiliacionesComponent } from './funcionarios/detalle-funcionario/ver-funcionario/afiliaciones/afiliaciones.component';
import { HttpClientModule } from '@angular/common/http';
import { TurnosComponent } from './turnos/turnos.component';
import { TurnoFijoComponent } from './turnos/turno-fijo/turno-fijo.component';
import { CreateTurnoFijoComponent } from './turnos/turno-fijo/create-turno-fijo/create-turno-fijo.component';
import { TurnoRotativoComponent } from './turnos/turno-rotativo/turno-rotativo.component';
import { CreateTurnoRotativoComponent } from './turnos/turno-rotativo/create-turno-rotativo/create-turno-rotativo.component';
import { BonoComponent } from './funcionarios/detalle-funcionario/ver-funcionario/bono/bono.component';
import { FondoPensionComponent } from './fondo-pension/fondo-pension.component';
import { ArlComponent } from './arl/arl.component';
import { CajaCompensacionComponent } from './caja-compensacion/caja-compensacion.component';
import { FondoCesantiasComponent } from './fondo-cesantias/fondo-cesantias.component';
import { NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { TableProductosCatalogoComponent } from './catalogo/components/table-productos-catalogo/table-productos-catalogo.component';
import { ActivoFijoCatalogoComponent } from './catalogo/components/activo-fijo-catalogo/activo-fijo-catalogo.component';
import { ProductoComponent } from './productos/producto/producto.component';
import { EditarProductoComponent } from './productos/editar-producto/editar-producto.component';
import { CrearProductoComponent } from './productos/crear-producto/crear-producto.component';
import { ProductosComponent } from './productos/productos.component';
import { MaterialesComponent } from './catalogo/components/materiales/materiales.component';
import { DotacionCrearComponent } from './catalogo/components/dotacion-crear/dotacion-crear.component';
import { BoardPermissionsComponent } from './funcionarios/detalle-funcionario/permissions/board-permissions/board-permissions.component';
//import { MaterialesComponent } from '../parametros/apu/materiales/materiales.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SedesComponent } from './sedes/sedes.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { VerLiquidacionComponent } from './funcionarios/detalle-funcionario/ver-liquidacion/ver-liquidacion.component';
import { BodegasComponent } from './bodegas/bodegas.component';
import { CrearbodegaComponent } from './bodegas/crearbodega/crearbodega.component';
import { GrupoestibaComponent } from './bodegas/grupoestiba/grupoestiba.component';
import { FilePermissionsComponent } from './funcionarios/detalle-funcionario/permissions/file-permissions/file-permissions.component';

@NgModule({
  declarations: [
    CrearbodegaComponent,
    GrupoestibaComponent,
    EmpresasComponent,
    FuncionariosComponent,
    RegimenesNivelesComponent,
    AseguradorasComponent,
    DetalleFuncionarioComponent,
    PermissionsComponent,
    MenuChildComponent,
    SetFuncionarioComponent,
    CreateComponent,
    DatosFuncionarioComponent,
    InformacionEmpresaComponent,
    PrestacionesSocialesComponent,
    DotacionTallasComponent,
    EstructuraEmpresaComponent,
    VerFuncionarioComponent,
    DatosBasicosComponent,
    SalarioComponent,
    DatosEmpresaComponent,
    AfiliacionesComponent,
    TurnosComponent,
    TurnoFijoComponent,
    CreateTurnoFijoComponent,
    TurnoRotativoComponent,
    CreateTurnoRotativoComponent,
    BonoComponent,
    FondoPensionComponent,
    ArlComponent,
    CajaCompensacionComponent,
    FondoCesantiasComponent,
    CatalogoComponent,
    TableProductosCatalogoComponent,
    ActivoFijoCatalogoComponent,
    ProductoComponent,
    EditarProductoComponent,
    CrearProductoComponent,
    ProductosComponent,
    MaterialesComponent,
    DotacionCrearComponent,
    BoardPermissionsComponent,
    SedesComponent,
    VerLiquidacionComponent,
    BodegasComponent,
    FilePermissionsComponent,
  ],

  imports: [
    CommonModule,
    InformacionBaseRoutingModule,
    NgbPaginationModule,
    NgbDropdownModule,
    ChartsModule,
    ComponentsModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    NgbDropdownModule,
    NgbCollapseModule,
    PipesModule,
    ReactiveFormsModule,
    ArchwizardModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    PerfectScrollbarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    SweetAlert2Module.forRoot(),
  ],
  exports: [
    ArlComponent,
    FondoPensionComponent,
    FondoCesantiasComponent,
    CajaCompensacionComponent,
    EstructuraEmpresaComponent,
    SedesComponent
  ]
})
export class InformacionBaseModule { }
