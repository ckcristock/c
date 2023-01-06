import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { UserService } from 'src/app/core/services/user.service';
import { CategoriasService } from '../../parametros/categorias/categorias.service';
import { CatalogoService } from './catalogo.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public Categorias: any[] = [];
  public Subcategorias: any[] = [];
  public selectedCategory: any = {
    categoria: {
      id: null,
      nombre: null
    },
    subcategoria: {
      id: null,
      nombre: null
    }
  }
  public pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }

  matPanel = false;
  formFiltros: FormGroup;
  //ngbNavItem
  active = 1;
  loadingCategorias: boolean = false;
  loadingProductos: boolean = false;
  Productos: any[] = [];
  estados: any[] = [];

  constructor(
    private _categoria: CategoriasService,
    private _catalogo: CatalogoService,
    private _user: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getCategorias();
    this.createForms();
    this.getEstados();
  }

  createForms() {
    this.formFiltros = this.fb.group({
      Nombre_Comercial: [''],
      Tipo_Catalogo: [''],
      Estado: ['']
    });
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
    console.log(this.matPanel);
  }

  getCategorias() {
    this.loadingCategorias = true;
    this._categoria.getCategorias().subscribe((res: any) => {
      this.Categorias = res.data;
      this.loadingCategorias = false;
    });
  }

  getEstados(){
    this._catalogo.getEstados().subscribe((res: any) => {
      this.estados = res.data;
    });
  }

  selectCategoria(categoria,subcategoria){
    this.moveToTop();
    this.selectedCategory = {categoria,subcategoria};
  }

  moveToTop() {
    // window.scroll(0,0);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
 }
}
