import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemisionesComponent } from './remisiones.component';
import { RemisionRoutes } from './remision.routing';
import { NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemisioncrearnuevoComponent } from './remisioncrearnuevo/remisioncrearnuevo.component';
import { ProductosremisionnuevoComponent } from './remisioncrearnuevo/productosremisionnuevo/productosremisionnuevo.component';
import { ModalproductoremisionnuevoComponent } from './modalproductoremisionnuevo/modalproductoremisionnuevo.component';
import { ModalcambiarproductossimilarnuevoComponent } from './modalcambiarproductossimilarnuevo/modalcambiarproductossimilarnuevo.component';
//import { TruncateModule } from 'ng2-truncate';
import { RemisioneditarComponent } from './remisioneditar/remisioneditar.component';
import { RemisionComponent } from './remision/remision.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    RemisionRoutes,
    HttpClientModule,
    FormsModule,
    ComponentsModule,
    MyDateRangePickerModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbDropdownModule,
    NgSelectModule,
    PipesModule,
    SweetAlert2Module.forRoot(),
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    //TruncateModule
  ],
  declarations: [
    RemisionesComponent,
    RemisionComponent,
    RemisioneditarComponent,
    RemisioncrearnuevoComponent,
    ProductosremisionnuevoComponent,
    ModalproductoremisionnuevoComponent,
    ModalcambiarproductossimilarnuevoComponent
  ]
})
export class RemisionModule { }
