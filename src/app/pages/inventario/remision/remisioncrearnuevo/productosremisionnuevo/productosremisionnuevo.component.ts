import { Component, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges, Input, Output, ViewChild } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import swal, { SweetAlertOptions } from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { RemisionModelNuevo } from '../../RemisonModelNuevo';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProductoCargarRemision } from '../../ProductoCargarRemision';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ProductoService } from '../../../services/producto.service';
import { RemisionService } from '../../../services/remision.service';
import { RemisionnuevoService } from '../../../services/remisionnuevo.service';
import { EpsService } from '../../../services/eps.service';
import { functionsUtils } from '../../../../../core/utils/functionsUtils';
import { GeneralService } from '../../../services/general.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { WarningMessage } from '../../../../../core/utils/confirmMessage';


@Component({
  selector: 'app-productosremisionnuevo',
  templateUrl: './productosremisionnuevo.component.html',
  styleUrls: ['./productosremisionnuevo.component.scss']
})
export class ProductosremisionnuevoComponent implements OnInit, OnChanges, OnDestroy {

  //OBSERVABLES
  public AbrirModalProductos: Subject<any> = new Subject();
  public AbrirModalProductoCambiar: Subject<any> = new Subject();
  @Input() public ActualizarModelo: Observable<any> = new Observable();
  @Input() public RecibirPendientes: Observable<any> = new Observable();
  public suscripcionCambioModelo: any;
  public suscripcionRecibirPendiente: any;

  //PRIVATE VARIABLES
  @Input() public _remisionModel: RemisionModelNuevo;
  private _listaAgregados: Array<any> = [];
  private Codigo_Borrador = '';
  @Output() public CargarBorrador: EventEmitter<any> = new EventEmitter();
  private _idsCambios: Array<string> = [];

  //PUBLIC VARIABLES
  //COMUNICACION DE COMPONENTES
  @Output() public ActualizarValoresEncabezado: EventEmitter<any> = new EventEmitter();
  @ViewChild('confirmacionGuardar') public confirmacionGuardar: SwalComponent;
  @ViewChild('confirmacionRetornar') public confirmacionRetornar: SwalComponent;
  @ViewChild('confirmacionSalir') confirmacionSalir: any;
  @ViewChild('errorBorrador') errorBorrador: any;

  //LISTAS
  public Lista_Productos: Array<ProductoCargarRemision> = [];
  public Impuestos: Array<any> = [];
  public Entidades_Salud: Array<any> = [];

  //VARIABLES DE CONTROL
  public Display_Interna: boolean = true;
  public Display_Cliente: boolean = false;
  public Display_Rotacion: boolean = false;
  public DeshabilitarBoton: boolean = false;
  public Cargando: boolean = false;
  public Codigo_Barras: any = '';

