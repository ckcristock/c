import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformesdianRoutingModule } from './informesdian-routing.module';
import { MediosmagneticosComponent } from './mediosmagneticos/mediosmagneticos.component';
import { MediomagneticocrearComponent } from './mediosmagneticos/mediomagneticocrear/mediomagneticocrear.component';
import { MediomagagrupadosespComponent } from './mediosmagneticos/mediomagagrupadosesp/mediomagagrupadosesp.component';
import { MediomagneticoagrupacioncrearComponent } from './mediosmagneticos/mediomagagrupadosesp/mediomagneticoagrupacioncrear/mediomagneticoagrupacioncrear.component';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ComponentsModule } from '../../../components/components.module';
import { Globales } from '../globales';
import { CertificadoretencionComponent } from './certificadoretencion/certificadoretencion.component';
import { NgbTypeaheadModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CertificadoingresoyretencionComponent } from './certificadoingresoyretencion/certificadoingresoyretencion.component';
import { ResumenretencionesComponent } from './resumenretenciones/resumenretenciones.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    MediosmagneticosComponent, 
    MediomagneticocrearComponent, 
    MediomagagrupadosespComponent, 
    MediomagneticoagrupacioncrearComponent, CertificadoretencionComponent, CertificadoingresoyretencionComponent, ResumenretencionesComponent
  ],
  imports: [
    CommonModule,
    InformesdianRoutingModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    ComponentsModule,
    NgbTypeaheadModule,
    NgSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbDropdownModule
  ],
  providers: [
    Globales
  ]
})
export class InformesdianModule { }
