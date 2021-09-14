import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NominaRoutingModule } from "./nomina-routing.module";
import { PrestamosLibranzasComponent } from './prestamos-libranzas/prestamos-libranzas.component';
import {ModalprestamoylibranzacrearComponent} from "./prestamos-libranzas/modalprestamoylibranzacrear/modalprestamoylibranzacrear.component";
import { ComponentsModule } from '../../components/components.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
    imports:[
        NominaRoutingModule,
        ComponentsModule,
        CommonModule,
        FormsModule,
        NgbTypeaheadModule
    ],
    declarations: [PrestamosLibranzasComponent,ModalprestamoylibranzacrearComponent ]    
})

export class NominaModule {}

