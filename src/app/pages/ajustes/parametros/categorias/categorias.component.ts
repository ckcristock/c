import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { MatAccordion } from '@angular/material';
import { CategoriasService } from './categorias.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  @ViewChild('FormCategoria') FormCategoria: any;
  @ViewChild('modalCategoria') modalCategoria: any;
  @ViewChild('FormCategoriaEditar') FormCategoriaEditar: any;
  @ViewChild('modalCategoriaEditar') modalCategoriaEditar: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  filters = {
    categoria: '',
    departamento: '',
    municipio: '',
    direccion: '',
    telefono: ''
  }
  form: FormGroup;
  //Variables para filtros
  public categorias_filtro: any = '';
  public SubcategoriasSeleccionadas: any = [];
  public Subcategorias: any = [];

  public Departamentos: any = '';
  public company_id: any = '';
  public categoriaDepartamento: any;
  public Municipios: any = '';
  public IdCategoria: any = '';
  public Categoria: any = {};
  public categorias: any[];
  public TotalItems: number;
  public tempFilter = [];
  public rowsFilter = [];
  pagination: any = {
    pag: 1,
    maxSize: 10,
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
    private fb: FormBuilder,
    private _modal: ModalService,
    private _swal: SwalService
  ) {
    this.company_id = this._user.user.person.company_worked.id;

  }

  ngOnInit() {
    this.createForm();
    this.paginacion()
    this.getDepartamentos();
    this.getCategoriasDep();
    this.cargarSubcategorias();
  }

  openModal(content) {
    this._modal.open(content, 'lg')
  }

  createForm() {
    this.form = this.fb.group({

      Id_Categoria_Nueva: [''],
      Nombre: ['', Validators.required],
      Departamento: ['', Validators.required],
      Municipio: ['', Validators.required],
      Direccion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Subcategorias: ['', Validators.required],
      Aplica_Separacion_Subcategorias: ['', Validators.required],
    });
  }

  paginacion(page = 1) {
    this.pagination.pag = page;
    this.loading = true;
    let param = { ...this.pagination, ...this.filters }
    this._categorias.paginacionCategorias(param)
      .subscribe((data: any) => {
        this.categorias = data.Categorias;
        this.pagination.collectionSize = data.numReg;
        this.loading = false;
      });
  }

  getDepartamentos() {
    let params = { modulo: 'Departamento' }
    this._categorias.getDepartamentos(params)
      .subscribe((data: any) => {
        this.Departamentos = data;
      });
  }

  getCategoriasDep() {
    this._categorias.getCategoriasDep()
      .subscribe((data: any) => {
        this.categoriaDepartamento = data;
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
  }

  Municipios_Departamento(Departamento) {
    this.http
      .get(environment.ruta + 'php/genericos/municipios_departamento.php', {
        params: { id: Departamento },
      })
      .subscribe((data: any) => {
        this.Municipios = data;
      });
  }

  saveCategory() {
    let datos = {
      modulo: 'Categoria',
      datos: this.form.value,
      subcategorias: this.form.get('Subcategorias').value
    }
    this.http
      .post(
        environment.ruta + 'php/categoria_nueva/guardar_categoria_nueva.php',
        datos
      )
      .subscribe((data: any) => {
        this._swal.show({
          icon: 'success',
          title: 'Categoría creada con éxito',
          text: '',
          timer: 1000,
          showCancel: false
        })
        this.form.reset();
        this.paginacion();
        this._modal.close();
      });
    this.getCategoriasDep();
  }

  EditarCategoria(id) {
    this.http
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
        this.Municipios_Departamento(data.Departamento);
        this.modalCategoriaEditar.show();
      });
  }

  inOff(id) {
    let datos = new FormData();
    datos.append('modulo', 'Categoria');
    datos.append('id', id);
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: '¡La categoría se anulará!',
      icon: 'question',
      showCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .post(
            environment.ruta + 'php/categoria_nueva/eliminar_categoria_nueva.php',
            datos
          )
          .subscribe((data: any) => {
            this.paginacion();
            this._swal.show({
              icon: 'success',
              title: '¡Categoría anulada!',
              text: '',
              timer: 1000,
              showCancel: false
            })
          });
      }
    })

  }


  cargarSubcategorias() {
    this.http
      .get(environment.ruta + 'php/subcategoria/get_subcategorias.php')
      .subscribe((data: any) => {
        this.Subcategorias = data;
      });
  }
}
