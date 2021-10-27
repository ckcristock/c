import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
    declarations:[DashboardComponent],
    imports:[ 
        CommonModule,
        FormsModule,
        PagesRoutingModule,
        ComponentsModule,
        
    ],
    exports:[]
})

export class PagesModule { }
