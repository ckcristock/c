import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
  @Output() requestReload = new EventEmitter<Event>();

  title: string = "";
  @ViewChild('FormCategoria') FormCategoria: any;
  @ViewChild('modalCategoria') modalCategoria: any;
  @ViewChild('FormCategoriaEditar') FormCategoriaEditar: any;
  @ViewChild('modalCategoriaEditar') modalCategoriaEditar: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;

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
  public page = 1;
  public maxSize = 10;

  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filters = {
    nombre: '',
    compraInternacional: '',
    separacionCategorias: ''
  }
  form: FormGroup;
  visible: boolean = true;
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
    this.getCategories();
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

  openModal(content, action, data?) {
    this.visible = true
    this.title = action + " categoría" + (data ? ': ' + data.Nombre : '');
    this.fieldDinamic.clear();
    if (action == "Agregar") {
      this.createForm();
    } else {
      this.EditarCategoria(data);
      this.visible=(data.Fijo==0);
    }
    this._modal.open(content, 'lg');
  }

  createForm() {
    this.form = this.fb.group({
      Id_Categoria_Nueva: [''],
      Nombre: ['', Validators.required],
      compraInternacional: ['', Validators.required],
      separacionCategorias: ['', Validators.required],
      /* Subcategorias: [[], Validators.required] */
      fijo: [0],
      dynamic: this.fb.array([]),
    });
  }

  dinamicFields() {
    let field = this.fb.group({
      id: [''],
      label: [''],
      type: [''],
      required: [''],
    });
    return field;
  }

  newField() {
    let field = this.fieldDinamic;
    field.push(this.dinamicFields());
  }

  get fieldDinamic() {
    return this.form.get('dynamic') as FormArray;
  }

  deleteField(i, item) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: 'Vamos a eliminar este campo, esta acción no se puede revertir'
    }).then((result) => {
      if (result.isConfirmed) {
        if (item.controls.id.value) {
          this._categorias.deleteVariable(item.controls.id.value).subscribe((data: any) => { });
        }
        this.fieldDinamic.removeAt(i);
      }
    })

  }

  getCategories(page = 1) {
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
        this.fieldDinamic.clear();
        this.getCategories(this.pagination.page);
        this._modal.close();
      });
    this.getCategories();
  }

  EditarCategoria(categoria /* id */) {
    this.Categoria = { ...categoria };
    /* this.Categoria.subcategories=this.Categoria.subcategories.map(v => v=v.Id_Subcategoria); */
    this.form.patchValue({
      Id_Categoria_Nueva: this.Categoria.Id_Categoria_Nueva,
      Nombre: this.Categoria.Nombre,
      compraInternacional: this.Categoria.Compra_Internacional,
      separacionCategorias: this.Categoria.Aplica_Separacion_Categorias,
      fijo: this.Categoria.Fijo
      /* Subcategorias: this.Categoria.subcategories */
    });

    this.Categoria.category_variables.forEach((element) => {
      let group = this.fb.group({
        id: element.id,
        label: element.label,
        type: element.type,
        required: element.required,
      });
      this.fieldDinamic.push(group);
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

  inOff(id, state, event: Event) {
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: '¡Esta categoría y las subcategorías asociadas a ella se ' + ((state == 0) ? 'anularán!' : 'reactivarán!'),
      icon: 'question',
      showCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        /* this.http
          .post(
            environment.ruta + 'php/categoria_nueva/eliminar_categoria_nueva.php',
            datos
          ) */
        this._categorias.changeActive(id, { activo: state })
          .subscribe((res: any) => {
            this.requestReload.emit(event);
            this.getCategories();
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