  //ACUMULADORES
  public reducer_subtotal = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer_desc = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Total_Descuento);
  public reducer_imp = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Total_Impuesto);

  //VARIABLES DE DATOS
  public alertOption: SweetAlertOptions = {
    title: "¿Está Seguro?",
    text: "Se dispone a Guardar esta Remisión",
    showCancelButton: true,
    cancelButtonText: "No, Dejame Comprobar!",
    confirmButtonText: 'Si, Guardar',
    showLoaderOnConfirm: true,
    focusCancel: true,
    // type: 'info',
    preConfirm: () => {
      return new Promise((resolve) => {
        this.GuardarRemision();
      })
    },
    allowOutsideClick: () => !swal.isLoading()
  };

  public alertOptionRetorno: SweetAlertOptions = {
    title: "Registro Exitoso",
    text: "Remisión guardada exitosamente",
    confirmButtonText: 'Aceptar',
    showLoaderOnConfirm: true,
    focusCancel: true,
    // type: 'info',
    preConfirm: () => {
      return new Promise((resolve) => {
        this._router.navigate(['/remisionesnuevo']);
      })
    },
    allowOutsideClick: () => !swal.isLoading()
  };
  public alertOptionBorrador: SweetAlertOptions = {
    title: "Error Borrador",
    text: "El Borrador Seleccionado contiene errores Comuníquese con el Dpto. de sistemas",
    confirmButtonText: 'Aceptar',
    showLoaderOnConfirm: true,
    focusCancel: true,
    // type: 'error',
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        this._router.navigate(['/remisionesnuevo']);
      })
    },
  };

  public RotativoModel: any = {
    Fecha_Inicio: '',
    Fecha_Fin: '',
    Id_Eps: '',
    Id_Origen: 0,
    Grupo: {
      Id_Grupo: 0,
      Nombre_Grupo: '',
      Fecha_Vencimiento: '',
      Presentacion: ''
    },
    Id_Destino: 0,
    Meses: ''
  };

  public Tipo_Remision: string = 'Interna';
  public Subtotal_Remision: number = 0;
  public Impuesto_Remision: number = 0;
  public Descuento_Remision: number = 0;
  public Costo_Remision: number = 0;
  public DinamycCols: number = 9;

  public Mensaje: number = 0;
  public ItemsRemision: number = 0;
  public Id_Borrador: string = '';

  private Fecha = new Date();
  private fecha_mes_anterior = new Date(new Date().setDate(this.Fecha.getDate() - 30));
  ListaProductos: ProductoCargarRemision[];
  ProductosAgregar: any = [];

  constructor(
    private _servicesInventario: GeneralService,
    private _swalService: SwalService,
    // private _toastService:ToastService,
    private _productoService: ProductoService,
    private _remisionService: RemisionService,
    private _remisionNuevoService: RemisionnuevoService,
    // private _generadorService:FuncionesgeneralesService,
    private http: HttpClient,
    private _epsService: EpsService,
    private _router: Router,
    private _activeRoute: ActivatedRoute) {
    this.RotativoModel.Fecha_Inicio = this.fecha_mes_anterior.toISOString().split("T")[0];
    this.RotativoModel.Fecha_Fin = this.Fecha.toISOString().split("T")[0];

    this.http.get(environment.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Configuracion', id: '1' }
    }).subscribe((data: any) => {
      this.ItemsRemision = parseInt(data.Max_Item_Remision);
    });

    this.GetImpuestos();
    this._getEntidadesSalud();

    if (this._activeRoute.snapshot.queryParams.borrador) {
      this.Codigo_Borrador = this._activeRoute.snapshot.queryParams.borrador;
      setTimeout(() => {
        this.RecuperarBorrador();
      }, 200);
    } else {
      this.Codigo_Borrador = functionsUtils.HexadecimalAleatorio();
    }


  }

  ngOnInit() {
    this.suscripcionCambioModelo = this.ActualizarModelo.subscribe((data: any) => {

      this._remisionModel = data.modelo;
      this.Tipo_Remision = data.modelo.Tipo;
      if (this._remisionModel.Tipo == 'Interna' && data.actualizar_productos) {

        this.DinamycCols = 9;
        this.Display_Rotacion = false;

        if (this._remisionModel.Modelo == 'Bodega-Punto') {
          this.Display_Interna = true;
          this.Display_Cliente = false;
        }

        if (!isNaN(parseInt(data.modelo.Id_Origen))) {
          this.RotativoModel.Id_Origen = parseInt(data.modelo.Id_Origen);
        } else {
          this.RotativoModel.Id_Origen = 0;
        }
        console.log('modelo', data.modelo);

        if (data.modelo.Grupo.Id_Grupo != 0) {


          this.RotativoModel.Grupo = data.modelo.Grupo;

        } else {
          this.RotativoModel.Grupo.Id_Grupo = 0;
          this.RotativoModel.Grupo.Nombre_Grupo = '';
          this.RotativoModel.Grupo.Fecha_Vencimiento = '';
          this.RotativoModel.Grupo.Presentacion = '';
        }



        if (!isNaN(parseInt(data.modelo.Id_Destino))) {
          this.RotativoModel.Id_Destino = parseInt(data.modelo.Id_Destino);
        } else {
          this.RotativoModel.Id_Destino = 0;
        }

        if (!isNaN(parseInt(data.modelo.Meses))) {
          this.RotativoModel.Meses = data.modelo.Meses;
        }

        this.EliminarLotesMasivos();

        this.GuardarBorrador(false);
        //this._limpiarModelos();
      } else if (this._remisionModel.Tipo == 'Cliente') {
        this.DinamycCols = 12
        this.Display_Rotacion = false;
        this.Display_Interna = false;
        this.Display_Cliente = true;
        this.ClearRotativoModel();
        if (data.actualizar_productos) {
          this.EliminarLotesMasivos();
        }
        //this._limpiarModelos();
      }

      else if (this._remisionModel.Tipo == 'Contrato') {
        this.DinamycCols = 12
        this.Display_Rotacion = false;
        this.Display_Interna = false;
        this.Display_Cliente = true;
        this.ClearRotativoModel();
        if (data.actualizar_productos) {
          this.EliminarLotesMasivos();
        }
        //this._limpiarModelos();
      }

      if (this._remisionModel.Id_Destino != 0 && this._remisionModel.Id_Origen != 0) {
        if (data.actualizar_productos) {
        }
      }

      setTimeout(() => {
        this.Cargando = false;
        this.CalcularSubtotalProductosLista();
      }, 200);
    });

  }

  ngOnDestroy(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  //PRIVATE METHODS
  private _limpiarModelos(tipo: boolean = true) {
    this.Lista_Productos = [];
    this._listaAgregados = [];
    //this._remisionModel = null;
    if (tipo) {

      setTimeout(() => {
        this.GuardarBorrador();
      }, 100);
    }

  }

  private GetImpuestos() {
    this.http.get(environment.ruta + 'php/lista_generales.php', { params: { modulo: 'Impuesto' } }).subscribe((data: any) => {
      this.Impuestos = data;
    });
  }

  private AgregarProductosExistentes(idProducto: number) {
    this._listaAgregados.push(idProducto);
  }

  private _getEntidadesSalud() {

    this.http.get(environment.ruta + 'php/GENERALES/eps/get_entidades_salud_select.php').subscribe((data: any) => {
      //this.Entidades_Salud.push({value:'', label:'Todas'});
      if (data.codigo == 'success') {
        // if (data.query_result.length > 0) {
        //   data.query_result.forEach(eps => {
        //     this.Entidades_Salud.push(eps);
        //   });
        // }
        this.Entidades_Salud = data.query_result;
        this.Entidades_Salud.unshift({ value: '', label: 'Todas' });
      } else {
        this.Entidades_Salud = [];
      }
    });
  }

  private ValidarModelo() {
    if (this._remisionModel.Id_Origen == 0) {
      WarningMessage('error', 'Falta Origen', 'Debe seleccionar el origen de la remision!');
      return false;
    } else if (this._remisionModel.Id_Destino == 0) {
      if (this._remisionModel.Tipo == 'Cliente') {
        WarningMessage('error', 'Falta Destino', 'Debe seleccionar el destino de la remision!');
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  private Listar_Pendientes() {
    if (this._remisionModel.Modelo == 'Bodega-Punto') {
      if (this._remisionModel.Id_Destino != 0 && this._remisionModel.Id_Origen != 0 && this._remisionModel.Grupo.Id_Grupo != 0) {
        let params = this.AsignarParametros();

        this.http.get(environment.ruta + 'php/remision_nuevo/get_pendientes.php', { params: params }).subscribe((data: any) => {
          if (data.length > 0) {
            this.AbrirModalAgregarProductos(data);
          }
        });
      }
    }
  }

  private AsignarParametros() {
    let params: any = {};
    params.id_destino = this._remisionModel.Id_Destino;
    params.id_grupo = this._remisionModel.Grupo.Id_Grupo;
    params.id_origen = this._remisionModel.Id_Origen;
    params.mes = this._remisionModel.Meses;

    return params;
  }

  private GuardarLotesSeleccionados(lote: any): void {
    let data = new FormData();
    data.append("datos", JSON.stringify(lote));
    this.http.post(environment.ruta + 'php/remision_nuevo/seleccionar_lotes_inventario.php', data).subscribe((data: any) => {
    });
  }

  private GuardarBorrador(guardar: boolean = true) {
    let data = new FormData();
    this.setDescripcion();
    let model = this._remisionModel;
    let lista_productos = this.Lista_Productos;

    if (guardar) {

      let modelo_productos: any = { Modelo: model, Productos: lista_productos };
      data.append("datos", functionsUtils.normalize(JSON.stringify(modelo_productos)));
      data.append("codigo", this.Codigo_Borrador);
      data.append("funcionario", String(environment.id_funcionario));
      data.append("destino", this._remisionModel.Nombre_Destino);

      return this.http.post(environment.ruta + 'php/remision_nuevo/guardar_borrador.php', data).subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.Mensaje++;
          if (this.Mensaje % 10 == 0) {
            this._swalService.show({ icon: data.codigo, title: data.titulo, text: data.mensaje });
          }
        } else {
          this._swalService.show({ icon: 'error', title: 'Error', text: 'El borrador no se ha podido guardar, por favor comuniquese con el encargado del sistema!' });
        }
      });
    }

  }

  private setDescripcion() {
    //elimina todos las comillas  para no dañar json
    this._remisionModel.Observaciones = this._remisionModel.Observaciones.replace(/['"]+/g, '');

    // preserve newlines, etc - use valid JSON
    this._remisionModel.Observaciones = this._remisionModel.Observaciones.replace(/\\n/g, "\\n")
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    this._remisionModel.Observaciones = this._remisionModel.Observaciones.replace(/[\u0000-\u0019]+/g, "");


  }

  private SetFiltrosRotativo() {
    let params: any = {};

    if (this.RotativoModel.Id_Destino != 0) {
      params.id_destino = this.RotativoModel.Id_Destino;
    }

    if (this.RotativoModel.Grupo.Id_Grupo != 0) {
      params.grupo = JSON.stringify(this.RotativoModel.Grupo);
    }

    if (this.RotativoModel.Id_Origen != 0) {
      params.id_origen = this.RotativoModel.Id_Origen;
    }

    if (this.RotativoModel.Fecha_Inicio != 0) {
      params.fini = this.RotativoModel.Fecha_Inicio;
    }

    if (this.RotativoModel.Fecha_Fin != 0) {
      params.ffin = this.RotativoModel.Fecha_Fin;
    }

    if (this.RotativoModel.Id_Eps != '') {
      params.eps = this.RotativoModel.Id_Eps;
    }

    if (this.RotativoModel.Meses != '') {
      params.mes = this.RotativoModel.Meses;
    }


    return params;
  }

  private ValidateConsultaRotativo(): boolean {
    if (this.RotativoModel.Fecha_Inicio == '') {
      WarningMessage('warning', 'Alerta', 'Escoja la fecha de inicio!');
      return false;
    } else if (this.RotativoModel.Fecha_Fin == '') {
      WarningMessage('warning', 'Alerta', 'Escoja la fecha de fin!');
      return false;
    } else if (this.RotativoModel.Id_Origen == 0) {
      WarningMessage('warning', 'Alerta', 'Escoja el origen!');
      return false;
    } else if (this.RotativoModel.Id_Destino == '') {
      WarningMessage('warning', 'Alerta', 'Escoja el destino!');
      return false;
    } else if (this.RotativoModel.Grupo.Id_Grupo == 0) {

      WarningMessage('warning', 'Alerta', 'Escoja el grupo de origen!');
      return false;
    } else {
      return true;
    }
  }

  private ClearRotativoModel() {
    this.RotativoModel = {
      Fecha_Inicio: this.Fecha,
      Fecha_Fin: this.fecha_mes_anterior,
      Id_Eps: '',
      Id_Origen: 0,
      Id_Destino: 0
    };
  }

  private SetearProducto(productos: any[]) {

    let productos_formateados: Array<ProductoCargarRemision> = [];

    productos.forEach(p => {
      let product = new ProductoCargarRemision();
      this._listaAgregados.push(p.Id_Producto);

      for (var key in p) {

        if (key != 'Codigo_Cum' && key != 'Seleccionado' && key != 'Cantidad_Requerida') {
          // if (key == 'Lotes') {
          //   product[key] = this.SetearLotes(producto[key]);
          // }else{
          if (key == 'Rotativo') {
            product[key] = p[key];
          } else if (!isNaN(parseInt(p[key]))) {
            product[key] = parseInt(p[key]);
          } else {
            product[key] = p[key];
          }
          //}

        } else {
          // TODO product key error
          // product[key] = p[key];
        }
      }

      productos_formateados.push(product);
    });


    return productos_formateados;

  }

  private SetearProductoIndividual(producto: any) {

    let product = new ProductoCargarRemision();

    for (var key in producto) {

      if (key != 'Codigo_Cum' && key != 'Seleccionado' && key != 'Cantidad_Requerida') {
        // if (key == 'Lotes') {
        //   product[key] = this.SetearLotes(producto[key]);
        // }else{
        if (!isNaN(parseInt(producto[key]))) {
          product[key] = parseInt(producto[key]);
        } else {
          product[key] = producto[key];
        }
        //}


      } else {
        // TODO product key error
        // product[key] = producto[key];
      }
    }

    return product;
  }

  private EliminarLotesMasivos() {
    if (this.Lista_Productos.length > 0) {
      let data = new FormData();
      data.append("datos", functionsUtils.normalize(JSON.stringify(this.Lista_Productos)));
      this.http.post(environment.ruta + 'php/remision/get_productos_inventario.php', data).subscribe((data: any) => {
        if (data.codigo == 'success') {
          this._limpiarModelos();
        }
      });
    }

  }

  //PUBLIC METHODS
  public AgregarProducto(producto: ProductoCargarRemision) {
    if (producto != null) {
      this.Lista_Productos.push(producto);
      this.AgregarProductosExistentes(producto.Id_Producto);
    } else {
      WarningMessage('warning', 'Alerta', 'Ocurrió un error con el producto, contacte con el administrador!');

    }
  }

  public GenerarRotativo(tipo: string) {

  }

  public AbrirModalAgregarProductos(pendientes: Array<any> = []) {
    if (!this.ValidarModelo()) {
      return;
    } else {
      let data = { agregados: this._listaAgregados, inventarios: [], pendientes: pendientes, remision_model: this._remisionModel, tipo: 'Remision' };
      this.AbrirModalProductos.next(data);
    }
  }

  public VerificarPrecioRegulacion(posProducto: string): void {
    let regulado = this.Lista_Productos[posProducto].Regulado;
    let precio = this.Lista_Productos[posProducto].Precio;
    let costo = this.Lista_Productos[posProducto].Costo;
    let precio_regulado = this.Lista_Productos[posProducto].Precio_Regulado;

    if (regulado == 'Si' && precio > precio_regulado) {
      this.Lista_Productos[posProducto].Precio = this.Lista_Productos[posProducto].Precio_Regulado;
    }

    if (precio < costo) {
      WarningMessage('warning', 'Alerta', 'El precio no puede ser inferior al costo del producto!');
      this.Lista_Productos[posProducto].Precio = this.Lista_Productos[posProducto].Costo;
    }

    this.CalcularSubtotalProducto(posProducto);
  }

  public CalcularSubtotalProducto(posProducto: string) {
    let cantidad = this.Lista_Productos[posProducto].Cantidad == null ? 0 : this.Lista_Productos[posProducto].Cantidad;
    let precio = this.Lista_Productos[posProducto].Precio;
    let descuento = this.Lista_Productos[posProducto].Descuento;
    let iva = this.Lista_Productos[posProducto].Impuesto;
    let total_descuento = (cantidad * precio) * (descuento / 100);
    let total_impuesto = (cantidad * precio) * (iva / 100);
    let subtotal = (cantidad * precio);

    this.Lista_Productos[posProducto].Subtotal = subtotal;
    this.Lista_Productos[posProducto].Total_Descuento = total_descuento;
    this.Lista_Productos[posProducto].Total_Impuesto = total_impuesto;


    this.ActualizaValores();
  }

  public ActualizaValores() {
    this._remisionModel.Subtotal_Remision = parseFloat(this.Lista_Productos.reduce(this.reducer_subtotal, 0));
    this._remisionModel.Impuesto_Remision = parseFloat(this.Lista_Productos.reduce(this.reducer_imp, 0));
    this._remisionModel.Descuento_Remision = parseFloat(this.Lista_Productos.reduce(this.reducer_desc, 0));
    this._remisionModel.Costo_Remision = this._remisionModel.Subtotal_Remision - this._remisionModel.Descuento_Remision + this._remisionModel.Impuesto_Remision;

    setTimeout(() => {
      this.GuardarBorrador();
    }, 100);

  }

  public EliminarProducto(posProducto: number): void {


    //ELIMINAR LOTES SELECCIONADOS
    this.EliminarLotesSeleccionados(this.Lista_Productos[posProducto].Lotes_Seleccionados);
    this.EliminarSeleccionados(this.Lista_Productos[posProducto].Id_Producto);
    this.Lista_Productos.splice(posProducto, 1);
    setTimeout(() => {
      this.CalcularSubtotalProductosLista();
      this.ActualizarValoresEncabezado.emit(this.Lista_Productos);
    }, 200);
    this.GuardarBorrador();
  }

  private EliminarSeleccionados(idProducto: number) {
    let ind = this._listaAgregados.findIndex(x => x == idProducto);

    if (ind > -1) {
      this._listaAgregados.splice(ind, 1);
    }
  }

  public GetRotativo(tipo: string) {

    this.EliminarLotesMasivos();
    //id_destino, id_origen, ffini, ffin, eps
    if (!this.ValidateConsultaRotativo()) {
      return;
    } else {
      this.Cargando = true;
      let params = this.SetFiltrosRotativo();
      if (tipo == 'Pos') {


        this.Display_Rotacion = true;
        this.DinamycCols = 10;
        this.http.post(environment.ruta + 'php/remision_nuevo/get_rotativo.php', { params: params }).subscribe((data: any) => {
          if (data.length > 0) {
            this.Lista_Productos = [];
            this.Lista_Productos = this.SetearProducto(data);
            this.DeshabilitarBoton = true;
            this.Cargando = false;
            setTimeout(() => {
              this.ActualizarValoresEncabezado.emit(this.Lista_Productos);
            }, 200);
            this.GuardarBorrador();
          } else {
            this.Lista_Productos = [];
            this.Cargando = false;
          }
        });
      } else {
        this.Display_Rotacion = false;
        this.DinamycCols = 9;

        this.http.post(environment.ruta + 'php/remision_nuevo/get_rotativo_no_pos.php', { params: params }).subscribe((data: any) => {
          if (data.length > 0) {
            this.Lista_Productos = [];
            this.Lista_Productos = this.SetearProducto(data);
            this.DeshabilitarBoton = true;
            this.Cargando = false;
            setTimeout(() => {
              this.ActualizarValoresEncabezado.emit(this.Lista_Productos);
            }, 200);


            this.GuardarBorrador();

          } else {

            this.Lista_Productos = [];
            this.Cargando = false;

          }
        });
      }

    }
  }

  public VerSimilares(posProducto: string) {
    this.Lista_Productos[posProducto].Similares.forEach((similar, i) => {
      if (similar.Seleccionado == '1') {
        this.Lista_Productos[posProducto].Similares[i].Seleccionado = '0';
      }
    });

    let producto = this.Lista_Productos[posProducto];
    let params = {
      producto: producto, pos: posProducto,
      rotativo_model: this.RotativoModel,
      grupo: this._remisionModel.Grupo,
      mes: this._remisionModel.Meses
    };
    this.AbrirModalProductoCambiar.next(params);
  }

  public RealizarCambioProducto(datos: any) {

    //posicion del producto si existe en la lista principal
    let existe = this.VerificarExistenciaProducto(datos.producto.Id_Producto);


    if (existe > -1) {

      let size = this.Lista_Productos[existe]['Lotes_Seleccionados'].length;

      /*   for (let existente = 0; existente < size ; existente++) {
          console.log(this.Lista_Productos[existe]['Lotes_Seleccionados'],'existente');

          let encontrado = false;
          for (let nuevo = 0; nuevo < datos.producto['Lotes_Seleccionados'].length ; nuevo++) {
          console.log( datos.producto['Lotes_Seleccionados'][nuevo],'nuevo');

            if ( this.Lista_Productos[existe]['Lotes_Seleccionados']['Id_Inventario'] ==
                  datos.producto['Lotes_Seleccionados'][nuevo]['Id_Inventario']) {

                    this.Lista_Productos[existe]['Lotes_Seleccionados'][existente]['Cantidad_Seleccionada']  +=
                    parseInt(datos.producto['Lotes_Seleccionados'][nuevo]['Cantidad_Seleccionada']);
                    encontrado = true;

                }

            }

            if (!encontrado) {
              this.Lista_Productos[existe]['Lotes_Seleccionados'].push(datos.producto['Lotes_Seleccionados']);
            }
          }
   */
      for (let nuevo = 0; nuevo < datos.producto['Lotes_Seleccionados'].length; nuevo++) {


        let encontrado = false;
        for (let existente = 0; existente < size; existente++) {

          if (this.Lista_Productos[existe]['Lotes_Seleccionados'][existente]['Id_Inventario_Nuevo'] ==
            datos.producto['Lotes_Seleccionados'][nuevo]['Id_Inventario_Nuevo']) {

            this.Lista_Productos[existe]['Lotes_Seleccionados'][existente]['Cantidad_Seleccionada'] +=
              parseInt(datos.producto['Lotes_Seleccionados'][nuevo]['Cantidad_Seleccionada']);

            this.Lista_Productos[existe]['Cantidad'] +=
              parseInt(datos.producto['Cantidad']);
            encontrado = true;

          }

        }

        if (!encontrado) {
          this.Lista_Productos[existe]['Lotes_Seleccionados'].push(datos.producto['Lotes_Seleccionados'][nuevo]);
        }
      }

      console.log(datos.producto['Lotes_Visuales'], 'lv n');
      console.log(this.Lista_Productos[existe]['Lotes_Seleccionados'], 'lv viejo');

      this.Lista_Productos[existe]['Lotes_Visuales'] = [];
      for (let lote = 0; lote < this.Lista_Productos[existe]['Lotes_Seleccionados'].length; lote++) {
        let loteVisual = 'Lote :' + this.Lista_Productos[existe]['Lotes_Seleccionados'][lote]['Lote'] +
          ' - Vencimiento:  ' + this.Lista_Productos[existe]['Lotes_Seleccionados'][lote]['Fecha_Vencimiento'] +
          ' - Cantidad: ' + this.Lista_Productos[existe]['Lotes_Seleccionados'][lote]['Cantidad'];

        this.Lista_Productos[existe]['Lotes_Visuales'][lote] = loteVisual;

      }


      this.Lista_Productos[existe].Cantidad_Requerida = this.Lista_Productos[existe].Cantidad_Requerida + parseInt(datos.producto.Cantidad_Requerida);
      console.log(this.Lista_Productos[existe]);


      /*       this.Lista_Productos[existe].Cantidad = this.Lista_Productos[existe].Cantidad_Requerida + parseInt(datos.producto.Cantidad_Requerida);
      this.SeleccionarLotes(existe.toString());   */
      this.Lista_Productos.splice(datos.pos, 1);
    } else {

      this.Lista_Productos[datos.pos] = this.SetearProductoIndividual(datos.producto);
      /*    this.SeleccionarLotes(datos.pos);    */
      this._idsCambios.push(datos.id_cambio);
    }
  }

  private VerificarExistenciaProducto(idProducto: number) {
    let exist = this.Lista_Productos.findIndex(x => x.Id_Producto == idProducto);
    return exist;
  }

  public RecuperarBorrador() {
    this.http.get(environment.ruta + 'php/remision_nuevo/get_borrador.php', { params: { codigo: this.Codigo_Borrador } }).subscribe((data: any) => {
      let txtBorrador = data.Texto;
      // preserve newlines, etc - use valid JSON
      txtBorrador = txtBorrador.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
      // remove non-printable and other non-valid JSON chars
      txtBorrador = txtBorrador.replace(/[\u0000-\u0019]+/g, "");


      let modelo = this.validarJson(txtBorrador);
      if (modelo) {


        console.log(modelo);


        this.Tipo_Remision = modelo.Modelo.Tipo;
        this._remisionModel = modelo.Modelo;
        /*  this._remisionModel.setGrupo(x); */

        this.RotativoModel.Id_Origen = modelo.Modelo.Id_Origen;
        this.RotativoModel.Id_Destino = modelo.Modelo.Id_Destino;


        if (this._remisionModel.Tipo == 'Interna') {
          this.Display_Interna = true;
          this.Display_Cliente = false;
          if (this._remisionModel.Modelo == 'Bodega-Punto') {
            this.Display_Rotacion = true;
          } else {
            this.Display_Rotacion = false;
          }
        } else {
          this.Display_Interna = false;
          this.Display_Cliente = true;
        }

        this.Lista_Productos = [];
        this.Lista_Productos = this.SetearProducto(modelo.Productos);
        setTimeout(() => {
          this.CalcularSubtotalProductosLista();
        }, 500);
        //this.Lista_Productos=modelo.Productos;
        this.CargarBorrador.emit(this._remisionModel);

      } else {

        this.errorBorrador.show();
      }


    });
  }

  public AsignarEps() {

  }
  public validarJson(str: string) {
    let conversion: any = {};
    try {
      conversion = JSON.parse(str);
    } catch (error) {
      console.error('Ah ocurrido un error con el JSON', error);
      return false
    }
    return conversion;
  }

  private GuardarRemision() {
    if (!this.ValidateRemision()) {
      return;
    } else {

      let data = new FormData();
      data.append("datos", functionsUtils.normalize(JSON.stringify(this._remisionModel)));
      data.append("grupo", functionsUtils.normalize(JSON.stringify(this._remisionModel.Grupo)));
      data.append("productos", functionsUtils.normalize(JSON.stringify(this.Lista_Productos)));
      data.append("codigo", this.Codigo_Borrador);
      data.append("rotativo", functionsUtils.normalize(JSON.stringify(this.RotativoModel)));

      if (this._remisionModel.Modelo == 'Bodega-Bodega' && this._remisionModel.Id_Origen == 8) {
        this.http.post(environment.ruta + 'php/remision_nuevo/save_remision_devolucion.php', data).subscribe((data: any) => {
          if (data.codigo == 'success') {
            this._limpiarModelos(false);
            this.confirmacionSalir.title = 'Remisión Guardada';
            this.confirmacionSalir.html = data.mensaje;
            this.confirmacionSalir.type = 'success';
            this.confirmacionSalir.fire();
            console.log('b-b');
          } else {
            console.log('else');
            WarningMessage(data);
            this.confirmacionGuardar.close;
          }
        });
      } else {
        console.log('else-2');
        this.http.post(environment.ruta + 'php/remision_nuevo/save_remision.php', data).subscribe((data: any) => {
          if (data.codigo == 'success') {
            this._limpiarModelos(false);
            this.confirmacionSalir.title = 'Remisión Guardada';
            this.confirmacionSalir.html = data.mensaje;
            this.confirmacionSalir.type = 'success';
            this.confirmacionSalir.fire();
            this._router.navigate(['/inventario/remisiones'])

          } else {
            console.log('else-else-2');
            WarningMessage(data);
            this.confirmacionGuardar.close;
          }
        });
      }
    }
  }

  private ValidateRemision() {
    if (this._remisionModel.Id_Origen == 0) {
      WarningMessage('warning', 'Alerta', 'Escoja el origen!');
      return false;
    } else if (this._remisionModel.Id_Destino == 0) {
      WarningMessage('warning', 'Alerta', 'Escoja el destino!');
      return false;
    } else if (this._remisionModel.Observaciones.trim() == '') {
      WarningMessage('warning', 'Alerta', 'Escriba unas observaciones sobre la remision!');
      return false;
    } else if (!this.ValidateProductosRemision()) {
      return false;
    } else {
      return true;
    }
  }

  private ValidateProductosRemision() {
    for (let index = 0; index < this.Lista_Productos.length; index++) {
      if (this._remisionModel.Tipo == 'Interna') {
        if (this.Display_Rotacion) {
          if ((this.Lista_Productos[index].Cantidad == 0 || this.Lista_Productos[index].Cantidad == undefined) && this.Lista_Productos[index].Similares.length > 0) {
            WarningMessage('warning', 'Alerta', 'Cambie el producto ' + this.Lista_Productos[index].Nombre_Comercial + ' por uno de sus asociados o elimine el producto de la lista!');
            return false;
          } else if (this.Lista_Productos[index].Cantidad_Requerida == 0 || this.Lista_Productos[index].Cantidad_Requerida == undefined) {
            WarningMessage('warning', 'Alerta', 'La cantidad del producto ' + this.Lista_Productos[index].Nombre_Comercial + ' no puede ser cero(0)!');
            return false;
          }
        } else if (this.Lista_Productos[index].Cantidad_Requerida == 0 || this.Lista_Productos[index].Cantidad_Requerida == undefined) {
          WarningMessage('warning', 'Alerta', 'La cantidad del producto ' + this.Lista_Productos[index].Nombre_Comercial + ' no puede ser cero(0)!');
          return false;
        }
      } else {
        if (this.Lista_Productos[index].Cantidad == 0 || this.Lista_Productos[index].Cantidad == undefined) {
          WarningMessage('warning', 'Alerta', 'La cantidad del producto ' + this.Lista_Productos[index].Nombre_Comercial + ' no puede ser cero(0)!');
          return false;
        }
      }

      if (index == (this.Lista_Productos.length - 1)) {
        return true;
      }
    }
  }

  private CalcularSubtotalProductosLista() {

    if (this.Lista_Productos.length > 0) {
      this.Lista_Productos.forEach((p, i) => {
        this.CalcularSubtotalProducto(i.toString());
      });
    } else {
      this._remisionModel.Subtotal_Remision = 0;
      this._remisionModel.Impuesto_Remision = 0;
      this._remisionModel.Descuento_Remision = 0;
      this._remisionModel.Costo_Remision = 0;
    }
  }

  VerPantallaLista() {
    this._router.navigate(['/remisionesnuevo']);
  }

  public RecibirProductos(listaProductos: Array<any>) {

    listaProductos.forEach((p: ProductoCargarRemision, i) => {

      p.Precio = (+p.Precio).toFixed(2);

      if (p.Cantidad_Pendiente != 0) {
        p.Cantidad_Requerida = p.Cantidad_Pendiente;
      }
      this.Lista_Productos.push(p);
      this._listaAgregados.push(p.Id_Producto);

      this.SeleccionarLotes((this.Lista_Productos.length - 1).toString());

    });

    setTimeout(() => {
      this.Cargando = false;
      this.ActualizarValoresEncabezado.emit(this.Lista_Productos);
    }, 300);
  }

  //METODOS LOTES
  public SeleccionarLotes(posProducto: string) {

    if ((this.Lista_Productos[posProducto].Cantidad_Requerida > 0
      && this._remisionModel.Tipo == 'Interna')
      || (this.Lista_Productos[posProducto].Cantidad > 0
        && this._remisionModel.Tipo == 'Cliente')
      || (this.Lista_Productos[posProducto].Cantidad > 0
        && this._remisionModel.Tipo == 'Contrato')) {
      let cantidad = 0;
      let multiplo = 0;
      this.Lista_Productos[posProducto].Lotes_Visuales = [];

      if (this._remisionModel.Tipo == 'Interna') {
        cantidad = this.Lista_Productos[posProducto].Cantidad_Requerida;
        this.Lista_Productos[posProducto].Cantidad = 0;

      } else {
        cantidad = this.Lista_Productos[posProducto].Cantidad;
      }
      if (this._remisionModel.Grupo.Presentacion == 'Si' &&
        this._remisionModel.Modelo !== 'Punto-Punto' &&
        this._remisionModel.Modelo !== 'Punto-Bodega') {

        multiplo = cantidad % this.Lista_Productos[posProducto].Cantidad_Presentacion;
        var cantidad_presentacion = true;

      } else {
        var cantidad_presentacion = false;
      }

      this.Lista_Productos[posProducto].Cantidad = 0;
      this.Lista_Productos[posProducto].Lotes_Seleccionados = [];

      if (multiplo == 0 && cantidad > 0) {

        let flag = true;
        for (let i = 0; i < this.Lista_Productos[posProducto].Lotes.length; i++) {
          let cant_disp = this.Lista_Productos[posProducto].Lotes[i].Cantidad_Disponible;

          if (flag && cantidad <= parseInt(this.Lista_Productos[posProducto].Lotes[i].Cantidad)) {

            //SE CREA UNA VARIABLE PARA LLENAR y ALMACENAR LOS DATOS DE LOS LOTES QUE SE VAYAN SELECCIONANDO DE ACUERDO A LA CANTIDAD DIGITADA
            let lote_temp: any = JSON.parse(JSON.stringify(this.Lista_Productos[posProducto].Lotes[i]));
            lote_temp.Cantidad = cantidad;
            this.GuardarLotesSeleccionados(lote_temp);

            this.Lista_Productos[posProducto].Lotes[i].Cantidad_Seleccionada = cantidad;
            lote_temp.Cantidad_Seleccionada = cantidad;
            var labelLote = "Lote: " + this.Lista_Productos[posProducto].Lotes[i].Lote + " - Vencimiento: " + this.Lista_Productos[posProducto].Lotes[i].Fecha_Vencimiento + " - Cantidad: " + cantidad;
            // console.log(labelLote, 'labelLote');

            this.Lista_Productos[posProducto].Lotes_Visuales.push(labelLote);
            this.Lista_Productos[posProducto].Cantidad = this.Lista_Productos[posProducto].Cantidad + cantidad;
            flag = false;

            //SE INCLUYE EL LOTE SELECCIONADO EN LA LISTA DE LOTES SELECCIONADOS DEL PRODUCTO
            this.Lista_Productos[posProducto].Lotes_Seleccionados.push(lote_temp);

            //SELECCIONAR LOTE EN BD
          } else if (flag && cantidad > this.Lista_Productos[posProducto].Lotes[i].Cantidad) {

            //SE CREA UNA VARIABLE PARA LLENAR y ALMACENAR LOS DATOS DE LOS LOTES QUE SE VAYAN SELECCIONANDO DE ACUERDO A LA CANTIDAD DIGITADA
            let lote_temp: any = JSON.parse(JSON.stringify(this.Lista_Productos[posProducto].Lotes[i]));

            this.GuardarLotesSeleccionados(lote_temp);

            lote_temp.Cantidad_Seleccionada = this.Lista_Productos[posProducto].Lotes[i].Cantidad;

            //SE INCLUYE EL LOTE SELECCIONADO EN LA LISTA DE LOTES SELECCIOANDOS DEL PRODUCTO
            this.Lista_Productos[posProducto].Lotes_Seleccionados.push(lote_temp);
            this.Lista_Productos[posProducto].Lotes[i].Cantidad_Seleccionada = this.Lista_Productos[posProducto].Lotes[i].Cantidad;

            // cantidad = cantidad - this.Lista_Productos[posProducto].Lotes[i].Cantidad;

            var labelLote = "Lote: " + this.Lista_Productos[posProducto].Lotes[i].Lote + " - Vencimiento: " + this.Lista_Productos[posProducto].Lotes[i].Fecha_Vencimiento + " - Cantidad: " + this.Lista_Productos[posProducto].Lotes[i].Cantidad;

            this.Lista_Productos[posProducto].Cantidad = parseInt(this.Lista_Productos[posProducto].Lotes[i].Cantidad) + this.Lista_Productos[posProducto].Cantidad;
            cantidad = cantidad - parseInt(this.Lista_Productos[posProducto].Lotes[i].Cantidad);

            if (cantidad_presentacion) {

              var modulo = cantidad % this.Lista_Productos[posProducto].Cantidad_Presentacion;
              if (modulo != 0) {
                this.Lista_Productos[posProducto].Cantidad_Requerida = this.Lista_Productos[posProducto].Cantidad_Requerida + (this.Lista_Productos[posProducto].Cantidad_Presentacion - modulo);
                cantidad = cantidad + (this.Lista_Productos[posProducto].Cantidad_Presentacion - modulo);
              }
            }
            this.Lista_Productos[posProducto].Lotes_Visuales.push(labelLote);
            //flag = false;
            //SELECCIONAR LOTE EN BD
          }
        }
      } else {
        WarningMessage('error', 'Error en cantidad', 'No se pueden entregar cantidades que no correspondan con la presentacion del producto!');
        this.Lista_Productos[posProducto].Cantidad = 0;
        this.Lista_Productos[posProducto].Cantidad_Requerida = 0;
      }

      setTimeout(() => {
        this.Lista_Productos[posProducto].Cantidad_Pendiente = this.Lista_Productos[posProducto].Cantidad_Requerida - this.Lista_Productos[posProducto].Cantidad;
        this.GuardarBorrador();
      }, 100);

    } else {

      if (this.Lista_Productos[posProducto].Lotes_Seleccionados.length > 0) {
        this.EliminarLotesSeleccionados(this.Lista_Productos[posProducto].Lotes_Seleccionados, true, posProducto);
      }
    }

  }

  public ComprobarCantidades(posProducto: string) {
    let idProducto = this.Lista_Productos[posProducto].Id_Producto;
    let p: any = {
      id_origen: this._remisionModel.Id_Origen,
      id_producto: idProducto,
      tipo_origen: this._remisionModel.Tipo_Origen,
      id_destino: this._remisionModel.Id_Destino,
      meses: this._remisionModel.Meses,
      tipo_destino: this._remisionModel.Tipo_Destino
    };

    if (this._remisionModel.Tipo_Origen == 'Bodega') {
      p.grupo = JSON.stringify(this._remisionModel.Grupo);
    }
    // console.log("eliminar lotes");
    // console.log(this._remisionModel);

    this.EliminarLotesSeleccionados(this.Lista_Productos[posProducto].Lotes_Seleccionados, true, posProducto);

    setTimeout(() => {

      this.http.get(environment.ruta + 'php/remision_nuevo/comprobar_cantidades.php', { params: p }).subscribe((data: any) => {
        if (data.length > 0) {
          this.Lista_Productos[posProducto].Cantidad_Disponible = parseInt(data[0].Cantidad_Disponible);
          this.Lista_Productos[posProducto].Lotes = data[0].Lotes;
          // console.log(this.Lista_Productos[posProducto].Cantidad_Disponible, 'comprobar lotes');
          this.SeleccionarLotes(posProducto);
        } else {
          this.Lista_Productos[posProducto].Cantidad_Disponible = 0;
          this.Lista_Productos[posProducto].Lotes = [];
          WarningMessage('warning', 'Alerta', 'El producto ya no tiene cantidad disponible!');
        }
      });
    }, 300);
  }

  private EliminarLotesSeleccionados(lote: any, vaciarLotes: boolean = false, posProducto: string = ''): void {
    let data = new FormData();
    data.append("datos", JSON.stringify(lote));

    this.http.post(environment.ruta + 'php/remision_nuevo/eliminar_lote_seleccionado.php', data).subscribe((data: any) => {
      if (data.codigo == 'success') {
        // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._swalService.ShowMessage({ icon: data.codigo, title: data.titulo, text: data.mensaje });
        // this._toastService.ShowToast(toastObj);

        if (vaciarLotes && posProducto.toString() != '') {
          this.Lista_Productos[posProducto].Lotes_Visuales = [];
          this.Lista_Productos[posProducto].Lotes_Seleccionados = [];
          // this.Lista_Productos[posProducto].Cantidad = null;
        }
      } else {
        WarningMessage(data);
      }
    });
  }

  ConsultaProductoCodigoBarras() {

    console.log('consulta productos');

    if (this.Codigo_Barras != '') {

      let params = this.setFiltrosCodBarra();

      if (!params) { return false; }

      this.ProductosAgregar = [];

      this.Cargando = true;

      this.http.get(environment.ruta + 'php/remision_nuevo/get_productos_inventario.php', { params }).subscribe((data: Array<ProductoCargarRemision>) => {
        this.ListaProductos = data;
        if (this.ListaProductos.length > 0) {
          if (!this.validarAgregados(this.ListaProductos[0].Id_Producto)) {
            return;
          } else {
            let prd = {};
            this.ListaProductos[0].Lotes_Visuales = new Array<string>();
            prd = this.SetearProductoCodBarra(this.ListaProductos[0]);
            if (!functionsUtils.IsObjEmpty(prd)) {
              this.ProductosAgregar.push(prd);
            }

            setTimeout(() => {
              this.RecibirProductos(this.ProductosAgregar);
            }, 2000);
          }
        } else {
          WarningMessage('warning', 'Alerta', 'No existe un producto con ese código de barras.');
        }

        this.Codigo_Barras = '';
        this.Cargando = false;
      });
    }
  }

  setFiltrosCodBarra() {
    let params: any = {}

    if (this._remisionModel.Id_Origen == 0 || this._remisionModel.Id_Origen == undefined) {
      WarningMessage('error', 'Sin Origen Seleccionadoe', 'Debe seleccionar un origen para realizaar la busqueda!');
      console.log(1);
      return false;
    } else if (this._remisionModel.Tipo_Origen == 'Bodega' && (!this._remisionModel.Grupo.Id_Grupo || this._remisionModel.Grupo.Id_Grupo == undefined)) {
      console.log(this._remisionModel.Grupo);
      console.log(this._remisionModel.Tipo_Origen);
      WarningMessage('error', 'Sin Categoria Seleccionada', 'Debe seleccionar un origen de categoria para realizaar la busqueda!');
      console.log(3);
      return false;
    }
    else {
      console.log(4);
      params.modelo = this._remisionModel.Modelo;
      params.tiporemision = this._remisionModel.Tipo;
      params.id_origen = this._remisionModel.Id_Origen;
      params.mes = this._remisionModel.Meses;
      params.id_grupo = this._remisionModel.Grupo.Id_Grupo;

      console.log(5);
      if (this._remisionModel.Tipo == 'Cliente') {
        params.id_destino = this._remisionModel.Id_Destino;
        if (this._remisionModel.Id_Destino == 0 || this._remisionModel.Id_Destino == undefined) {
          console.log(6);
          WarningMessage('error', 'Sin Destino Seleccionado', 'Debe seleccionar un destino para realizaar la busqueda!');
          return;
        }
      }

      console.log(7);

      params.cod_barra = this.Codigo_Barras;
      console.log(params);

      return params;
    }

  }

  private validarAgregados(id_producto) {
    let exist = this.Lista_Productos.filter(x => x == id_producto);

    if (exist.length > 0) {
      WarningMessage('warning', 'Alerta', 'Ya este producto ha sido agregado a la lista!');
      return false;
    } else {
      return true;
    }
  }

  private SetearProductoCodBarra(producto: any) {
    let product: any = new ProductoCargarRemision();

    console.log("producto cod barra --> ", producto);


    for (var key in producto) {


      if (key != 'Codigo_Cum' && key != 'Seleccionado' && key != 'Cantidad_Requerida') {
        if (key == 'Lotes') {
          console.log("Lotesss --> ", producto[key]);

          product[key] = this.SetearLotes(producto[key]);
        } else if (key == 'Cantidad') {
          if (producto[key] == '') {
            product[key] = null;
          } else {
            product[key] = parseInt(producto[key]);
          }
        } else {
          if (!isNaN(parseInt(producto[key]))) {
            product[key] = parseInt(producto[key]);
          } else {
            product[key] = producto[key];
          }
        }

      } else {
        product[key] = producto[key];
      }
    }

    console.log("Luego de setear los productos", product);


    return product;

  }

  private SetearLotes(lotes: Array<any>) {
    let lotes_nuevos = new Array<any>();

    lotes.forEach(lote => {
      let lote_nuevo = {};

      for (var key in lote) {
        if (key != 'Fecha_Vencimiento' && key != 'Lote') {
          lote_nuevo[key] = parseInt(lote[key]);
        } else {
          lote_nuevo[key] = lote[key];
        }
      }
      lotes_nuevos.push(lote_nuevo);
    });

    return lotes_nuevos;
  }

}
