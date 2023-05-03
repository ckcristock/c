import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubcategoryService } from './subcategory.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/core/services/modal.service';
import { MatAccordion } from '@angular/material/expansion';
import { CategoriasService } from '../categorias/categorias.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';

@Component({
  selector: 'app-subcategorias',
  templateUrl: './subcategorias.component.html',
  styleUrls: ['./subcategorias.component.scss'],
})
export class SubcategoriasComponent implements OnInit {

  @ViewChild('FormTipoServicio') FormTipoServicio: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  @Input()
  set reloadSubcategories(param: { evento: Event, filtro?: string | '' }) {
    if (param.evento) {
      this.restriccionDesdeCatalogo = true;
      this.filters.nombre = param.filtro;
      this.getSubcategories();
      this.listCategories();
    }
  }

  /*Variable para evitar que cuando se llame a este componente desde "CatalogoComponent",
    el usuario haga otras cosas aparte del motivo principal del llamado. */
  restriccionDesdeCatalogo: boolean = false;
  form: FormGroup;
  filters = {
    categoria: '',
    nombre: '',
  }

  permission: Permissions = {
    menu: 'Empresa',
    permissions: {
      approve_product_categories: true
    }
  };
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  matPanel = false;

  public servicios: any[];
  public categorias_filtro: any = [];
  public PuntosSeleccionados = [];
  public Cuenta = [];
  public Modelo_Cuenta: any;
  public Bodegas: any[] = [];
  public Cargando: boolean;
  public page = 1;
  public TotalItems: number;
  public Sucategories: any[] = [];
  public Subcategory: any = {};
  public p: any = {};
  public title: string = 'Nueva Subcategoria';
  public Lista_Tipo_Soporte = [];
  public company_id: any = '';
  public Retencion: any = {
    Nombre: '',
    Id_Bodega: '',
    Separable: 'No',
  };
  public EditFlag: boolean = false;

  constructor(
    private _subcategory: SubcategoryService,
    private _category: CategoriasService,
    private http: HttpClient,
    private _user: UserService,
    private location: Location,
    private route: ActivatedRoute,
    private _swalService: SwalService,
    private fb: FormBuilder,
    private _modalSubcat: ModalService,
    private _permission: PermissionService
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
    this.company_id = this._user.user.person.company_worked.id;
  }

  /* search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4 ? [] : this.Cuenta.filter((v) => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
    );
  formatter1 = (x: { Codigo: string }) => x.Codigo; */

