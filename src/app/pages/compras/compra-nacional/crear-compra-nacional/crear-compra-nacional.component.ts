import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { TercerosService } from 'src/app/pages/crm/terceros/terceros.service';
import { BodegasService } from 'src/app/pages/ajustes/informacion-base/bodegas/bodegas.service.';
import { ProductoService } from 'src/app/pages/inventario/services/producto.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { CategoriasService } from 'src/app/pages/ajustes/parametros/cat-subcat/categorias/categorias.service';
import { consts } from 'src/app/core/utils/consts';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { CompraNacionalService } from '../compra-nacional.service';
import { SolicitudesCompraService } from '../../solicitudes-compra/solicitudes-compra.service';
@Component({
  selector: 'app-crear-compra-nacional',
  templateUrl: './crear-compra-nacional.component.html',
  styleUrls: ['./crear-compra-nacional.component.scss'],
})
export class CrearCompraNacionalComponent implements OnInit {
  reducerCosto = (accumulator, currentValue) => accumulator + parseFloat(currentValue?.Subtotal);
  reducerIva = (accumulator, currentValue) => accumulator + parseFloat(currentValue?.Valor_Iva);
  reducerTotal = (accumulator, currentValue) => accumulator + parseFloat(currentValue?.Total);

  loading: boolean;
  user: any;
  id: any;
  masks = consts;
  today = new Date();
  bodegas: any = [];
  proveedores: any = [];
  formCompra: FormGroup;
  formCategories: FormGroup;
  filteredCategories: any[] = [];
  filteredBodega: any[] = [];
  filteredProveedor: any[] = [];
  Categorias: any = [];
  Productos: any = [];
  Impuestos: any[] = [];
  datosCabecera: any = {
    Titulo: 'Nueva orden de compra',
    Fecha: this.today,
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _user: UserService,
    private _proveedor: TercerosService,
    private _producto: ProductoService,
    private _categoria: CategoriasService,
    private _bodegas: BodegasService,
    public _consecutivos: ConsecutivosService,
    public _swal: SwalService,
    public _compra: CompraNacionalService,
    private fb: FormBuilder,
    private _solicitud: SolicitudesCompraService
  ) {
    this.user = this._user?.user?.person?.id;
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('solicitud_id');
      if (this.id) {
        this.getSolicitud(this.id)
      }
    })
    this.loading = true;
    this.createForm();
    this.createFormCategories();
    this.getConsecutivo();
    this.getBodegas();
    this.getImpuestos();
    this.getProveedores();
    await this.getCategories();
    this.loading = false;
  }

  getSolicitud(id) {
    this._solicitud.getDataPurchaseRequest(id).subscribe((res: any) => {
      console.log(res);
    })
  }

  async getCategories() {
    await this._categoria.getCategorias().toPromise().then((res: any) => {
      this.Categorias = res?.data;
      this.filteredCategories = res?.data?.slice()
    });
  }

  getProveedores() {
    this._proveedor.getThirdPartyProvider({}).subscribe((res: any) => {
      this.proveedores = res?.data;
      this.filteredProveedor = res?.data?.slice();
    });
  }

  getBodegas() {
    this._bodegas.getAllBodegas().subscribe((res: any) => {
      this.bodegas = res?.data;
      this.filteredBodega = res?.data?.slice();
    });
  }
  searching: boolean;
  searchFailed: boolean;
  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this._compra.getProducts({ search: term, category_id: this.formCategories.get('category_id').value }).pipe(
          tap((results) => {
            if (results?.length === 0) {
              this.searchFailed = true;
            } else {
              this.searchFailed = false;
            }
          }),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

  formatter = (x: any) => x.name;

  getImpuestos() {
    this.http.get(environment.base_url + '/impuestos').subscribe((res: any) => {
      this.Impuestos = res?.data;
    });
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('Orden_Compra_Nacional').subscribe((r: any) => {
      this.datosCabecera.CodigoFormato = r.data?.format_code
      this.formCompra.patchValue({ format_code: this.datosCabecera?.CodigoFormato })
      let con = this._consecutivos.construirConsecutivo(r.data);
      this.datosCabecera.Codigo = con
    })
  }

  addProduct(product, $event, input) {
    if (!this.products?.value?.some(x => x.Id_Producto == product.Id_Producto)) {
      let prod = this.fb.group({
        Id_Producto_Orden_Compra_Nacional: [''],
        Nombre_Comercial: [product?.Nombre_Comercial],
        Embalaje_id: [product?.Embalaje_id],
        Embalaje_nombre: [product?.packaging?.name],
        Presentacion: [product?.Presentacion],
        Id_Producto: [product?.Id_Producto],
        Cantidad: [1, Validators.min(1)],
        Costo: [product?.Precio, Validators.min(1)],
        impuesto_id: [product?.impuesto_id, Validators.required],
        Total: [0],
        Subtotal: [0],
        Valor_Iva: [0],
      })
      this.subscribeProductsForm(prod)
      this.products.push(prod)
    } else {
      this._swal.show({
        icon: 'error',
        title: 'Elemento duplicado',
        text: 'Ya has agregado este producto',
        showCancel: false
      })
    }
    $event.preventDefault();
    input.value = '';
  }

  subscribeProductsForm(prod) {
    let total = prod?.get('Total');
    let subtotal = prod?.get('Subtotal');
    let iva = prod?.get('Valor_Iva');
    let costo = prod?.get('Costo');
    let cantidad = prod?.get('Cantidad');
    let impuesto_id = prod?.get('impuesto_id');
    let impuesto = this.Impuestos?.find(x => x?.Id_Impuesto == impuesto_id?.value);
    let valorIva = (cantidad?.value * costo?.value * impuesto?.Valor / 100);
    let subtotalItem = (cantidad?.value * costo?.value);
    let totalItem = valorIva + subtotalItem;
    this.updateTotals();
    prod.patchValue({
      Total: totalItem,
      Subtotal: subtotalItem,
      Valor_Iva: valorIva
    })
    cantidad.valueChanges.subscribe(value => {
      let costo = prod.get('Costo');
      let impuesto_id = prod.get('impuesto_id');
      let impuesto = this.Impuestos.find(x => x.Id_Impuesto == impuesto_id.value);
      let valorIva = (value * costo.value * impuesto.Valor / 100);
      let subtotal = (value * costo.value);
      let total = valorIva + subtotal;
      prod.patchValue({
        Total: total,
        Subtotal: subtotal,
        Valor_Iva: valorIva
      })
    })
    costo.valueChanges.subscribe(value => {
      let cantidad = prod.get('Cantidad');
      let impuesto_id = prod.get('impuesto_id');
      let impuesto = this.Impuestos.find(x => x.Id_Impuesto == impuesto_id.value);
      let valorIva = (value * cantidad.value * impuesto?.Valor / 100);
      let subtotal = (value * cantidad.value);
      let total = valorIva + subtotal;
      prod.patchValue({
        Total: total,
        Subtotal: subtotal,
        Valor_Iva: valorIva
      })
    })
    impuesto_id.valueChanges.subscribe(value => {
      let cantidad = prod.get('Cantidad');
      let costo = prod.get('Costo');
      let impuesto = this.Impuestos.find(x => x.Id_Impuesto == value);

      let valorIva = (costo.value * cantidad.value * impuesto?.Valor / 100);
      let subtotal = (costo.value * cantidad.value);
      let total = valorIva + subtotal;
      prod.patchValue({
        Total: total,
        Subtotal: subtotal,
        Valor_Iva: valorIva
      })
    })
    total.valueChanges.subscribe(value => {
      this.updateTotals();
    })
    subtotal.valueChanges.subscribe(value => {
      this.updateTotals();
    })
    iva.valueChanges.subscribe(value => {
      this.updateTotals();
    })
  }

  updateTotals() {
    setTimeout(() => {
      let subtotal = parseFloat(
        this.formCompra.value.Productos.reduce(this.reducerCosto, 0)
      );
      let iva = parseFloat(
        this.formCompra.value.Productos.reduce(this.reducerIva, 0)
      );
      let total = parseFloat(
        this.formCompra.value.Productos.reduce(this.reducerTotal, 0)
      );
      this.formCompra.patchValue({
        Iva: iva,
        Subtotal: subtotal,
        Total: total
      })
    }, 500);
  }

  createFormCategories() {
    this.formCategories = this.fb.group({
      category_id: [''],
    })
    this.formCategories.get('category_id').valueChanges.subscribe(v => {
      this.validateProducts();
    })
  }

  createForm() {
    this.formCompra = this.fb.group({
      Id_Orden_Compra_Nacional: [null],
      Fecha_Entrega_Probable: ['', Validators.required],
      Identificacion_Funcionario: [this.user],
      Id_Bodega_Nuevo: ['', Validators.required],
      Id_Proveedor: [null, Validators.required],
      Tipo: ['Recurrente'],
      Observaciones: [''],
      Subtotal: [0],
      Iva: [0],
      Total: [0],
      format_code: [''],
      Productos: this.fb.array([], [Validators.required]),
    });
  }

  get products(): FormArray {
    return this.formCompra.get('Productos') as FormArray;
  }

  validateProducts() {
    if (this.products.controls.length > 0) {
      this._swal.show({
        icon: 'warning',
        title: 'Productos en lista',
        text: 'Ya has agregado productos a la lista, si cambias este valor se vaciará la lista de productos.'
      }).then(r => {
        if (r.isConfirmed) {
          this.products.clear();
        }
      })
    }
  }

  getProducts(value) {
    let params = {
      subcategoria: value,
    };
    this._producto.getProductos(params).subscribe((res: any) => {
      this.Productos = res.data
    });
  }

  GuardarCompra() {
    if (this.formCompra.valid) {
      this._swal
        .show({
          title: '¿Estás seguro(a)?',
          text: 'Vamos a guardar una nueva orden de compra.',
          icon: 'question',
          showCancel: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this._compra.save(this.formCompra.value).subscribe(
              (res: any) => {
                this._swal.show({
                  title: 'Creación de orden de compras',
                  text: res.data,
                  icon: 'success',
                  timer: 1000,
                  showCancel: false,
                });
                this.formCompra.reset();
                this.router.navigate(['/compras/compra-nacional']);
              },
              (error) => {
                this._swal.hardError();
              }
            );
          }
        });
    } else {
      this._swal.incompleteError();
    }
  }

  deleteProduct(posicion?, event?) {
    if (posicion && event) {
      if (event.screenX != 0) {
        this.products.removeAt(posicion);
      }
    } else {
      this.products.clear();
    }
    this.updateTotals();
  }
}



//!Las funciones que siguen no se están usando en este momento dado que son funciones que se ejecutan cuando el componente recibe parametros, funcionalidad que aún no está disponible

//**esto va en el guardar
/**
 * let params = this.route.snapshot.queryParams;
 * if (params.Pre_Compra) {
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
             if (this.id && this.precompra) {
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
 */

/*
public listaProductos: any[] = [];
public listaProductosPorAgregar: any = [];
public precompra = JSON.parse(localStorage.getItem('Compra'));
public Id_Proveedor: any = '';
public Rotativo = false;
public NombreProveedor: string = '';
public Tipo: any = '';
pushCompra() {
  if (this.id && this.precompra) {
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
    this.updateTotals();
  }
}

getRotativosCompra(params) {
  if (params.Pre_Compra) {
    this.http
      .get(
        environment.base_url +
        '/php/rotativoscompras/detalle_pre_compra/' +
        params.Pre_Compra
      )
      .subscribe((res: any) => {
        this.listaProductosPorAgregar = res.data.Productos;
        this.products.push(this.fb.group(res.data.Productos));
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
        this.updateTotals();
        this.Tipo = 'Recurrente';
      });
  }
}
*/
