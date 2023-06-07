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
  NgbAccordionModule
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
import { NgbTooltipModule, NgbTypeaheadModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { TableProductosCatalogoComponent } from './catalogo/components/table-productos-catalogo/table-productos-catalogo.component';
import { ActivoFijoCatalogoComponent } from './catalogo/components/activo-fijo-catalogo/activo-fijo-catalogo.component';
import { ProductoComponent } from './productos/producto/producto.component';
import { CrearProductoComponent } from './productos/crear-producto/crear-producto.component';
import { DotacionCrearComponent } from './catalogo/components/dotacion-crear/dotacion-crear.component';
import { BoardPermissionsComponent } from './funcionarios/detalle-funcionario/permissions/board-permissions/board-permissions.component';
import { SedesComponent } from './sedes/sedes.component';
import {
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatTreeModule,
  MatListModule,
  MatBadgeModule,
  MatButtonModule,
  MatTooltipModule
} from '@angular/material';
import { VerLiquidacionComponent } from './funcionarios/detalle-funcionario/ver-liquidacion/ver-liquidacion.component';
import { BodegasComponent } from './bodegas/bodegas.component';
import { CrearbodegaComponent } from './bodegas/crearbodega/crearbodega.component';
import { GrupoestibaComponent } from './bodegas/grupoestiba/grupoestiba.component';
import { FilePermissionsComponent } from './funcionarios/detalle-funcionario/permissions/file-permissions/file-permissions.component';
import { CatSubcatModule } from '../parametros/cat-subcat/cat-subcat.module';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DropdownModule } from 'primeng/dropdown';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
import { ProfilePermissionsComponent } from './funcionarios/detalle-funcionario/permissions/profile-permissions/profile-permissions.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { EmbalajeComponent } from './catalogo/components/embalaje/embalaje.component';
import { EditarProductoComponent } from './productos/editar-producto/editar-producto.component';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ResponsablesComponent } from './responsables/responsables.component';

@NgModule({
  declarations: [
    CrearbodegaComponent,
    GrupoestibaComponent,
    EmpresasComponent,
    FuncionariosComponent,
    ResponsablesComponent,
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
    CrearProductoComponent,
    DotacionCrearComponent,
    BoardPermissionsComponent,
    SedesComponent,
    VerLiquidacionComponent,
    BodegasComponent,
    FilePermissionsComponent,
    ProfilePermissionsComponent,
    EmbalajeComponent,
    EditarProductoComponent,
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
    NgbAccordionModule,
    NgbModule,
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
    MatTreeModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatListModule,
    MatBadgeModule,
    MatButtonModule,
    CatSubcatModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    DirectivesModule,
    CurrencyMaskModule,
    DropdownModule,
    SweetAlert2Module.forRoot(),
  ],
  exports: [
    ArlComponent,
    FondoPensionComponent,
    FondoCesantiasComponent,
    CajaCompensacionComponent,
    EstructuraEmpresaComponent,
    SedesComponent
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InformacionBaseModule { }
