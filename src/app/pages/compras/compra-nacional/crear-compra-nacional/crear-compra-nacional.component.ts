import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import swal, { SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crear-compra-nacional',
  templateUrl: './crear-compra-nacional.component.html',
  styleUrls: ['./crear-compra-nacional.component.scss'],
})
export class CrearCompraNacionalComponent implements OnInit {
  closeResult = '';
  public openConfirm(confirm){
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'xl', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
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
  public Cargando: boolean = false;
  public ListaProductos: any[] = [];
  public Lista_Productos: any = [
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
  public filtro_nombre: string = '';
  public filtro_lab_com: string = '';
  public filtro_lab_gen: string = '';
  public filtro_cum: string = '';
  public filtro_catalogo: string = '';

  public Tipo: any = '';

  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('modalProductos') modalProductos: any;
  @ViewChild('FormCompra') FormCompra: NgForm;
  deleteSwal: any;
  ListaProducto: any[] = [];

  public user = '';
  posicion: any = '';
  puntos: any = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _user: UserService,
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


    this.http
      .get(environment.ruta + 'php/comprasnacionales/proveedor_buscar.php', {
        params: {

          company_id: this._user.user.person.company_worked.id
        }
      })
      .subscribe((data: any) => {
        this.Proveedores = data;
      });
  }

  //INICIA BUCAR LOS PRODUCTO
  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.ListaProducto.filter(
            (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1
          ).slice(0, 10)
      )
    );
  formatter1 = (x: { Nombre: string }) => x.Nombre;
  //FIN BUCAR LOS PRODUCTO

