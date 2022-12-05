import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import swal, { SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TercerosService } from 'src/app/pages/crm/terceros/terceros.service';
import { BodegasService } from 'src/app/pages/ajustes/informacion-base/bodegas/bodegas.service.';
import { ProductoService } from 'src/app/pages/inventario/services/producto.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { CategoriasService } from 'src/app/pages/ajustes/parametros/categorias/categorias.service';

@Component({
  selector: 'app-crear-compra-nacional',
  templateUrl: './crear-compra-nacional.component.html',
  styleUrls: ['./crear-compra-nacional.component.scss'],
})
export class CrearCompraNacionalComponent implements OnInit {
  closeResult = '';
  tipoMaterial = ['Activo_Fijo', 'Medicamento', 'Material', 'Dotacion_EPP'];
  public reducer = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Cantidad);
  public reducer1 = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Costo);
  public reducer2 = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Iva_Acu);
  public reducer3 = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Total);

  public alertOption: SweetAlertOptions = {};
  public Cargando: boolean = true;
  public listaProductos: any[] = [];
  public listaProductosPorAgregar: any = [
    {
      producto: '',
      Presentacion: '',
      Costo: 0,
      Total: 0,
      Cantidad: null,
      Iva: 0,
      Rotativo: 0,
      Id_Producto: '',
      Iva_Disa: true,
      editar: false,
      delete: false,
      Iva_Acu: 0,
    },
  ];
  public fecha = new Date();
  public Bodegas: any = [];
  public TipoBodega: string = 'Bodega';
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
  public filtroProducto:any = {
    nombre: '',
    lab_com: '',
    lab_gen: '',
    cum: '',
    catalogo: ''
};

  public Tipo: any = '';

  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('modalProductos') modalProductos: any;
  @ViewChild('FormCompra') FormCompra: NgForm;
  deleteSwal: any;
  ListaProducto: any[] = [];

  public user = '';
  posicion: any = '';
  puntos: any = [];
  public datosCabecera:any = {
    Titulo: 'Nueva orden de compra',
    Fecha: new Date()
  }

  public selectedCategory:any = {
    categoria: '',
    subcategoria: ''
  }
  subcategorias:[] = [];

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
    private modalService: NgbModal,
  ) {
    this.alertOption = {
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
          return this.GuardarCompra(this.FormCompra, resolve);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  ngOnInit() {
    let params = this.route.snapshot.queryParams;
    this.user = this._user.user.person.id;
    console.log(this.user)
    this.Cargando = true
    if (params.Pre_Compra != undefined) {
      this.http
        .get(environment.base_url + '/php/rotativoscompras/detalle_pre_compra/' + params.Pre_Compra)
        .subscribe((res: any) => {
          this.listaProductosPorAgregar = res.data.Productos;
          this.Cargando = false
          this.Id_Proveedor = res.data.Datos.Id_Proveedor;
          this.listaProductosPorAgregar.push({
            producto: '',
            Costo: 0,
            Total: 0,
            Cantidad: null,
            Iva: 0,
            Rotativo: 0,
            Id_Producto: '',
            Iva_Disa: true,
            Presentacion: 0,
            Iva_Acu: 0,
          });
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

    if (this.id != undefined) {
      this.Rotativo = true;
      //debo llamar al localstore, y decirle cual es el que quiero listar
      this.listaProductosPorAgregar.splice(0, 1);
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
            Costo: element.Costo,
            Total: parseFloat(element.Costo) * parseFloat(element.Cantidad),
            Cantidad: element.Cantidad,
            Iva: element.Iva,
            Rotativo: 0,
            Id_Producto: element.Id_Producto,
            Iva_Disa: true,
          });
        }
      });

      //
      this.listaProductosPorAgregar.push({
        producto: '',
        Costo: 0,
        Total: 0,
        Cantidad: null,
        Iva: 0,
        Rotativo: 0,
        Id_Producto: '',
        Iva_Disa: true,
      });
      this.Cantidad_v = parseFloat(
        this.listaProductosPorAgregar.reduce(this.reducer, 0)
      );
      this.Costo_v = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer1, 0));
      //this.Iva_v = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer2, 0));
      this.Subtotal_v = parseFloat(
        this.listaProductosPorAgregar.reduce(this.reducer3, 0)
      );

      this.Subtotal_F = this.Subtotal_v;
      //this.Iva_F=(this.Subtotal_v*this.Iva_v)/100;
      this.Total_F = this.Subtotal_v + this.Iva_v;
      /*var subtotal = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer, 0));
        this.Subtotal = subtotal - (subtotal * 0.19)
        this.Iva = (subtotal * 0.19);
        this.Total = subtotal;*/
    }
    /* TODO ACTUALIZAR FUNCIONARIO */

    this.http.get( environment.base_url + '/php/inventario_fisico_puntos/lista_punto_funcionario').subscribe((res: any) => {
        this.puntos = res.data;
      });

    this._proveedor.getThirdPartyProvider({
    }).subscribe((res: any) => {
      this.Proveedores = res.data;
    });

    this._categoria.getCategorias().subscribe((res: any) => {
      this.Categorias = res.data;
      console.log(this.Categorias);
    });
  }

  getSubCategories(event){
    this.subcategorias=event.subcategory;
    this.selectedCategory.subcategoria='';
  }

  public openConfirm(confirm){
    this._modal.open(confirm, 'xl')
    /* this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'xl', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }); */
  }
  /* private getDismissReason(reason: any) {

  } */

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
  }

  filtros(){
    let params = {...this.filtroProducto, company_id: this._user.user.person.company_worked.id }
    this.Cargando = true;
    this._producto.getProductos(params).subscribe((res: any) => {
      this.ListaProducto = res.data;
      this.Cargando = false;
    })
  }

  searchProduct(pos, editar) {
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
  }

  async GuardarCompra(formulario: NgForm, resolve) {
    let params = this.route.snapshot.queryParams;

    //Se  actualiza la precompra con el estado Solicitada
    if (params.Pre_Compra != undefined) {
      let datos = new FormData();
      datos.append('id_pre_compra', params.Pre_Compra);
      this.http
        .post(
          environment.ruta + '/php/rotativoscompras/actualizar_estado.php',
          datos
        )
        .subscribe((data: any) => { });
    }

    if (this.listaProductosPorAgregar.length > 1) {
      let info = JSON.stringify(formulario.value);
      let prod = JSON.stringify(this.listaProductosPorAgregar);
      let datos = new FormData();

      params.Pre_Compra != undefined
        ? datos.append('id_pre_compra', params.Pre_Compra)
        : '';
      datos.append('modulo', 'Orden_Compra_Nacional');
      datos.append('datos', info);
      datos.append('productos', prod);
      datos.append('tipoBodega', this.TipoBodega);
      datos.append('company_id', this._user.user.person.company_worked.id);

      return await this.http
        .post(
          environment.ruta +
          'php/comprasnacionales/guardar_compra_nacional.php',
          datos
        )
        .toPromise()
        .then(
          (data: any) => {
            this.confirmacionSwal.title = 'Creacion de Orden de Compras';
            this.confirmacionSwal.text = data.mensaje;
            this.confirmacionSwal.icon = data.tipo;
            this.confirmacionSwal.fire();
            formulario.reset();
            // this.NombreProveedor='';
            this.VerPantallaLista();
            //buscar posición proveedor
            const proveedor = this.precompra.find(
              (lista) => lista.Id_Proveedor === this.id
            );
            const index = this.precompra.indexOf(proveedor);
            //eliminar ese provvedor de la lista
            this.precompra.splice(index, 1);
            //decir al localstore que lo que tengo en lista producto será el nuevo localstorage
            localStorage.setItem('Compra', JSON.stringify(this.precompra));
          },
          (error) => {
            this.confirmacionSwal.title = 'Error';
            this.confirmacionSwal.text =
              'Ha ocurrido un error inesperado de conexión.';
            this.confirmacionSwal.icon = 'error';
            this.confirmacionSwal.fire();
          }
        );
    } else {
      this.confirmacionSwal.title = 'Error ';
      this.confirmacionSwal.text =
        'No se puede guardar un orden de compra si productos';
      this.confirmacionSwal.icon = 'error';
      this.confirmacionSwal.fire();
    }
  }

  VerPantallaLista() {
    this.router.navigate(['/compras/nacional']);
  }

  addProduct(pos) {
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
  }

  AgregarProducto() {
    let editar_producto = this.band_editar;

    this.Productos.forEach((valor, i) => {
      if (
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
          }

          this.listaProductosPorAgregar.push({
            // Se agregan nuevos productos.
            producto: valor.producto,
            Presentacion: valor.Presentacion,
            Costo: valor.Costo,
            Total: 0,
            Cantidad: null,
            Iva: 0,
            Rotativo: 0,
            Id_Producto: valor.Id_Producto,
            Iva_Disa: valor.Iva_Disa,
            editar: true,
            delete: true,
            Iva_Acu: 0,
            Embalaje: valor.Embalaje,
          });
        }
      }
    });

    let pos = this.listaProductosPorAgregar.length - 1;

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

    this.modalService.dismissAll();
    this.Productos = [];
  }

  deleteProduct(posicion, event) {
    if (event.screenX != 0) {
      this.listaProductosPorAgregar.splice(posicion, 1);
      this.ActualizaValores();
    }
  }

  CalculoTotal(pos) {
    var cantidad = (
      document.getElementById('Cantidad' + pos) as HTMLInputElement
    ).value;
    var Costo = (document.getElementById('Costo' + pos) as HTMLInputElement)
      .value;
    var subtotal = parseFloat(Costo) * parseFloat(cantidad);

    var iva = (document.getElementById('Iva' + pos) as HTMLInputElement).value;

    this.listaProductosPorAgregar[pos].Iva_Acu = subtotal * (parseInt(iva) / 100);
    this.listaProductosPorAgregar[pos].Total = subtotal;
  }

  CapturarDigitacion(pos) {
    let cantidad = (
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
  }

  ActualizaValores() {
    this.Cantidad_v = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer, 0));
    this.Costo_v = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer1, 0));
    this.Iva_F = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer2, 0));
    this.Subtotal_v = parseFloat(this.listaProductosPorAgregar.reduce(this.reducer3, 0));

    this.Subtotal_F = this.Subtotal_v;

    this.Total_F = this.Subtotal_F + this.Iva_F;
  }

  /*listaProductosBodega(Bodega) {
       this.http.get(environment.ruta + 'php/comprasnacionales/producto_bodega_compra_nacional.php').subscribe((data: any) => {
          this.ListaProducto = data;
        });
    }*/
}
