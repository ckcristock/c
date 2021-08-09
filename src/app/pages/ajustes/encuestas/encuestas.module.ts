import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncuestasRoutingModule } from './encuestas-routing.module';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    EncuestasRoutingModule,
    FormsModule
  ]
})
export class EncuestasModule { }
