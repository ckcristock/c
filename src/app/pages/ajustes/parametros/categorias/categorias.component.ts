import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { MatAccordion } from '@angular/material';
import { CategoriasService } from './categorias.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { SubcategoryService } from '../subcategorias/subcategory.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  @Output() reloadSubcategories = new EventEmitter<Event>();

  title: string = "";
  @ViewChild('FormCategoria') FormCategoria: any;
  @ViewChild('modalCategoria') modalCategoria: any;
  @ViewChild('FormCategoriaEditar') FormCategoriaEditar: any;
  @ViewChild('modalCategoriaEditar') modalCategoriaEditar: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  filters = {
    nombre: '',
    compraInternacional: '',
    separacionCategorias: ''
  }
  form: FormGroup;
  //Variables para filtros
  public SubcategoriasSeleccionadas: any = [];
  public Subcategorias: any = [];

  public company_id: any = '';
  public IdCategoria: any = '';
  public Categoria: any = {};
  public categorias: any[];
  public TotalItems: number;
  public tempFilter = [];
  public rowsFilter = [];
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  public page = 1;
  public maxSize = 10;
  matPanel = false;
  loading: boolean;
  constructor(
    private http: HttpClient,
    private location: Location,
    private _user: UserService,
    private _categorias: CategoriasService,
    private _subcategoria: SubcategoryService,
    private fb: FormBuilder,
    private _modal: ModalService,
    private _swal: SwalService
  ) {
    this.company_id = this._user.user.person.company_worked.id;

  }

  ngOnInit() {
    this.createForm();
    this.paginacion();
    /* this.getCategoriasDep(); */
    this.cargarSubcategorias();
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }

  openModal(content,action) {
    this.title = action;
    if(action=="Agregar"){this.createForm();}
    this._modal.open(content, 'lg');
  }

  createForm() {
    this.form = this.fb.group({
      Id_Categoria_Nueva: [''],
      Nombre: ['', Validators.required],
      compraInternacional: ['', Validators.required],
      separacionCategorias: ['', Validators.required],
      /* Subcategorias: [[], Validators.required] */
    });
  }

  paginacion(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    let param = { ...this.pagination, ...this.filters }
    this._categorias.paginacionCategorias(param)
      .subscribe((res: any) => {
        /* this.categorias = data.Categorias; */
        this.categorias = res.data.data;
        this.pagination.collectionSize = res.data.total;
       /*  this.pagination.collectionSize = data.numReg; */
        this.loading = false;
      });
  }

  saveCategory() {
    /* let datos = {
      modulo: 'Categoria',
      datos: this.form.value,
      subcategorias: this.form.get('Subcategorias').value
    }
    this.http
      .post(
        environment.ruta + 'php/categoria_nueva/guardar_categoria_nueva.php',
        datos
      ) */

    this._categorias.saveCategoria(this.form.value)
      .subscribe((res: any) => {
        this._swal.show({
          icon: 'success',
          title: 'Categoría creada con éxito',
          text: res.data,
          timer: 1000,
          showCancel: false
        })
        this.form.reset();
        this.paginacion();
        this._modal.close();
      });
    this.paginacion();
  }

  EditarCategoria(categoria /* id */) {
    this.Categoria = { ...categoria };
    /* this.Categoria.subcategories=this.Categoria.subcategories.map(v => v=v.Id_Subcategoria); */
    this.form.patchValue({
      Id_Categoria_Nueva: this.Categoria.Id_Categoria_Nueva,
      Nombre:  this.Categoria.Nombre,
      compraInternacional: this.Categoria.Compra_Internacional,
      separacionCategorias: this.Categoria.Aplica_Separacion_Categorias,
      /* Subcategorias: this.Categoria.subcategories */
    });
    /* this.http
      .get(
        environment.ruta + 'php/categoria_nueva/detalle_categoria_nueva.php',
        {
          params: { id: id },
        }
      )
      .subscribe((data: any) => {
        this.IdCategoria = id;
        this.Categoria = data.Categoria_Nueva;
        this.SubcategoriasSeleccionadas = data.Subcategorias;
        this.modalCategoriaEditar.show();
      }); */
  }

  inOff(id,state) {
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: '¡Esta categoría y las subcategorías asociadas a ella se '+((state==0)?'anularán!':'reactivarán!'),
      icon: 'question',
      showCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        /* this.http
          .post(
            environment.ruta + 'php/categoria_nueva/eliminar_categoria_nueva.php',
            datos
          ) */
        this._categorias.changeActive(id,{activo: state})
          .subscribe((res: any) => {
            this.paginacion();
            this.reloadSubcategories.emit();
            this._swal.show({
              icon: 'success',
              title: '¡Operación exitosa!',
              text: res.data,
              timer: 1000,
              showCancel: false
            })
          });
      }
    })

  }


  cargarSubcategorias() {
    /* this.http
      .get(environment.ruta + 'php/subcategoria/get_subcategorias.php') */
    this._subcategoria.listarSubCategorias()
      .subscribe((res: any) => {
        this.Subcategorias = res.data;
      });
  }
}
