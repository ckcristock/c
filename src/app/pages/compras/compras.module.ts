import { NgModule } from '@angular/core';
import { ComprasRoutingModule } from './compras-routing.module';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CompraNacionalComponent } from './compra-nacional/compra-nacional.component';
import { ComponentsModule } from '../../components/components.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrearCompraNacionalComponent } from './compra-nacional/crear-compra-nacional/crear-compra-nacional.component';
import {
  NgbTypeaheadModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from '../../core/pipes/pipes.module';
import { VerCompraNacionalComponent } from './compra-nacional/ver-compra-nacional/ver-compra-nacional.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CompraNacionalComponent,
    CrearCompraNacionalComponent,
    VerCompraNacionalComponent,
  ],
  imports: [
    NgSelectModule,
    HttpClientModule,
    PipesModule,
    CommonModule,
    FormsModule,
    ComprasRoutingModule,
    ComponentsModule,
    MyDateRangePickerModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    SweetAlert2Module.forRoot(),
  ],
})
export class ComprasModule {}