  ngOnInit() {
    this.createForm();
    this.getSubcategories();
    this.listCategories();
    /*  this.http.get(environment.base_url + '/php/lista_generales.php', {
       params: { modulo: 'Bodega_Nuevo' },
     })
       .subscribe((data: any) => {
         this.Bodegas = data;
       }); */
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

  openModal(content, accion, data?) {
    this.title = accion + ' subcategoria';
    this.fieldDinamic.clear();
    if (accion == "Agregar") {
      this.createForm();
    } else {
      this.EditSubcategory(data);
    }
    this._modalSubcat.open(content, 'lg');
  }

  createForm() {
    this.form = this.fb.group({
      Id_Subcategoria: [''],
      Nombre: ['', Validators.required],
      Id_Categoria_Nueva: [null, Validators.required],
      Fijo: [0],
      dynamic: this.fb.array([]),
    });

    this.form.get("Nombre")[(this.restriccionDesdeCatalogo) ? "disable" : "enable"]();
    this.form.get("Id_Categoria_Nueva")[(this.restriccionDesdeCatalogo) ? "disable" : "enable"]();
    this.form.get("Fijo")[(this.restriccionDesdeCatalogo) ? "disable" : "enable"]();
  }

  dinamicFields() {
    let field = this.fb.group({
      id: [''],
      label: ['', Validators.required],
      type: ['', Validators.required],
      required: ['', Validators.required],
      reception: [0]
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
    this._swalService.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: 'Vamos a eliminar este campo, esta acción no se puede revertir'
    }).then((result) => {
      if (result.isConfirmed) {
        if (item.controls.id.value) {
          this._subcategory.deleteVariable(item.controls.id.value).subscribe((data: any) => { });
        }
        this.fieldDinamic.removeAt(i);
      }
    })

  }

  listCategories() {
    this._category.listarCategorias().subscribe((res: any) => {
      this.categorias_filtro = res.data;
    });
  }

  getSubcategories(page = 1) {
    this.pagination.page = page;
    this.Cargando = true;
    /* this.http
      .get(environment.ruta + 'php/parametros/lista_subcategoria.php', { params: { company_id: this._user.user.person.company_worked.id } }) */
    let param = { ...this.pagination, ...this.filters, company_id: this._user.user.person.company_worked.id };
    this._subcategory.getSubCategorias(param)
      .subscribe((res: any) => {
        this.Cargando = false;
        this.Sucategories = res.data.data;
        this.pagination.collectionSize = res.data.total;
        /* this.Sucategories = data; */
      });
  }

  EditSubcategory(data) {
    this.Subcategory = { ...data };
    this.title = 'Editar subcategoria';
    /* this.Subcategory.categories=this.Subcategory.categories.map(v => v=v.Id_Categoria_Nueva) */
    this.form.patchValue({
      Id_Subcategoria: this.Subcategory.Id_Subcategoria,
      Nombre: this.Subcategory.Nombre,
      Id_Categoria_Nueva: this.Subcategory.Id_Categoria_Nueva,
      Fijo: this.Subcategory.Fijo,
      /* Categorias: this.Subcategory.categories */
    });
    this.Subcategory.subcategory_variables.forEach((element) => {
      let group = this.fb.group({
        id: element.id,
        label: element.label,
        type: element.type,
        required: element.required,
        reception: element.reception
      });
      this.fieldDinamic.push(group);
    });
  }

  SaveSubcategory() {
    if (this.form.valid) {
      let bool = this.form.value.Id_Subcategoria ? true : false
      this._swalService.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a ' + (bool ? 'editar' : 'crear') + ' la categoría.'
      }).then(r => {
        if (r.isConfirmed) {
          this._subcategory.save(this.form.value).subscribe((r: any) => {
            this.dataClear();
            this._swalService.show({
              icon: 'success',
              title: 'Subcategoria ' + (bool ? 'editada' : 'creada') + ' con éxito',
              text: '',
              showCancel: false,
              timer: 1000
            });
          });
        }
      })
      //}
    } else {
      this._swalService.show({
        icon: 'error',
        title: 'Validación no superada',
        text: 'Por favor verifique de nuevo la información.',
        showCancel: false
      });
    }
  }

  dataClear() {
    this.form.reset();
    this.fieldDinamic.clear();
    this.getSubcategories(this.pagination.page);
    this._modalSubcat.close();
  }

  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc',
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
        else ret.push(c);
      }
      return ret.join('');
    };
  })();

  /*  EliminarRetencion(id) {
     let info = id;
     let datos = new FormData();
     datos.append('id', info);
     datos.append('modulo', 'Subcategoria');
     this.http
       .post(environment.ruta + 'php/parametros/eliminar_caja.php', datos)
       .subscribe((data: any) => {
         this.confirmacionSwal.title = 'Operacion Exitosa';
         this.confirmacionSwal.text = data.mensaje;
         this.confirmacionSwal.type = data.tipo;
         this.confirmacionSwal.show();
         this.getSubcategories();
       });
   } */

  public GetDetallesCategoria(id_subcategoria: string) {
    /* this.http
      .get(environment.ruta + 'php/parametros/get_detalles_subcategoria.php', {
        params: { id_subcategoria: id_subcategoria },
      })
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.Retencion = data.query_result; */
    this._subcategory.getSubCategorias({ idSubcategoria: id_subcategoria })
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.Retencion = res.data.data;
          this.EditFlag = true;
          this.modal.show();
        } else {
          this.EditFlag = false;
          this.Retencion = {
            Nombre: '',
            Id_Bodega: '',
            Separable: 'No',
          };
          /* this._swalService.ShowMessage(data); */
          this._swalService.ShowMessage(res.data.data);
        }
      });
  }

  activateSubcategory(id, state) {
    this._swalService.show({
      title: '¿Estás seguro(a)?',
      text: '¡Esta subcategoría se ' + ((state == 0) ? 'anulará!' : 'reactivará!'),
      icon: 'question',
      showCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._subcategory.changeActive(id, { activo: state })
          .subscribe((res: any) => {
            this.getSubcategories();
            this._swalService.show({
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


}
