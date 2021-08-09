import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './shared/shared.module';

import { LayoutComponent } from './layout/layout.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [  LayoutComponent, ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ComponentsModule
  ],
  exports: [ ]
})
export class LayoutsModule { }
