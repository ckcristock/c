import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsComponent } from './boards.component';
import { BoardRrhhComponent } from './board-rrhh/board-rrhh.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'angular2-chartjs';


@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    NgModule,
    RouterModule,
    ChartModule,
  ],
  declarations: []
})
export class BoardsModule { }
