import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
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
  public Categorias: any[] = [];
  public Subcategorias: any[] = [];
  public Productos: any[] = [];
  public tipos_catalogo: any[] = [];
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
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  alerta: any = {
    senyal: "",
    texto: ""
  }
  Object = Object;
  orderObj: any;
  filtroActivado: boolean = false;
  event = new EventEmitter<Event>();
  formFiltros: FormGroup;
  productoDetalle: any = {};
  filtroDefault: any = {};
  productoDefault: any = {};
  active = 1;
  loadingCategorias: boolean = false;
  loadingProductos: boolean = false;

  title: string = "";
  permission: Permissions = {
    menu: 'Catálogo',
    permissions: {
      show: true
    }
  };


  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private _permission: PermissionService,
    private _categoria: CategoriasService,
    private _swal: SwalService,
    private _catalogo: CatalogoService,
    private _unit: UnidadesMedidasService,
    private fb: FormBuilder,

  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createForms();
      this.getProducts();
      this.getCategorias();
      this.route.queryParamMap.subscribe((params: any) => {
        this.pagination.pageSize = (params.params.pageSize) ? parseInt(params.params.pageSize) : 10;
        this.pagination.page = (params.params.page) ? parseInt(params.params.page) : 1;
        this.selectedCategory.categoria.id = (params.params.categoria) ? parseInt(params.params.categoria) : null;
        this.selectedCategory.subcategoria.id = (params.params.subcategoria) ? parseInt(params.params.subcategoria) : null;
        this.selectedCategory.categoria.nombre = (params.params.nom_categoria) ? params.params.nom_categoria : '';
        this.selectedCategory.subcategoria.nombre = (params.params.nom_subcategoria) ? params.params.nom_subcategoria : '';
        Object.keys(this.formFiltros.value).forEach(campo => this.formFiltros.get(campo).setValue(params.params[campo] || this.filtroDefault[campo], { emitEvent: false }));
        this.filtroActivado = this.verificarFiltros();
        if (this.selectedCategory.categoria.id !== null) {
          this.getProductosBySubcategoria(this.selectedCategory, false);
        }
      })
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  verificarFiltros(): boolean {
    let filtroFlag = (JSON.stringify(this.formFiltros.value) !== JSON.stringify(this.filtroDefault));
    let panelFlag = (this.matPanel) ? this.matPanel.expanded : false;
    this.alerta = (!panelFlag && filtroFlag) ? {
      senyal: "!",
      texto: "¡Hay filtros aplicados!"
    } : {
      senyal: "",
      texto: ""
    }
    return filtroFlag;
  }

  openClose() {
    this.matPanel.toggle();
    this.filtroActivado = this.verificarFiltros();
  }

  resetFiltros() {
    this.formFiltros.reset(this.filtroDefault, { emitEvent: false });
    this.filtroActivado = false
    this.alerta = {
      senyal: "",
      texto: ""
    };
  }

  SetFiltros(data) {
    let params = new HttpParams;
    data.categoria = this.selectedCategory.categoria.id ? data.categoria : '';
    data.subcategoria = this.selectedCategory.subcategoria.id ? data.subcategoria : '';
    data.nom_categoria = this.selectedCategory.categoria.id ? this.selectedCategory.categoria.nombre : '';
    data.nom_subcategoria = this.selectedCategory.subcategoria.id ? this.selectedCategory.subcategoria.nombre : '';
    this.Object.keys(data).forEach(control => {
      if (data[control]) { params = params.set(control, data[control]); }
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
      estado: [''],
      imagen: ['']
    });
    this.filtroDefault = this.formFiltros.value;

    this.formFiltros.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getProducts();
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
      this.pagination.collectionSize = res.data.total;
    })/*  */
  }

  getProductosBySubcategoria(categoria, clickedFlag = true) {
    if (clickedFlag) {
      this.moveToTop();
      this.resetFiltros();
      this.matPanel.close();
      this.selectedCategory = categoria;
    }
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


}
