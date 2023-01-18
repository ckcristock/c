import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatosBasicosEmpresaComponent } from '../configuracion/configuracion-empresa/datos-basicos-empresa/datos-basicos-empresa.component';
import { DatosPagoComponent } from '../configuracion/configuracion-empresa/datos-pago/datos-pago.component';
import { DatosNominaComponent } from '../configuracion/configuracion-empresa/datos-nomina/datos-nomina.component';
import { ConfiguracionEmpresaComponent } from './configuracion-empresa/configuracion-empresa.component';
import { DatosPilaComponent } from '../configuracion/configuracion-empresa/datos-pila/datos-pila.component';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CamposTercerosComponent } from './campos-terceros/campos-terceros.component';
import { MunicipiosComponent } from './departamentos-municipios/municipios/municipios.component';
import { DepartamentosComponent } from './departamentos-municipios/departamentos/departamentos.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule, NgbModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { PaisesComponent } from './paises-ciudades/paises/paises.component';
import { CiudadesComponent } from './paises-ciudades/ciudades/ciudades.component';
import { PaisesCiudadesComponent } from './paises-ciudades/paises-ciudades.component';
import { DepartamentosMunicipiosComponent } from './departamentos-municipios/departamentos-municipios.component';
import { BaseCalculosComponent } from './base-calculos/base-calculos.component';
import { MatExpansionModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule } from '@angular/material';
import { NominaComponent } from './nomina/nomina.component';
import { HorasExtrasConfigComponent } from './nomina/components/horas-extras-config/horas-extras-config.component';
import { SSocialFuncionarioConfigComponent } from './nomina/components/s-social-funcionario-config/s-social-funcionario-config.component';
import { SSocialEmpresaConfigComponent } from './nomina/components/s-social-empresa-config/s-social-empresa-config.component';
import { IncapacidadesConfigComponent } from './nomina/components/incapacidades-config/incapacidades-config.component';
import { ParafiscalesConfigComponent } from './nomina/components/parafiscales-config/parafiscales-config.component';
import { RiesgoArlConfigComponent } from './nomina/components/riesgo-arl-config/riesgo-arl-config.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { InformacionBaseModule } from '../informacion-base/informacion-base.module';
import { ParametrosModule } from '../parametros/parametros.module';
import { ResponsablesNominaConfigComponent } from './nomina/components/responsables-nomina-config/responsables-nomina-config.component';
import { NovedadesConfigComponent } from './nomina/components/novedades-config/novedades-config.component';
import { RowTypeaheadComponent } from './nomina/components/row-typeahead/row-typeahead.component';
import { EgresosConfigComponent } from './nomina/components/egresos-config/egresos-config.component';
import { IngresosConfigComponent } from './nomina/components/ingresos-config/ingresos-config.component';
import { MatCheckboxModule, MatSlideToggleModule } from '@angular/material';
import { LiquidacionConfigComponent } from './nomina/components/liquidacion-config/liquidacion-config.component';
import { SalariosConfigComponent } from './nomina/components/salarios-config/salarios-config.component';
import { TypeaheadPersonComponent } from './nomina/components/responsables-nomina-config/typeahead-person/typeahead-person.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CatSubcatModule } from '../parametros/cat-subcat/cat-subcat.module';


@NgModule({
  declarations: [
    ConfiguracionEmpresaComponent,
    DatosNominaComponent,
    DatosPagoComponent,
    DatosPilaComponent,
    DatosBasicosEmpresaComponent,
    CamposTercerosComponent,
    MunicipiosComponent,
    DepartamentosComponent,
    PaisesComponent,
    CiudadesComponent,
    PaisesCiudadesComponent,
    DepartamentosMunicipiosComponent,
    BaseCalculosComponent,
    NominaComponent,
    HorasExtrasConfigComponent,
    SSocialFuncionarioConfigComponent,
    SSocialEmpresaConfigComponent,
    RiesgoArlConfigComponent,
    ParafiscalesConfigComponent,
    IncapacidadesConfigComponent,
    LocalidadesComponent,
    ResponsablesNominaConfigComponent,
    NovedadesConfigComponent,
    RowTypeaheadComponent,
    EgresosConfigComponent,
    IngresosConfigComponent,
    LiquidacionConfigComponent,
    SalariosConfigComponent,
    TypeaheadPersonComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    ConfiguracionRoutingModule,
    InformacionBaseModule,
    ParametrosModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    CKEditorModule,
    CatSubcatModule,
  ],
  exports: [
    CamposTercerosComponent
  ]
})
export class ConfiguracionModule { }
