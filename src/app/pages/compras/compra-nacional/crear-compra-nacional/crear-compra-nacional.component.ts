import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { TercerosService } from 'src/app/pages/crm/terceros/terceros.service';
import { BodegasService } from 'src/app/pages/ajustes/informacion-base/bodegas/bodegas.service.';
import { ProductoService } from 'src/app/pages/inventario/services/producto.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CategoriasService } from 'src/app/pages/ajustes/parametros/cat-subcat/categorias/categorias.service';
import { consts } from 'src/app/core/utils/consts';
const MENSAJES_ERROR: any = {
  Fecha_Entrega_Probable: 'Es necesario seleccionar una fecha válida',
  Id_Bodega_Nuevo: 'Por favor seleccione una bodega',
  Id_Punto_Dispensacion: 'Por favor seleccione un punto de dispensación',
  Id_Proveedor: 'Por favor seleccione un proveedor',
  Productos: 'No se puede guardar una orden de compra sin productos',
  Costo: 'El costo debe ser mayor que 0',
  Cantidad: 'La cantidad debe ser mayor que 0',
};

@Component({
  selector: 'app-crear-compra-nacional',
  templateUrl: './crear-compra-nacional.component.html',
  styleUrls: ['./crear-compra-nacional.component.scss'],
})
export class CrearCompraNacionalComponent implements OnInit {
  public reducerCantidad = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Cantidad);
  public reducerCosto = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Costo);
  public reducerIva = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Iva_Acu);
  public reducerTotal = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Total);

  public Cargando: boolean = true;
  public listaProductos: any[] = [];
  public listaProductosPorAgregar: any = [];
  masks = consts;
  public fecha = new Date();
  public Bodegas: any = [];
  public Tipo_Bodega: string = 'Bodega';
  public Proveedores: any = [];
  public Categorias: any = [];
  public id = this.route.snapshot.params['id'];
  public precompra = JSON.parse(localStorage.getItem('Compra'));
  public Id_Proveedor: any = '';
  public TamanoPrecompra: any;
  public Rotativo = false;
  public Subtotal = 0;
  public Iva = 0;
  public Total = 0;
  public Cantidad_v = 0;
  public Costo_v = 0;
  public Iva_v: any = 0;
  public Subtotal_F = 0;
  public Iva_F = 0;
  public Total_F = 0;
  public Subtotal_v = 0;
  public Nombre: string = '';
  public NombreProveedor: string = '';
  public Impuestos: any;
  public Iva_Disa: boolean = true;
  public product: any[] = [];
  public Productos: any = [];
  private band_editar: boolean = false;
  public filtroProducto: any = {
    nombre: '',
    categoria: '',
    subcategoria: '',
  };
  public Tipo: any = '';
  public user = '';
  public datosCabecera: any = {
    Titulo: 'Nueva orden de compra',
    Fecha: new Date(),
  };
  public selectedCategory: any = {
    categoria: null,
    subcategoria: null,
  };

  Object = Object;
  productsValidation: any[] = [];
  mostrarAlertas: boolean = false;
  formCompra: FormGroup;
  deleteSwal: any;
  ListaProducto: any[] = [];
  productoFiltro: any = null;
  pagination: any = {
    paginateData: [],
    page: 1,
    pageSize: 5,
    collectionSize: 0,
  };
  posicion: any = '';
  puntos: any = [];
  subcategorias: [] = [];
  proveedorValido: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _user: UserService,
    private _proveedor: TercerosService,
    private _producto: ProductoService,
    private _categoria: CategoriasService,
    private _modal: ModalService,
    private _bodegas: BodegasService,
    public _swal: SwalService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.user = this._user.user.person.id;
    this.createForm();

    let params = this.route.snapshot.queryParams;
    this.Cargando = true;
    if (params.Pre_Compra != undefined) {
      this.http
        .get(
          environment.base_url +
          '/php/rotativoscompras/detalle_pre_compra/' +
          params.Pre_Compra
        )
        .subscribe((res: any) => {
          this.listaProductosPorAgregar = res.data.Productos;
          this.products.push(this.fb.group(res.data.Productos));
          this.Cargando = false;
          this.Id_Proveedor = res.data.Datos.Id_Proveedor;
          this.listaProductosPorAgregar.push({
            producto: '',
            Total: 0,
            Rotativo: 0,
            Iva_Disa: true,
            Presentacion: 0,
            Iva_Acu: 0,
          });

          this.products.push(
            this.fb.group({
              Costo: 0,
              Total: 0,
              Cantidad: 1,
              Iva: 0,
              Id_Producto: '',
            })
          );

          this.NombreProveedor = res.data.Proveedor;
          this.ActualizaValores();
          this.Tipo = 'Recurrente';
        });
    }

    this._bodegas.getAllBodegas().subscribe((res: any) => {
      this.Bodegas = res.data;
    });

    this.http.get(environment.base_url + '/impuestos').subscribe((res: any) => {
      this.Impuestos = res.data;
    });

    if (this.id != undefined && this.precompra != undefined) {
      this.Rotativo = true;
      const proveedor = this.precompra.find(
        (lista) => lista.Id_Proveedor === this.id
      );
      const index = this.precompra.indexOf(proveedor);
      var idProveedor = this.precompra[index].Id_Proveedor;
      this.Id_Proveedor = idProveedor;
      var productos = this.precompra[index].Productos;
      productos.forEach((element) => {
        if (element != null) {
          this.listaProductosPorAgregar.push({
            producto: element,
            Total: parseFloat(element.Costo) * parseFloat(element.Cantidad),
            Rotativo: 0,
            Iva_Disa: true,
          });

          this.products.push(
            this.fb.group({
              Id_Producto: [element.Id_Producto, Validators.required],
              Costo: [parseFloat(element.Costo), Validators.min(1)],
              Cantidad: [element.Cantidad, [Validators.min(1)]],
              Iva: [element.Iva, Validators.required],
              Total: [parseFloat(element.Costo) * parseFloat(element.Cantidad)],
            })
          );
        }
      });
      this.ActualizaValores();
    }

    this.http
      .get(
        environment.base_url +
        '/php/inventario_fisico_puntos/lista_punto_funcionario',
        { params: { id: this.user } }
      )
      .subscribe((res: any) => {
        this.puntos = res.data;
      });

    this._proveedor.getThirdPartyProvider({}).subscribe((res: any) => {
      this.Proveedores = res.data;
    });

    this._categoria.getCategorias().subscribe((res: any) => {
      this.Categorias = res.data;
    });
  }

  createForm() {
    this.formCompra = this.fb.group({
      Id_Orden_Compra_Nacional: [null],
      Fecha_Entrega_Probable: [
        this.fecha.toISOString().slice(0, 10),
        [Validators.required, ValidadoresEspeciales.fechaMin(this.fecha)],
      ],
      Identificacion_Funcionario: [this.user, Validators.required],
      Id_Bodega_Nuevo: ['', Validators.required],
      Tipo_Bodega: ['Bodega', Validators.required],
      Id_Punto_Dispensacion: ['', Validators.required],
      Id_Proveedor: [null, Validators.required],
      Tipo: ['Recurrente'],
      Observaciones: [''],
      Productos: this.fb.array([], [Validators.required]),
    });
    this.formCompra.get('Id_Punto_Dispensacion').disable();
    let tipo_bodega = this.formCompra.get('Tipo_Bodega');
    tipo_bodega.valueChanges.subscribe((r) => {
      if (r == 'Punto') {
        this.formCompra.get('Id_Bodega_Nuevo').disable();
        this.formCompra.get('Id_Punto_Dispensacion').enable();
      } else {
        this.formCompra.get('Id_Bodega_Nuevo').enable();
        this.formCompra.get('Id_Punto_Dispensacion').disable();
      }
    });
    this.formCompra.get('Id_Proveedor').statusChanges.subscribe((res: any) => {
      this.proveedorValido = res == 'VALID';
    });
  }

  get products(): FormArray {
    return this.formCompra.get('Productos') as FormArray;
  }

  getSubCategories(event) {
    if (event) {
      this.subcategorias = event.subcategory;
      this.selectedCategory.subcategoria = '';
    }
  }

  public openConfirm(confirm) {
    this._modal.open(confirm, 'xl');
  }

  filtros() {
    if (
      ![0, ''].includes(
        this.selectedCategory.categoria + this.selectedCategory.subcategoria
      )
    ) {
      let params = {
        ...this.selectedCategory,
        company_id: this._user.user.person.company_worked.id,
      };
      this._producto.getProductos(params).subscribe((res: any) => {
        let productIds = this.formCompra.value.Productos.map(
          (x) => (x = x.Id_Producto)
        );
        this.Productos = res.data.filter((v) =>
          productIds.every((valor) => valor != v.Id_Producto)
        );
        this.Productos.forEach((valor) => {
          valor['Iva_Disa'] = valor.Gravado == 'Si' ? false : true;
          valor['Presentacion'] = valor.Cantidad_Presentacion;
          valor['producto'] = valor.Nombre;
          delete valor.Gravado;
          delete valor.Cantidad_Presentacion;
          delete valor.Nombre;
        });
        this.productoFiltro = null;
      });
    }
    this.paginarProductos();
  }

  GuardarCompra() {
    if (this.formCompra.valid) {
      this._swal
        .show({
          title: '¿Estás seguro(a)?',
          text: '¡La compra será registrada! Si ya verificó la información a enviar, por favor proceda.',
          icon: 'question',
          showCancel: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            let formulario = this.formCompra.value;
            let params = this.route.snapshot.queryParams;
            if (params.Pre_Compra != undefined) {
              let datos = new FormData();
              datos.append('id_pre_compra', params.Pre_Compra);
              this.http
                .post(
                  environment.base_url +
                  '/php/rotativoscompras/actualizar_estado',
                  datos
                )
                .subscribe((data: any) => { });
            }
            let datos = {
              datos: formulario,
              company_id: this._user.user.person.company_worked.id,
            };
            if (params.Pre_Compra != undefined) {
              datos['id_pre_compra'] = params.Pre_Compra;
            }

            this.http
              .post(
                environment.base_url +
                '/php/comprasnacionales/guardar_compra_nacional',
                datos
              )
              .subscribe(
                (res: any) => {
                  this._swal.show({
                    title: 'Creación de orden de compras',
                    text: res.data,
                    icon: res.err == null ? 'success' : 'error',
                    timer: 1000,
                    showCancel: false,
                  });
                  this.formCompra.reset();
                  this.VerPantallaLista();
                  if (this.id != undefined && this.precompra != undefined) {
                    const proveedor = this.precompra.find(
                      (lista) => lista.Id_Proveedor === this.id
                    );
                    const index = this.precompra.indexOf(proveedor);
                    this.precompra.splice(index, 1);
                    localStorage.setItem(
                      'Compra',
                      JSON.stringify(this.precompra)
                    );
                  }
                },
                (error) => {
                  this._swal.show({
                    title: 'Error',
                    text:
                      error.err != null
                        ? error.data
                        : 'Ha ocurrido un error inesperado de conexión.',
                    icon: 'error',
                    timer: 1000,
                    showCancel: false,
                  });
                }
              );
          }
        });
    } else {
      this.formCompra.updateValueAndValidity();
      if (this.formCompra.controls['Productos'].hasError('required')) {
        this._swal.show({
          title: 'Error',
          text: MENSAJES_ERROR['Productos'],
          icon: 'error',
          showCancel: false,
        });
      } else {
        this.validarProductos();
        this.mostrarAlertas = true;
      }
      this.proveedorValido = this.formCompra.get('Id_Proveedor').valid;
    }
  }

  validarProductos() {
    this.productsValidation = Object.create(MENSAJES_ERROR);
    this.products.controls.forEach((prod, id) => {
      let listaControles = this.products.controls[id] as FormGroup;
      Object.keys(prod.value).forEach((y) => {
        if (!Array.isArray(this.productsValidation[y])) {
          this.productsValidation[y] = [];
        }
        if (!listaControles.controls[y].valid) {
          let numFila =
            (id + 1) % this.pagination.pageSize == 0
              ? this.pagination.pageSize
              : (id + 1) % this.pagination.pageSize;
          let numPag = Math.ceil((id + 1) / this.pagination.pageSize);
          this.productsValidation[y].push({
            texto:
              MENSAJES_ERROR[y] +
              ' en la fila número ' +
              numFila +
              ' de la página ' +
              numPag +
              '.',
            pagina: numPag,
          });
        }
      });
    });

    Object.keys(this.productsValidation).forEach((campo) => {
      if (this.productsValidation[campo].length == 0) {
        delete this.productsValidation[campo];
      }
    });
  }

  VerPantallaLista() {
    this.router.navigate(['/compras/compra-nacional']);
    /* this.router.navigate(['/compras/nacional']); */
  }

  AgregarProducto(valor) {
    if (valor) {
      this.listaProductosPorAgregar.push({
        Id_Producto: valor.Id_Producto,
        producto: valor.producto,
        Presentacion: valor.Presentacion,
        Rotativo: 0,
        Iva_Disa: valor.Iva_Disa,
        editar: true,
        delete: true,
        Iva_Acu: 0,
        Total: 0,
        Embalaje: valor.Embalaje,
        editCosto: false,
        mostrarProductoEnTabla: true,
      });
      let formSub = this.fb.group({
        Id_Producto: [valor.Id_Producto, Validators.required],
        Cantidad: [1, [Validators.min(1)]],
        Costo: [parseFloat(valor.Costo), Validators.min(1)],
        Iva: [0, Validators.required],
        Total: [0],
      });
      this.products.push(formSub);
    }
    this.filtros();
  }

  deleteProduct(posicion?, event?) {
    if (posicion !== undefined && event !== undefined) {
      if (event.screenX != 0) {
        this.listaProductosPorAgregar.splice(posicion, 1);
        this.products.removeAt(posicion);
      }
    } else {
      this.listaProductosPorAgregar = [];
      this.products.clear();
    }
    this.ActualizaValores();
    this.filtros();
    this.validarProductos();
  }

  CalculoTotal(pos) {
    var cantidad = this.formCompra.value.Productos[pos].Cantidad;
    var Costo = this.formCompra.value.Productos[pos].Costo;
    var subtotal = parseFloat(Costo) * parseFloat(cantidad);
    var iva = this.formCompra.value.Productos[pos].Iva;
    this.listaProductosPorAgregar[pos].Iva_Acu =
      subtotal * (parseInt(iva) / 100);
    this.listaProductosPorAgregar[pos].Total = subtotal.toFixed();
    this.products.controls[pos].patchValue({ Total: subtotal });
    this.ActualizaValores();
  }

  ActualizaValores() {
    this.Cantidad_v = parseFloat(
      this.formCompra.value.Productos.reduce(this.reducerCantidad, 0)
    );
    this.Costo_v = parseFloat(
      this.formCompra.value.Productos.reduce(this.reducerCosto, 0)
    );
    this.Iva_F = parseFloat(
      this.listaProductosPorAgregar.reduce(this.reducerIva, 0)
    );
    this.Subtotal_v = parseFloat(
      this.formCompra.value.Productos.reduce(this.reducerTotal, 0)
    );
    this.Subtotal_F = this.Subtotal_v;
    this.Total_F = this.Subtotal_F + this.Iva_F;
  }

  paginarProductos(
    page = Math.ceil(
      this.listaProductosPorAgregar.length / this.pagination.pageSize
    )
  ) {
    this.pagination.collectionSize = this.listaProductosPorAgregar.length;
    this.pagination.page = page;
    let offset = (page - 1) * this.pagination.pageSize;
    let productsPerPage = this.formCompra.value.Productos.slice(offset)
      .slice(0, this.pagination.pageSize)
      .map((item) => (item = item.Id_Producto));
    this.listaProductosPorAgregar.map(
      (item) =>
      (item.mostrarProductoEnTabla = productsPerPage.includes(
        item.Id_Producto
      )
        ? true
        : false)
    );
  }
}

