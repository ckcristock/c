import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadosRoutingModule } from './estados-routing.module';
import { ComponentsModule } from '../../../components/components.module';
import { EstadosResultadosComponent } from './estados-resultados/estados-resultados.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [EstadosResultadosComponent],
  imports: [
    CommonModule,
    EstadosRoutingModule,
    ComponentsModule,
    NgSelectModule,
    FormsModule
  ]
})
export class EstadosModule { }
