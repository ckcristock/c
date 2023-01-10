import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserService } from 'src/app/core/services/user.service';
import { CategoriasService } from '../../parametros/categorias/categorias.service';
import { CatalogoService } from './catalogo.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {
  @ViewChild('matPanel') matPanel: MatExpansionPanel;

  public Categorias: any[] = [];
  public Subcategorias: any[] = [];
  public Productos: any[] = [];
  public tipos_catalogo: any[] = [];
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

  constructor(
    private _categoria: CategoriasService,
    private _user: UserService,
    private _catalogo: CatalogoService,
    private _modal: ModalService,
    private fb: FormBuilder
  ) { }

  //ngbNavItem
  formFiltros: FormGroup;
  filtroDefault: any = {};
  active = 1;
  loadingCategorias: boolean = false;
  loadingProductos: boolean = false;

  ngOnInit(): void {
    this.getCategorias();
    this.createForm();
    this._catalogo.getTiposCatalogo().subscribe((res: any) => {
      this.tipos_catalogo = res.data;
    })
  }

  ngAfterViewInit(): void {
    Object.keys(this.formFiltros.controls).forEach(inputName => {
      let control=document.querySelector(`#formFiltros [formControlName=${inputName}]`);
      if(control!==null){
        fromEvent(control, 'input')
          .pipe(map((event: Event) => (event.target as HTMLInputElement).value))
          .pipe(debounceTime(1000))
          .pipe(distinctUntilChanged())
          .subscribe(data => this.getProducts());
      }
    });
  }
 /*  ngAfterViewInit(): void {
    fromEvent(this.filtroNombre.nativeElement, 'input')
      .pipe(map((event: Event) => (event.target as HTMLInputElement).value))
      .pipe(debounceTime(3000))
      .pipe(distinctUntilChanged())
      .subscribe(data => console.log({data}));
  } */

  openConfirm(confirm, titulo) {
    this._modal.open(confirm, 'md');
  }

  createForm() {
    this.formFiltros = this.fb.group({
      categoria: [''],
      subcategoria: [''],
      nombre: [''],
      tipo_catalogo: ['']
    });
    this.filtroDefault = this.formFiltros.value;
  }

  getCategorias() {
    this.loadingCategorias = true;
    this._categoria.getCategorias().subscribe((res: any) => {
      this.Categorias = res.data;
      this.loadingCategorias = false;
    });
  }

  getProducts(page = 1) {
    this.formFiltros.patchValue({
      categoria: this.selectedCategory.categoria.id,
      subcategoria: this.selectedCategory.subcategoria.id
    })
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.formFiltros.value
    }
    this.loadingProductos = true;
    this._catalogo.getData(params).subscribe((res: any) => {
      this.Productos = res.data.data;
      this.loadingProductos = false;
      this.pagination.collectionSize = res.data.total;
    })
  }

  moveToTop() {
    // window.scroll(0,0);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
     });
 }

 getProductosBySubcategoria(categoria){
  this.moveToTop();
  this.formFiltros.reset(this.filtroDefault);
  this.matPanel.close();
  this.selectedCategory = categoria;
  this.getProducts();
 }
}