class ValidadoresEspeciales {
  public static fechaMin(valor: Date) {
    return (elemento: FormControl) => {
      let fechaElemento = new Date(elemento.value),
        fechaMinina = new Date(valor.toISOString().split('T')[0]);
      let numDias = Math.floor(
        (fechaElemento.getTime() - fechaMinina.getTime()) /
        (1000 * 60 * 60 * 24)
      );
      let invalido: boolean = numDias < 0;
      return invalido
        ? {
          fechaMin: fechaMinina.toISOString().split('T')[0],
          actual: elemento.value,
        }
        : null;
    };
  }
}
/*  addProduct(pos) {
     let checkbox = (document.getElementById('check' + pos) as HTMLInputElement)
       .checked;
     let modelo: any = {
       Costo: this.ListaProducto[pos].Costo,
       Presentacion: this.ListaProducto[pos].Cantidad_Presentacion,
       Id_Producto: this.ListaProducto[pos].Id_Producto,
       producto: this.ListaProducto[pos].Nombre,
       Iva_Disa: this.ListaProducto[pos].Gravado == 'Si' ? false : true,
       Embalaje: this.ListaProducto[pos].Embalaje,
     };
     if (checkbox == true) {
       this.Productos.push(modelo);
     } else {
       let posicion = this.Productos.indexOf(modelo);
       this.Productos.splice(posicion, 1);
     }
   } */
 //CapturarDigitacion(pos) {
