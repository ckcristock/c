import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserService } from 'src/app/core/services/user.service';
import { UnidadesMedidasService } from '../../parametros/apu/unidades-medidas/unidades-medidas.service';
import { CategoriasService } from '../../parametros/categorias/categorias.service';
import { SwalService } from '../services/swal.service';
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
  public campos: any[] = [];
  public unidades_medida: any[] = [];
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
    private _swal: SwalService,
    private _catalogo: CatalogoService,
    private _modal: ModalService,
    private _unit: UnidadesMedidasService,
    private fb: FormBuilder
  ) { }

  //ngbNavItem
  formFiltros: FormGroup;
  formProductos: FormGroup;
  filtroDefault: any = {};
  active = 1;
  loadingCategorias: boolean = false;
  loadingProductos: boolean = false;

  ngOnInit(): void {
    this.getCategorias();
    this.createForms();

    this._catalogo.getTiposCatalogo().subscribe((res: any) => {
      this.tipos_catalogo = res.data;
    })
    this._unit.selectUnits().subscribe((res: any) => {
      this.unidades_medida = res.data;
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

  moveToTop() {
    // window.scroll(0,0);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
     });
  }

  createForms() {
    this.formFiltros = this.fb.group({
      categoria: [''],
      subcategoria: [''],
      nombre: [''],
      tipo_catalogo: ['']
    });
    this.filtroDefault = this.formFiltros.value;

    this.formProductos = this.fb.group({
      Id_Producto: [''],
      Id_Categoria: ['', Validators.required],
      Id_Subcategoria: ['', Validators.required],
      Nombre_Comercial: ['', Validators.required],
      Presentacion: ['', Validators.required],
      Unidad_Medida: ['', Validators.required],
      Codigo_Barras: ['', Validators.required],
      Embalaje: ['', Validators.required],
      Tipo_Catalogo: ['', Validators.required],
      dynamic: this.fb.array([])
    });
  }

  dinamicFields() {
    const formVacio = this.campos.map((campo) => [ campo.label, (campo.required == "Si")?[campo.valor]:[campo.valor,Validators.required]]);
    let field = this.fb.group(formVacio);
    return field;
  }

  newField() {
    let field = this.fieldDinamic;
    field.push(this.dinamicFields());
  }

  get fieldDinamic() {
    return this.formProductos.get('dynamic') as FormArray;
  }

  /* deleteField(i: number) {
    this.fieldDinamic.removeAt(i);
  } */

  openConfirm(confirm: any, titulo: string, data?: any ) {
    this.formProductos.reset();
    let params={};
    if(titulo == "Agregar"){
      this.formProductos.patchValue({
        Id_Categoria: this.selectedCategory.categoria.id,
        Id_Subcategoria: this.selectedCategory.subcategoria.id
      });
      params={ id:this.selectedCategory.subcategoria.id};
    }else{
      this.formProductos.patchValue({
        Id_Producto: data.Id_Producto,
        Id_Categoria: data.Id_Categoria,
        Id_Subcategoria: data.Id_Subcategoria,
        Nombre_Comercial: data.Nombre_Comercial,
        Presentacion: data.Presentacion,
        Unidad_Medida: data.Unidad_Medida,
        Codigo_Barras: data.Codigo_Barras,
        Embalaje: data.Embalaje,
        Tipo_Catalogo: data.Tipo_Catalogo
      });
      params={ id:data.Id_Producto, valor: 1 };
    }
    this._catalogo.getCampos(params).subscribe((res: any) => {
      this.campos = res.data;
      this.newField();
      this._modal.open(confirm, 'lg');
    })
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

  getProductosBySubcategoria(categoria){
    this.moveToTop();
    this.formFiltros.reset(this.filtroDefault);
    this.matPanel.close();
    this.selectedCategory = categoria;
    this.getProducts();
  }

  setProductos(){
    if(this.formProductos.valid){
      this._swal.show({
        icon: 'success',
        title: "Nice!",
        text: 'Se ha agregado la bodega con éxito.',
        timer: 1000,
        showCancel: false
      });
    }
  }
}
