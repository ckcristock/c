import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { noUndefined } from '@angular/compiler/src/util';
import { Component, ElementRef, EventEmitter, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { ModalService } from 'src/app/core/services/modal.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { UserService } from 'src/app/core/services/user.service';
import { UnidadesMedidasService } from '../../parametros/apu/unidades-medidas/unidades-medidas.service';
import { CategoriasService } from '../../parametros/cat-subcat/categorias/categorias.service';
import { SwalService } from '../services/swal.service';
import { CatalogoService } from './catalogo.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {
  @ViewChild('matPanel') matPanel: MatExpansionPanel;

  private modalRef: NgbModalRef;

  public Categorias: any[] = [];
  public Subcategorias: any[] = [];
  public Productos: any[] = [];
  public tipos_catalogo: any[] = [];
  public estados: any[] = [];
  public campos: any = {cat: [], subcat: []};
  public unidades_medida: any[] = [];
  public selectedCategory: any = {
    categoria: {
      id: null,
      nombre: ''
    },
    subcategoria: {
      id: null,
      nombre: ''
    }
  }
  public pagination: any = {
    page: 1,
    pageSize: 5
  }/* ,
    collectionSize: 0 */
  public alerta: any = {
    senyal: "",
    texto: ""
  }

  //ngbNavItem
  Object = Object;
  orderObj: any;
  filtroActivado: boolean = false;
  event = new EventEmitter<Event>();
  formFiltros: FormGroup;
  formProductos: FormGroup;
  filtroDefault: any = {};
  active = 1;
  loadingCategorias: boolean = false;
  loadingProductos: boolean = false;
  title:string = "";
  permission: Permissions = {
    menu: 'Órdenes de producción',
    permissions: {
      show: true,
      add: true
    }
  };

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private _permission: PermissionService,
    private _categoria: CategoriasService,
    private _user: UserService,
    private _swal: SwalService,
    private _catalogo: CatalogoService,
    private _modalCatalogo: ModalService,
    private _unit: UnidadesMedidasService,
    private fb: FormBuilder
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createForms();
      this.getCategorias();
      /* this.route.queryParamMap.subscribe((params: any) => {
        this.pagination.pageSize = (params.params.pageSize)?parseInt(params.params.pageSize):10;
        this.pagination.page = (params.params.page)?parseInt(params.params.page):1;
        this.selectedCategory.categoria.id = (params.params.categoria)?parseInt(params.params.categoria[0]):null;
        this.selectedCategory.subcategoria.id = (params.params.subcategoria)?parseInt(params.params.subcategoria[0]):null;
        this.selectedCategory.categoria.nombre = (params.params.categoria)?parseInt(params.params.categoria[1]):'';
        this.selectedCategory.subcategoria.nombre = (params.params.subcategoria)?parseInt(params.params.subcategoria[1]):'';
        Object.keys(this.formFiltros.value).forEach(campo => this.formFiltros.get(campo).setValue(params.params[campo]))
        this.filtroActivado = (JSON.stringify(this.formFiltros.value)!==JSON.stringify(this.filtroDefault));
        if(this.selectedCategory.categoria.id!==null){
          this.getProductosBySubcategoria(this.selectedCategory);
        } */

        this._catalogo.getTiposCatalogo().subscribe((res: any) => {
          this.tipos_catalogo = res.data;
        })
        this._unit.selectUnits().subscribe((res: any) => {
          this.unidades_medida = res.data;
        })
        this._catalogo.getEstados().subscribe((res: any) => {
          this.estados = res.data;
        })
      //});
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  openClose(){
    this.matPanel.toggle();
    this.filtroActivado = (JSON.stringify(this.formFiltros.value)!==JSON.stringify(this.filtroDefault));
    this.alerta=(!this.matPanel.expanded && this.filtroActivado)? {
      senyal: "!",
      texto: "¡Hay filtros aplicados!"
    }: {
      senyal: "",
      texto: ""
    }
  }

  resetFiltros() {
    this.formFiltros.reset(this.filtroDefault);
    this.filtroActivado = false
    this.alerta =  {
      senyal: "",
      texto: ""
    };
  }

  SetFiltros(data) {
    let params = new HttpParams;
    /* params = params.set('pag', data.page)
    params = params.set('pageSize', data.pageSize)
    for (const controlName in this.formFiltros.controls) {
      const control = this.formFiltros.get(controlName);
      if (control.value) {
        params = params.set(controlName, control.value);
      }
    } */
    data.categoria=(this.selectedCategory.categoria.id!==null)?data.categoria:'';
    data.subcategoria=(this.selectedCategory.subcategoria.id!==null)?data.subcategoria:'';
    this.Object.keys(data).forEach(control => {
      params = params.set(control,data[control]);
    })
    return params;
  }

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
      nombre: [''],
      tipo_catalogo: [''],
      estado: ['']
    });
    this.filtroDefault = this.formFiltros.value;

    this.formFiltros.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getProducts();
    })

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
      FormCamposCategoria: this.fb.array([]),
      FormCamposSubcategoria: this.fb.array([])
    });
  }

  get arrayCamposCat() {
    return this.formProductos.get('FormCamposCategoria') as FormArray;
  }

  get arrayCamposSubcat() {
    return this.formProductos.get('FormCamposSubcategoria') as FormArray;
  }

  catSubcatCampos(tipo:string) {
    const formCampos = {};
    this.campos[tipo].forEach(campo => {
      formCampos[campo.label] = campo.required=="Si" ?
        new FormControl(campo.valor || '',Validators.required):
        new FormControl(campo.valor || '')
    });

    return this.fb.group(formCampos);
  }

  newCampoCatSubcat(tipo:string) {
    let field = (tipo=="cat")?this.arrayCamposCat:this.arrayCamposSubcat;
    field.push(this.catSubcatCampos(tipo));
  }

  mostrarCampos(param,tipos:string[],template?:any){
      this._catalogo.getCampos(param).subscribe((res: any) => {
        this.campos = res.data;
        tipos.forEach(tipo =>{
          if(tipo=="cat"){
            this.arrayCamposCat.removeAt(0);
          }else{
            this.arrayCamposSubcat.removeAt(0);
          }
          this.newCampoCatSubcat(tipo);
        });
        if(template != undefined){
          this._modalCatalogo.open(template, 'lg');
        }
    });
  }

  openConfirm(confirm: any, titulo: string, data?: any ) {
    this.title = titulo;
    this.formProductos.reset();
    let params={};
    if(titulo == "Agregar"){
      this.formProductos.patchValue({
        Id_Categoria: this.selectedCategory.categoria.id,
        Id_Subcategoria: this.selectedCategory.subcategoria.id
      });
      params={
        categoria:this.selectedCategory.categoria.id ,
        subcategoria:this.selectedCategory.subcategoria.id
      };
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
      params={ producto:data.Id_Producto };
    }
    this.mostrarCampos(params,["cat","subcat"],confirm);
  }

  openCatSubcatModal(template: any,tipo:string){
    let params=(this.title == "Agregar")?
      {
        categoria:this.selectedCategory.categoria.id ,
        subcategoria:this.selectedCategory.subcategoria.id
      }
    :
      { producto:this.formProductos.value.Id_Producto };

    this._modalCatalogo.open(template, 'md');
    this.modalRef=this._modalCatalogo.modalRef;
    this.modalRef.result.then((res: any) => {
      this.mostrarCampos(params,[tipo]);
    }, (reason) => {
      this.mostrarCampos(params,[tipo]);
    });
  }

  getCategorias() {
    this.loadingCategorias = true;
    this._categoria.getCategorias().subscribe((res: any) => {
      this.Categorias = res.data;
      this.loadingCategorias = false;
    });
  }

  getProducts(page = 1) {
    this.pagination.page = page;

    let params = {
      ...this.pagination,
      ...this.formFiltros.value,
      categoria: this.selectedCategory.categoria.id,
      subcategoria: this.selectedCategory.subcategoria.id
    }
    this.loadingProductos = true;

    var paramsurl = this.SetFiltros(params);
    this.location.replaceState(this.router.url.split("?")[0], paramsurl.toString());
    this._catalogo.getData(params).subscribe((res: any) => {
      this.Productos = res.data.data;
      this.loadingProductos = false;
    })/* this.pagination.collectionSize = res.data.total; */
  }

  getProductosBySubcategoria(categoria){
    this.moveToTop();
    this.resetFiltros();
    this.matPanel.close();
    this.selectedCategory = categoria;
    this.getProducts();
  }

  cambiarEstado(producto, state) {
    let data = {
      id: producto.Id_Producto,
      estado: state
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: '¡El producto será ' + (producto.Estado == 'Activo' ? 'inactivado!' : 'activado!'),
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._catalogo.changeEstado(data).subscribe((r: any) => {
            this.getProducts(this.pagination.page);
          })
          this._swal.show({
            icon: 'success',
            title: 'Tarea completada con éxito!',
            text: 'El producto ha sido ' + (producto.Estado == 'Inactivo' ? 'activado' : 'inactivado') + ' con éxito.',
            timer: 1000,
            showCancel: false
          })
        }
      })
  }

  saveProductos(modal: any){
    if(this.formProductos.valid){
      ["cat","subcat"].forEach(tipo => {
        let campos = this.campos[tipo].map((campo) => campo={
          id:campo.vp_id || "",
          subcategory_variables_id:campo.sv_id,
          category_variables_id:campo.cv_id,
          valor:((tipo=="cat")?this.arrayCamposCat:this.arrayCamposSubcat).value[0][campo.label]
        });
        this.formProductos.value[(tipo=="cat")?"camposCategoria":"camposSubcategoria"] = campos;
      });
      delete this.formProductos.value.FormCamposCategoria;
      delete this.formProductos.value.FormCamposSubcategoria;
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: 'Si ya verificó la información y está de acuerdo, por favor proceda.',
        icon: 'question',
        showCancel: true
      }).then((result) => {
        if (result.isConfirmed) {
          this._catalogo.saveProduct(this.formProductos.value).subscribe((r: any) => {
            this.getProducts(this.pagination.page);
            modal.close();
            this._swal.show({
              icon: 'success',
              title: 'Tarea completada con éxito!',
              text: 'El producto ha sido registrado con éxito.',
              timer: 1000,
              showCancel: false
            });
          },(error) => {
            this._swal.show({
              icon: 'error',
              title: 'Se presentó un error!',
              text: error.message,
              timer: 1000,
              showCancel: false
            });
          });
        }
      })
    }else{
      this._swal.show({
        icon: 'error',
        title: 'Validación no superada!',
        text: 'El producto no ha sido registrado correctamente. Por favor verifique la información y vuelva a intentarlo.',
        timer: 1000,
        showCancel: false
      });
    }
  }
}