/*  let cantidad = (
   document.getElementById('Cantidad' + pos) as HTMLInputElement
 ).value;
 let costo = (document.getElementById('Costo' + pos) as HTMLInputElement)
   .value;
 let iva = (document.getElementById('Iva' + pos) as HTMLInputElement).value;
 let subtotal = parseFloat(cantidad) * parseFloat(costo);

 this.listaProductosPorAgregar[pos].Cantidad = cantidad;
 this.listaProductosPorAgregar[pos].Costo = costo;
 this.listaProductosPorAgregar[pos].Iva = iva;
 this.listaProductosPorAgregar[pos].Total = subtotal.toFixed(); */
/* let cantidad = (
  document.getElementById('Cantidad' + pos) as HTMLInputElement
).value;
let costo = (document.getElementById('Costo' + pos) as HTMLInputElement)
  .value;
let iva = (document.getElementById('Iva' + pos) as HTMLInputElement).value;
let subtotal = parseFloat(cantidad) * parseFloat(costo);

this.listaProductosPorAgregar[pos].Cantidad = cantidad;
this.listaProductosPorAgregar[pos].Costo = costo;
this.listaProductosPorAgregar[pos].Iva = iva;
this.listaProductosPorAgregar[pos].Total = subtotal.toFixed();
} */

