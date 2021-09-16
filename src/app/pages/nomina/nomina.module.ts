import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViaticosComponent } from './viaticos/viaticos.component';
import { ContabilidadRoutingModule } from './nomina-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [ViaticosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContabilidadRoutingModule,
    NgbTooltipModule
  ]
})
export class NominaModule { }
