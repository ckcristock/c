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
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PaisesComponent } from './paises-ciudades/paises/paises.component';
import { CiudadesComponent } from './paises-ciudades/ciudades/ciudades.component';
import { PaisesCiudadesComponent } from './paises-ciudades/paises-ciudades.component';
import { DepartamentosMunicipiosComponent } from './departamentos-municipios/departamentos-municipios.component';
import { BaseCalculosComponent } from './base-calculos/base-calculos.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NominaComponent } from './nomina/nomina.component';
import { HorasExtrasConfigComponent } from './nomina/components/horas-extras-config/horas-extras-config.component';
import { SSocialFuncionarioConfigComponent } from './nomina/components/s-social-funcionario-config/s-social-funcionario-config.component';
import { SSocialEmpresaConfigComponent } from './nomina/components/s-social-empresa-config/s-social-empresa-config.component';
import { IncapacidadesConfigComponent } from './nomina/components/incapacidades-config/incapacidades-config.component';
import { ParafiscalesConfigComponent } from './nomina/components/parafiscales-config/parafiscales-config.component';
import { RiesgoArlConfigComponent } from './nomina/components/riesgo-arl-config/riesgo-arl-config.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LocalidadesComponent } from './localidades/localidades.component';


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
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    ConfiguracionRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbPaginationModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class ConfiguracionModule { }