/* this.Cantidad_v = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer, 0));
   this.Costo_v = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer1, 0));
   this.Iva_F = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer2, 0));
   this.Subtotal_v = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer3, 0)); */

/*listaProductosBodega(Bodega) {
     this.http.get(environment.ruta + 'php/comprasnacionales/producto_bodega_compra_nacional.php').subscribe((data: any) => {
        this.ListaProducto = data;
      });
  }*/

/**
 * Validadores personalizados:
 * -> fechamin => Validar que no se envíe una fecha anterior a la señalada.
 */

//});

    //this.Productos.forEach((valor, i) => {
/* if (
  this.listaProductosPorAgregar.length == 1 &&
  this.listaProductosPorAgregar[0].Id_Producto == ''
) {
  // Cuando la lista de productos está vacía o inicializada por primera vez.
  this.listaProductosPorAgregar[0].Costo = valor.Costo;
  this.listaProductosPorAgregar[0].Presentacion = valor.Presentacion;
  this.listaProductosPorAgregar[0].Id_Producto = valor.Id_Producto;
  this.listaProductosPorAgregar[0].producto = valor.producto;
  this.listaProductosPorAgregar[0].Iva_Disa = valor.Iva_Disa;
  this.listaProductosPorAgregar[0].editar = true;
  this.listaProductosPorAgregar[0].delete = true;
  this.listaProductosPorAgregar[0].Embalaje = valor.Embalaje;
} else if (this.band_editar) {
  // Cuando se quiere editar un producto.
  this.listaProductosPorAgregar[this.posicion].Costo = valor.Costo;
  this.listaProductosPorAgregar[this.posicion].Presentacion = valor.Presentacion;
  this.listaProductosPorAgregar[this.posicion].Id_Producto = valor.Id_Producto;
  this.listaProductosPorAgregar[this.posicion].producto = valor.producto;
  this.listaProductosPorAgregar[this.posicion].Iva_Disa = valor.Iva_Disa;
  this.listaProductosPorAgregar[this.posicion].Embalaje = valor.Embalaje;
  this.listaProductosPorAgregar[this.posicion].delete = true;
  this.band_editar = false;
} else {
  // Cuando se quiere agregar nuevos productos.

  if (
    this.listaProductosPorAgregar.length > 1 &&
    this.listaProductosPorAgregar[this.posicion].Id_Producto == ''
  ) {
    // Si la lista de productos estaba llena y la posicion donde se está buscando el producto estaba vacía, edita el campo actual.
    this.listaProductosPorAgregar[this.posicion].Costo = valor.Costo;
    this.listaProductosPorAgregar[this.posicion].Presentacion = valor.Presentacion;
    this.listaProductosPorAgregar[this.posicion].Id_Producto = valor.Id_Producto;
    this.listaProductosPorAgregar[this.posicion].producto = valor.producto;
    this.listaProductosPorAgregar[this.posicion].Iva_Disa = valor.Iva_Disa;
    this.listaProductosPorAgregar[this.posicion].Embalaje = valor.Embalaje;
    this.listaProductosPorAgregar[this.posicion].delete = true;
  } else {
    if (editar_producto) {
      // Si se editó un producto, se declara esta condicional como bandera para que elimine el ultimo campo en blanco y pueda añadir en la lista de productos sin problema.
      let last_position = this.listaProductosPorAgregar.length - 1;
      this.listaProductosPorAgregar.splice(last_position, 1);
      editar_producto = false;
    } */
