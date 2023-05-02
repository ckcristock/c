import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoriasComponent } from './subcategorias/subcategorias.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSelectModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [
    SubcategoriasComponent,
    CategoriasComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbDropdownModule,
    NgbPaginationModule,
    FormsModule,
    NgSelectModule,
    PerfectScrollbarModule,
    PipesModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    NgbTooltipModule,
    MatPaginatorModule,
    SweetAlert2Module.forRoot(),
    ComponentsModule,
  ],
  exports: [
    SubcategoriasComponent,
    CategoriasComponent
  ]
})
export class CatSubcatModule { }