  //INICIA BUCAR LOS PROVEEDORES
  search2 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.Proveedores.filter(
            (v) =>
              v.NombreProveedor.toLowerCase().indexOf(term.toLowerCase()) > -1
          ).slice(0, 10)
      )
    );
  formatter2 = (x: { NombreProveedor: string }) => x.NombreProveedor;
  //FIN BUCAR LOS PROVEEDORES

  ngOnInit() {
    let params = this.route.snapshot.queryParams;
    this.user = this._user.user.person.id;
    console.log(this.user)
    if (params.Pre_Compra != undefined) {
      this.http
        .get(environment.ruta + 'php/rotativoscompras/detalle_pre_compra.php', {
          params: { id: params.Pre_Compra },
        })
        .subscribe((data: any) => {
          this.Lista_Productos = data.Productos;
          this.Id_Proveedor = data.Datos.Id_Proveedor;
          this.Lista_Productos.push({
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
          this.NombreProveedor = data.Proveedor;
          this.ActualizaValores();
          this.Tipo = 'Recurrente';
        });
    }

    this.http
      .get(environment.ruta + 'php/bodega_nuevo/get_bodegas.php', {
        params: {
          company_id: this._user.user.person.company_worked.id
        }
      })
      .subscribe((data: any) => {
        this.Bodegas = data.Bodegas;
        this.Impuestos = data.impuestoli;
      });

    if (this.id != undefined) {
      this.Rotativo = true;
      //debo llamar al localstore, y decirle cual es el que quiero listar
      this.Lista_Productos.splice(0, 1);
      const proveedor = this.precompra.find(
        (lista) => lista.Id_Proveedor === this.id
      );
      const index = this.precompra.indexOf(proveedor);
      var idProveedor = this.precompra[index].Id_Proveedor;
      this.Id_Proveedor = idProveedor;
      var productos = this.precompra[index].Productos;
      productos.forEach((element) => {
        if (element != null) {
          this.Lista_Productos.push({
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
      this.Lista_Productos.push({
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
        this.Lista_Productos.reduce(this.reducer, 0)
      );
      this.Costo_v = parseFloat(this.Lista_Productos.reduce(this.reducer1, 0));
      //this.Iva_v = parseFloat(this.Lista_Productos.reduce(this.reducer2, 0));
      this.Subtotal_v = parseFloat(
        this.Lista_Productos.reduce(this.reducer3, 0)
      );

      this.Subtotal_F = this.Subtotal_v;
      //this.Iva_F=(this.Subtotal_v*this.Iva_v)/100;
      this.Total_F = this.Subtotal_v + this.Iva_v;
      /*var subtotal = parseFloat(this.Lista_Productos.reduce(this.reducer, 0));
        this.Subtotal = subtotal - (subtotal * 0.19)
        this.Iva = (subtotal * 0.19);
        this.Total = subtotal;*/
    }
    /* TODO ACTUALIZAR FUNCIONARIO */

    this.http
      .get(
        environment.ruta +
        'php/inventario_fisico_puntos/lista_punto_funcionario.php',
        { params: { id: '1' } }
      )
      .subscribe((data: any) => {
        this.puntos = data.Puntos;
      });
  }

  filtros() {
    let params: any = {};

    if (
      this.filtro_lab_com != '' ||
      this.filtro_lab_gen != '' ||
      this.filtro_cum != '' ||
      this.filtro_catalogo
    ) {
      this.Cargando = true;
      this.ListaProducto = [];

      if (this.filtro_nombre != '') {
        params.nom = this.filtro_nombre;
      }
      if (this.filtro_lab_com != '') {
        params.lab_com = this.filtro_lab_com;
      }
      if (this.filtro_lab_gen != '') {
        params.lab_gen = this.filtro_lab_gen;
      }
      if (this.filtro_cum != '') {
        params.cum = this.filtro_cum;
      }
      if (this.filtro_catalogo != '') {
        params.catalogo = this.filtro_catalogo;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.http
        .get(
          environment.ruta +
          'php/comprasnacionales/lista_productos.php?' +
          queryString, { params: { company_id: this._user.user.person.company_worked.id } }
        )
        .subscribe((data: any) => {
          this.Cargando = false;
          this.ListaProducto = data;
        });
    } else {
      this.filtro_lab_com = '';
      this.filtro_lab_gen = '';
      this.filtro_cum = '';
      this.filtro_catalogo = '';
      this.Cargando = true;
      this.ListaProducto = [];

      this.http
        .get(environment.ruta + 'php/comprasnacionales/lista_productos.php', {
          params: { nom: this.filtro_nombre, company_id: this._user.user.person.company_worked.id },
        })
        .subscribe((data: any) => {
          this.Cargando = false;
          this.ListaProducto = data;
        });
    }
  }
  

  searchProduct(pos, editar) {
    this.ListaProducto = [];
    this.Productos = [];
    this.filtro_nombre = '';
    this.filtro_lab_com = '';
    this.filtro_lab_gen = '';
    this.filtro_cum = '';
    this.filtro_catalogo = '';
    let producto = (
      document.getElementById('Producto' + pos) as HTMLInputElement
    ).value;
    this.filtro_nombre = producto;
    this.posicion = pos;
    this.band_editar = editar;
    this.Cargando = true;

    if (producto != '') {
      this.http

        .get(environment.ruta + 'php/comprasnacionales/lista_productos.php', {
          params: { nom: producto, company_id: this._user.user.person.company_worked.id },
        })
        .subscribe((data: any) => {
          this.Cargando = false;
          this.ListaProducto = data;
        });
    } else {
    }
  }

  //INICIA BUCAR LOS PROVEEDORES
  BuscarProveedor(modelo) {
    console.log(modelo);

    if (typeof modelo == 'object') {
      this.NombreProveedor = modelo;
      this.Id_Proveedor = modelo.Id_Proveedor;
    } else {
      this.NombreProveedor = '';
      this.Id_Proveedor = '';
    }
  }
  //FIN BUCAR LOS PROVEEDORES

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

    if (this.Lista_Productos.length > 1) {
      let info = JSON.stringify(formulario.value);
      let prod = JSON.stringify(this.Lista_Productos);
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
        this.Lista_Productos.length == 1 &&
        this.Lista_Productos[0].Id_Producto == ''
      ) {
        // Cuando la lista de productos está vacía o inicializada por primera vez.
        this.Lista_Productos[0].Costo = valor.Costo;
        this.Lista_Productos[0].Presentacion = valor.Presentacion;
        this.Lista_Productos[0].Id_Producto = valor.Id_Producto;
        this.Lista_Productos[0].producto = valor.producto;
        this.Lista_Productos[0].Iva_Disa = valor.Iva_Disa;
        this.Lista_Productos[0].editar = true;
        this.Lista_Productos[0].delete = true;
        this.Lista_Productos[0].Embalaje = valor.Embalaje;
      } else if (this.band_editar) {
        // Cuando se quiere editar un producto.
        this.Lista_Productos[this.posicion].Costo = valor.Costo;
        this.Lista_Productos[this.posicion].Presentacion = valor.Presentacion;
        this.Lista_Productos[this.posicion].Id_Producto = valor.Id_Producto;
        this.Lista_Productos[this.posicion].producto = valor.producto;
        this.Lista_Productos[this.posicion].Iva_Disa = valor.Iva_Disa;
        this.Lista_Productos[this.posicion].Embalaje = valor.Embalaje;
        this.Lista_Productos[this.posicion].delete = true;
        this.band_editar = false;
      } else {
        // Cuando se quiere agregar nuevos productos.

        if (
          this.Lista_Productos.length > 1 &&
          this.Lista_Productos[this.posicion].Id_Producto == ''
        ) {
          // Si la lista de productos estaba llena y la posicion donde se está buscando el producto estaba vacía, edita el campo actual.
          this.Lista_Productos[this.posicion].Costo = valor.Costo;
          this.Lista_Productos[this.posicion].Presentacion = valor.Presentacion;
          this.Lista_Productos[this.posicion].Id_Producto = valor.Id_Producto;
          this.Lista_Productos[this.posicion].producto = valor.producto;
          this.Lista_Productos[this.posicion].Iva_Disa = valor.Iva_Disa;
          this.Lista_Productos[this.posicion].Embalaje = valor.Embalaje;
          this.Lista_Productos[this.posicion].delete = true;
        } else {
          if (editar_producto) {
            // Si se editó un producto, se declara esta condicional como bandera para que elimine el ultimo campo en blanco y pueda añadir en la lista de productos sin problema.
            let last_position = this.Lista_Productos.length - 1;
            this.Lista_Productos.splice(last_position, 1);
            editar_producto = false;
          }

          this.Lista_Productos.push({
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

    let pos = this.Lista_Productos.length - 1;

    if (this.Lista_Productos[pos].producto != '') {
      // Si en la ultima posición del Array ya no es vacío se agrega un nuevo campo para una nueva busqueda.
      this.Lista_Productos.push({
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
      this.Lista_Productos.splice(posicion, 1);
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

    this.Lista_Productos[pos].Iva_Acu = subtotal * (parseInt(iva) / 100);
    this.Lista_Productos[pos].Total = subtotal;
  }

  CapturarDigitacion(pos) {
    let cantidad = (
      document.getElementById('Cantidad' + pos) as HTMLInputElement
    ).value;
    let costo = (document.getElementById('Costo' + pos) as HTMLInputElement)
      .value;
    let iva = (document.getElementById('Iva' + pos) as HTMLInputElement).value;
    let subtotal = parseFloat(cantidad) * parseFloat(costo);

    this.Lista_Productos[pos].Cantidad = cantidad;
    this.Lista_Productos[pos].Costo = costo;
    this.Lista_Productos[pos].Iva = iva;
    this.Lista_Productos[pos].Total = subtotal.toFixed();
  }

  ActualizaValores() {
    this.Cantidad_v = parseFloat(this.Lista_Productos.reduce(this.reducer, 0));
    this.Costo_v = parseFloat(this.Lista_Productos.reduce(this.reducer1, 0));
    this.Iva_F = parseFloat(this.Lista_Productos.reduce(this.reducer2, 0));
    this.Subtotal_v = parseFloat(this.Lista_Productos.reduce(this.reducer3, 0));

    this.Subtotal_F = this.Subtotal_v;

    this.Total_F = this.Subtotal_F + this.Iva_F;
  }

  /*ListaProductosBodega(Bodega) {
       this.http.get(environment.ruta + 'php/comprasnacionales/producto_bodega_compra_nacional.php').subscribe((data: any) => {
          this.ListaProducto = data;
        });
    }*/
}
