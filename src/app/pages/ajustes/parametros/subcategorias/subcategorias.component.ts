import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { SwalService } from '../../informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubcategoryService } from './subcategory.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/core/services/modal.service';
import { MatAccordion } from '@angular/material/expansion';
import { CategoriasService } from '../categorias/categorias.service';

@Component({
  selector: 'app-subcategorias',
  templateUrl: './subcategorias.component.html',
  styleUrls: ['./subcategorias.component.scss'],
})
export class SubcategoriasComponent implements OnInit {
  form: FormGroup;

  public servicios: any[];
  @ViewChild('FormTipoServicio') FormTipoServicio: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  @Input()
  set reloadSubcategories(event: Event) {
    if (event) {
      this.getSubcategory();
      this.listCategories();
    }
  }

  filters = {
    categoria: '',
    nombre: '',
    separable: ''
  }
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  matPanel = false;
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
    private _modal: ModalService
  ) {
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
    this.getSubcategory();
    this.listCategories();
   /*  this.http.get(environment.ruta + 'php/lista_generales.php', {
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

  openModal(content,accion) {
    if(accion=="Agregar"){
      this.createForm();
      this.title = 'Agregar subcategoria';
    }
    this._modal.open(content, 'lg');
    this.fieldDinamic.clear();
  }

  createForm() {
    this.form = this.fb.group({
      Id_Subcategoria: [''],
      Nombre: ['', Validators.required],
      Separable: ['', Validators.required],
      Id_Categoria_Nueva: ['',Validators.required],
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
    this._swalService.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: 'Vamos a eliminar este campo, esta acción no se puede revertir'
    }).then((result) => {
      if (result.isConfirmed) {
        if(item.controls.id.value){
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

  getSubcategory(page=1) {
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
      Separable: this.Subcategory.Separable,
      Id_Categoria_Nueva: this.Subcategory.Id_Categoria_Nueva
      /* Categorias: this.Subcategory.categories */
    });
    //console.log(this.Subcategory);
    this.Subcategory.subcategory_variables.forEach((element) => {
      let group = this.fb.group({
        id: element.id,
        label: element.label,
        type: element.type,
        required: element.required,
      });
      this.fieldDinamic.push(group);
    });
  }

  SaveSubcategory() {
    if(this.form.valid){
      /* if (this.form.get('Id_Subcategoria').value) {
        this._subcategory
          .update(this.form.value, this.Subcategory.Id_Subcategoria)
          .subscribe((r: any) => {
            this.dataClear();
            this._swalService.show({
              icon: 'success',
              title: 'Subcategoria actualizada con éxito',
              text: '',
              showCancel: false,
              timer: 1000
            });
          });
      } else { */
      this._subcategory.save(this.form.value).subscribe((r: any) => {
        this.dataClear();
        this._swalService.show({
          icon: 'success',
          title: 'Subcategoria guardada con éxito',
          text: '',
          showCancel: false,
          timer: 1000
        });
      });
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
    this.getSubcategory();
    this._modal.close();
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
        this.getSubcategory();
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
    this._subcategory.getSubCategorias( { idSubcategoria: id_subcategoria })
      .subscribe((res: any) => {
        if(res.code == 200){
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

  activateSubcategory(id,state) {
    this._swalService.show({
      title: '¿Estás seguro(a)?',
      text: '¡Esta subcategoría se '+((state==0)?'anulará!':'reactivará!'),
      icon: 'question',
      showCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._subcategory.changeActive(id,{activo: state})
          .subscribe((res: any) => {
            this.getSubcategory();
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
