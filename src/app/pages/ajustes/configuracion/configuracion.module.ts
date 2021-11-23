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
    BaseCalculosComponent
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
  ]
})
export class ConfiguracionModule { }