/* let pos = this.listaProductosPorAgregar.length - 1;

if (this.listaProductosPorAgregar[pos].producto != '') {
  // Si en la ultima posición del Array ya no es vacío se agrega un nuevo campo para una nueva busqueda.
  this.listaProductosPorAgregar.push({
    producto: '',
    Presentacion: '',
    Costo: 0,
    Total: 0,
    Cantidad: null,
    Iva: 0,
    Rotativo: 0,
    Id_Producto: '',
    Iva_Disa: false,
    editar: false,
    delete: false,
    Iva_Acu: 0,
    Embalaje: '',
  });
}

this.modalService.dismissAll(); */

/* searchProduct(pos, editar) {
    this.ListaProducto = [];
    this.Productos = [];
    this.filtroProducto.nombre = '';
    this.filtroProducto.lab_com = '';
    this.filtroProducto.lab_gen = '';
    this.filtroProducto.cum = '';
    this.filtroProducto.catalogo = '';
    let producto = (
      document.getElementById('Producto' + pos) as HTMLInputElement
    ).value;
    this.filtroProducto.nombre = producto;
    this.posicion = pos;
    this.band_editar = editar;
    this.Cargando = true;

    if (producto != '') {
      this._producto.getProductos({ nombre: producto, company_id: this._user.user.person.company_worked.id})
      .subscribe((res: any) => {
        this.Cargando = false;
        this.ListaProducto = res.data;
      });
    } else {
      this.Cargando = false;
    }
  } */

/*  public reducer = (accumulator, currentValue) =>
     accumulator + parseFloat(currentValue.Cantidad);
   public reducer1 = (accumulator, currentValue) =>
     accumulator + parseFloat(currentValue.Costo);
   public reducer2 = (accumulator, currentValue) =>
     accumulator + parseFloat(currentValue.Iva_Acu);
   public reducer3 = (accumulator, currentValue) =>
     accumulator + parseFloat(currentValue.Total); */

/* public alertOption: SweetAlertOptions = {
    title: '¿Está Seguro?',
    text: 'Se dispone a Generar esta Compra',
    showCancelButton: true,
    cancelButtonText: 'No, Dejame Comprobar!',
    confirmButtonText: 'Si, Guardar',
    showLoaderOnConfirm: true,
    focusCancel: true,
    icon: 'info',
    preConfirm: () => {
      return new Promise((resolve) => {
        // return this.GuardarCompra(this.FormCompra, resolve);
        return this.GuardarCompra(this.formCompra);
      });
    },
    allowOutsideClick: () => !swal.isLoading(),
  }; */

//
/* this.listaProductosPorAgregar.push({
        producto: '',
        Costo: 0,
        Total: 0,
        Cantidad: null,
        Iva: 0,
        Rotativo: 0,
        Id_Producto: '',
        Iva_Disa: true,
      }); */
/* this.Cantidad_v = parseFloat(
        this.listaProductosPorAgregar.reduce(this.reducer, 0)
      );
      this.Costo_v = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer1, 0));
      //this.Iva_v = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer2, 0));
      this.Subtotal_v = parseFloat(
        this.listaProductosPorAgregar.reduce(this.reducer3, 0)
      );

      this.Subtotal_F = this.Subtotal_v;
      //this.Iva_F=(this.Subtotal_v*this.Iva_v)/100;
      this.Total_F = this.Subtotal_v + this.Iva_v; */
/*var subtotal = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer, 0));
        this.Subtotal = subtotal - (subtotal * 0.19)
        this.Iva = (subtotal * 0.19);
        this.Total = subtotal;*/

/* private getDismissReason(reason: any) {

  } */
/*
    filtrosOld() {
      let params: any = {};

      if (
        this.filtroProducto.lab_com != '' ||
        this.filtroProducto.lab_gen != '' ||
        this.filtroProducto.cum != '' ||
        this.filtroProducto.catalogo
      ) {
        this.Cargando = true;
        this.ListaProducto = [];

        if (this.filtroProducto.nombre != '') {
          params.nom = this.filtroProducto.nombre;
        }
        if (this.filtroProducto.lab_com != '') {
          params.lab_com = this.filtroProducto.lab_com;
        }
        if (this.filtroProducto.lab_gen != '') {
          params.lab_gen = this.filtroProducto.lab_gen;
        }
        if (this.filtroProducto.cum != '') {
          params.cum = this.filtroProducto.cum;
        }
        if (this.filtroProducto.catalogo != '') {
          params.catalogo = this.filtroProducto.catalogo;
        }

        let queryString = Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');

        this.http.get(environment.base_url + '/php/comprasnacionales/lista_productos?' +
          queryString, { params: { company_id: this._user.user.person.company_worked.id } }
        ).subscribe((res: any) => {
          this.Cargando = false;
          this.ListaProducto = res.data;
        });
      } else {
        this.filtroProducto.lab_com = '';
        this.filtroProducto.lab_gen = '';
        this.filtroProducto.cum = '';
        this.filtroProducto.catalogo = '';
        this.Cargando = true;
        this.ListaProducto = [];

        this.http.get(environment.base_url + '/php/comprasnacionales/lista_productos', {
            params: { nom: this.filtroProducto.nombre, company_id: this._user.user.person.company_worked.id },
          })
          .subscribe((res: any) => {
            this.Cargando = false;
            this.ListaProducto = res.data;
          });
      }
    } */
