import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventarioFisicoModel } from 'src/app/core/models/InventarioFisicoModel';
import { ToastService } from 'src/app/core/services/toast.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { InventariofisicoService } from '../../services/inventariofisico.service';
import { environment } from 'src/environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';


@Component({
  selector: 'app-inventario-estiba',
  templateUrl: './inventario-estiba.component.html',
  styleUrls: ['./inventario-estiba.component.scss']
})
export class InventarioEstibaComponent implements OnInit {



  public InventarioFisicoModel: InventarioFisicoModel = new InventarioFisicoModel();
  public DatosEncabezado: any = {};
  public Funcionario_Digita: any = {};
  public Funcionario_Cuenta: any = {};
  public Model: any = {
    Estiba: {
      Nombre: '',
    },
    Bodega: {
      Nombre: ''
    }
  };
  public Productos: any = [];
  public Cargado = false;
  public Editar = false;
  public DatosCabecera: any = {
    Titulo: 'Inventario Fisico Estibas',
    Fecha: new Date(),
    Codigo: ''
  };

  // public RutaPrincipal: string = this._generalService.Ruta_Principal;

  public Producto_Barras: any = {};
  public Cargando: boolean = false;
  public Codigo_Barras = '';
  public Fecha_Hoy = new Date();
  public alertOption1: SweetAlertOptions = {};
  public alertOption2: SweetAlertOptions = {};
  public alertOption3: SweetAlertOptions = {};
  public alertOptionGuardarSalir: SweetAlertOptions = {};
  @ViewChild('confirmacionGuardar1') confirmacionGuardar1:SwalComponent;
  @ViewChild('respuestaGuardarOk') respuestaGuardarOk:SwalComponent;
  @ViewChild('respuestaGuardarError') respuestaGuardarError:SwalComponent;
  @ViewChild('respuesTrabajando') respuesTrabajando:SwalComponent;

  public idInventarioParams;

  /** las dos pociones validas en la db */
  GuardarSalirTipo = 'Pendiente Primer Conteo';
  GuardarTerminarTipo = 'Primer Conteo';


  constructor(private _swalService: SwalService, private http: HttpClient,
    private _toastService: ToastService, private inventariofisico: InventariofisicoService,
    public router: Router,
    private route: ActivatedRoute,) {
    this.alertOption1 = {
      title: "¿Está Seguro?",
      text: "Se dispone a ingresar lotes del Producto al primer conteo",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar',
      icon: 'success',
      preConfirm: () => {

        this.GuardaLotes();

      },
      allowOutsideClick: () => !Swal.isLoading()
    }
    this.alertOption2 = {
      title: "¿Está Seguro?",
      text: "Se dispone a terminar el inventario",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {

          this.AjustarInventario();
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }
    this.alertOption3 = {
      title: "Advertencia!",
      text: "Ya existe una persona haciendo este inventario",
      showCancelButton: false,
      confirmButtonText: 'Salir',
      icon: 'info',
      allowEscapeKey: false,
      allowEnterKey: false,
      allowOutsideClick: false,


      preConfirm: () => {
        return new Promise((resolve) => {

          this.router.navigate(['/listadoinventarios'])
        })
      },

    }
    this.alertOptionGuardarSalir = {
      title: "¿Está Seguro?",
      text: "Se dispone a Guardar y salir del inventario",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar y Salir',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.guardarGeneral(this.GuardarSalirTipo);
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }
  }

  async ngOnInit() {

    let params: any = {};
    params.Id_Doc_Inventario_Fisico = this.route.snapshot.params['idInventarioEstiba'];

      this.http.get(environment.ruta + 'php/inventariofisico/estiba/get_inventario.php', {params}).subscribe(async (res: any) => {

    // this.inventariofisico.GetInventario(param).subscribe(async (res) => {

      if (res.Tipo == 'success') {

        //verificamos que el inventario no lo estén trabajando previamente
        if (res.Data.Estado != 'Pendiente Primer Conteo') {
          this.respuesTrabajando.fire();

        } else {
          //actualizamos el estado del inventario para que nadie pueda trabajar en él
          let datos = new FormData();
          datos.append("Id_Doc_Inventario_Fisico", params.Id_Doc_Inventario_Fisico);
          datos.append("tipo_accion", 'Haciendo Primer Conteo');
          // await this.inventariofisico.GestionarEstado(datos).toPromise();

          this.http.post(environment.ruta + 'php/inventariofisico/estiba/gestion_de_estado.php', datos)


          this.Model = res.Data;

          this.Model.Estado = 'Haciendo Primer Conteo';
          this.Funcionario_Cuenta = this.Model.Funcionario_Cuenta;
          this.Funcionario_Digita = this.Model.Funcionario_Digita;
        }

        if (this.Model.Productos.length > 0) {
          this.Productos = JSON.parse(this.Model.Productos);
          let swal = {
            icon: 'success',
            title: "Continuamos",
            text: "Continuamos con el Inventario ¡Muchos Exitos!"
          };
          this._swalService.show(swal);
        }
      }
    })
  }

  ConsultaCodigo(codigo) {
    this.Cargando = true;

    let params: any = {};
    params.Codigo = codigo;
    params.Id_Estiba = this.Model.Estiba.Id_Estiba;
    this.Codigo_Barras = '';

    let resultado = this.Productos.find(lote => lote.Codigo_Barras === codigo);

    if (!resultado) {
    this.http.get(environment.ruta + 'php/inventariofisico/estiba/consulta_producto.php', { params}).subscribe((data: any) => {

      // this.inventariofisico.GetProductoEstiba(params).subscribe((data: any) => {
        if (data.Tipo == 'success') {
          this.Producto_Barras = data.Datos;
          this.Producto_Barras["Lotes"].push({
            Codigo: 'Ingresa uno Nuevo ->',
            Id_Inventario_Nuevo: 0,
            Id_Producto: data.Datos.Id_Producto,
            Lote: '',
            Fecha_Vencimiento: '',
            Cantidad: 0,
            Cantidad_Final: 0,
            Cantidad_Encontrada: ''
          });
          this.Cargado = true;

        } else {
          let swal = {
            icon: data.Tipo,
            title: data.Titulo,
            text: data.Texto,
          };
          this._swalService.show(swal);

        }
        this.Cargando = false;
      });
    } else {
      this.Cargando = false;
      let swal = {
        icon: "error",
        title: "ERROR",
        text: "El Producto fué previamente Inventariado, Por Favor intente con Otro"
      };
      this._swalService.show(swal);
    }
  }

  ValidarLote(pos) {
    if (this.Producto_Barras['Lotes'][pos].Lote.length < 4) {
      let swal = {
        icon: "error",
        title: "Error en Lote",
        text: "La longitud del Lote debe ser mayor o igual a tres letras"
      };
      this._swalService.show(swal);
      this.Producto_Barras['Lotes'][pos].Lote = '';
      this.Producto_Barras['Lotes'][pos].Fecha_Vencimiento = '';
      this.Producto_Barras['Lotes'][pos].Cantidad_Encontrada = '';
    } else {
      this.Producto_Barras['Lotes'][pos].Lote = this.Producto_Barras['Lotes'][pos].Lote.trim();
      this.Producto_Barras['Lotes'][pos].Lote = this.Producto_Barras['Lotes'][pos].Lote.toUpperCase();

      document.getElementById("Vencimiento" + pos).focus();
    }

  }
  VerificarSiExisteEnFila(pos) {

    //verificamos antes de agregar a la fila si existe un lote agregado al mismo producto

    //si solo hay un lote quiere decir que es el de insertar, entonces no es necesario hacer la verificación
    if (this.Producto_Barras["Lotes"].length > 1) {
      //recorremos los lotes menos el último que es el de insertar buscando coincidencias si la encuentra mande un mensaje de error!
      for (let index = 0; index < this.Producto_Barras['Lotes'].length - 1; index++) {

        if (this.Producto_Barras["Lotes"][pos].Lote == this.Producto_Barras['Lotes'][index].Lote && pos != index) {
          console.log('encontre coincidencias', this.Producto_Barras['Lotes'][index].Lote);
          let swal = {
            icon: "error",
            title: "Error en referencia del Lote",
            text: "Existe un Lote del mismo producto agregado , Por Favor Revise "
          };

          this.Producto_Barras["Lotes"][pos].Lote = '';
          this.Producto_Barras["Lotes"][pos].Cantidad_Encontrada = '';
          this.Producto_Barras["Lotes"][pos].Fecha_Vencimiento = '';
          this._swalService.show(swal);
          document.getElementById("Lote" + pos).focus();
          return false;
        }
      }

    }
    //si no encotró coincidencia agregue a la fila
    this.AgregaFila(pos);
  }

  AgregaFila(pos) {

    if (this.Producto_Barras["Lotes"][pos + 1] == undefined) {
      this.Producto_Barras["Lotes"].push({
        Codigo: 'Ingresa uno Nuevo ->',
        Id_Inventario_Nuevo: 0,
        Id_Producto: this.Producto_Barras.Id_Producto,
        Lote: '',
        Fecha_Vencimiento: '',
        Cantidad: 0,
        Cantidad_Final: '',
        Cantidad_Encontrada: ''
      });
    }

  }
  ValidarFecha(pos) {

    this.Fecha_Hoy = new Date();
    var dia = new Date(this.Fecha_Hoy.setDate(this.Fecha_Hoy.getDate() - 365));
    var fecha_limite = new Date(this.Fecha_Hoy.setDate(this.Fecha_Hoy.getDate() + 3650));
    //Fecha Inferior es un(1) año menos que la actual
    var Fecha_Inferior = dia.toISOString().split("T")[0];
    //Fecha Superior son (10) años mas que la actual
    var Fecha_Superior = fecha_limite.toISOString().split("T")[0];

    //la fecha de vencimiento no puede ser menor a un año ni tamoco puede ser mayor que 10 años, si pasa eso genere un error
    if (this.Producto_Barras['Lotes'][pos].Fecha_Vencimiento < Fecha_Inferior || this.Producto_Barras['Lotes'][pos].Fecha_Vencimiento > Fecha_Superior) {
      let swal = {
        icon: "error",
        title: "Error en la Fecha de Vencimiento ",
        text: "Hay un error en la fecha de  vencimiento, por favor revise "
      };
      this._swalService.show(swal);
      console.log('prod', this.Producto_Barras['Lotes'][pos]);

      this.Producto_Barras['Lotes'][pos]['Fecha_Vencimiento'] = '';
      this.Producto_Barras['Lotes'][pos]['Cantidad_Encontrada'] = '';
      this.Producto_Barras['Lotes'][pos]['Lote'] = '';

    } else {
      //en caso contrario enfoque el siguiente campo para ser rellenado
      document.getElementById("Cantidad" + pos).focus();
    }


  }

  ValidarCantidad(pos) {
    //si en la lista de Lotes solo existe uno (el de ingresar nuevo ) no deja guardar lotes, debe ser agregado previamente a la lista pasando todas las validaciones
    if (this.Producto_Barras['Lotes'][pos].Codigo == 'Ingresa uno Nuevo ->' && this.Producto_Barras['Lotes'][pos].Cantidad_Encontrada == 0) {
      console.log('es uno nuevo', this.Producto_Barras['Lotes'][pos]);
      let swal = {
        icon: "error",
        title: "Hay un error  ",
        text: "Los lotes nuevos deben ser mayor a 0, Por favor revise"
      };
      this._swalService.show(swal);

      return false
    }
    //antes de pasar a agregar a fila y guardar debemos verificar si todos los campos anteriores no están vacios
    let cantidad = (this.Producto_Barras['Lotes'][pos].Cantidad_Encontrada).toString();
    if (cantidad == '' || this.Producto_Barras['Lotes'][pos].Fecha_Vencimiento == '' || this.Producto_Barras['Lotes'][pos].Lote == '') {
      let swal = {
        icon: "error",
        title: "Hay un error  ",
        text: "Debe agregar todos los campos , por favor revise "
      };
      this._swalService.show(swal);
      return false
    }
    //si todo sale bien verifica si exite en la fila previamente
    this.VerificarSiExisteEnFila(pos);

  }

  guardarvalidado() {
    //validar si existen lotes incompletos para que no guarden vacios

    for (let producto = 0; producto < this.Producto_Barras['Lotes'].length - 1; producto++) {

      if (this.Producto_Barras['Lotes'][producto]['Lote'] == '' || this.Producto_Barras['Lotes'][producto]['Fecha_Vencimiento'] == ''
      ){
        let swal = {
          icon: "error",
          title: "Existe un error  ",
          text: "Existen lotes con campos incompletos, por favor revise"
        };
        this._swalService.show(swal);
        return false;
      }
      if(this.Producto_Barras['Lotes'][producto]['Codigo'] != '')
      {
        if (this.Producto_Barras['Lotes'][producto]['Cantidad_Encontrada'] <= 0 )
        {
          {
            let swal = {
              icon: "error",
              title: "Existe un error  ",
              text: "Las cantidades no son correctas por favor revise"
            };
            this._swalService.show(swal);
            return false;
          }
        }
      }
      if (this.Producto_Barras['Lotes'][producto]['Cantidad_Encontrada'] === '' || isNaN( this.Producto_Barras['Lotes'][producto]['Cantidad_Encontrada']) )
      {
        {
          let swal = {
            icon: "error",
            title: "Existe un error  ",
            text: "La cantidad encontrada no puede estar vacía"
          };
          this._swalService.show(swal);
          return false;
        }
      }
    }

    if (this.Producto_Barras['Lotes'].length <= 1) {
      let swal = {
        icon: "error",
        title: "Hay un error  ",
        text: "Debe agregar un lote para poder guardar , por favor revise "
      };
      this._swalService.show(swal);
    } else {

      //limpiamos el ultimo dato para que ingrese limpio
      console.log(this.Producto_Barras['Lotes'][this.Producto_Barras['Lotes'].length - 1], ' cantidad ');
      let ultimo = (this.Producto_Barras['Lotes'].length) - 1;
      this.Producto_Barras['Lotes'][ultimo].Cantidad_Encontrada = '';
      this.Producto_Barras['Lotes'][ultimo].Lote = '';
      this.Producto_Barras['Lotes'][ultimo].Fecha_Vencimiento = '';
      this.confirmacionGuardar1.fire();
    }
  }

  GuardaLotes() {
    this.Productos.push(this.Producto_Barras);
    this.Producto_Barras = [];
    let productos = functionsUtils.normalize(JSON.stringify(this.Productos));

    let datos = new FormData();
    datos.append("Id_Doc_Inventario_Fisico", this.Model["Id_Doc_Inventario_Fisico"]);
    datos.append("Productos", productos);

    this.SaveLoteEstiba(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this._swalService.show(data);
        this.Cargado = false;
      } else {
        this._swalService.show(data);
      }
    });
  }

  SaveLoteEstiba(data: FormData){
    return this.http.post(environment.ruta + 'php/inventariofisico/estiba/agrega_productos.php', data);
  }


  editLote(pos, pos2) {
    this.Productos[pos].Lotes[pos2].AgregarLote = 'block';
    this.Editar = true;
  }


  addLote(pos, pos2) {
    //el último lote agregado le cambiamos su propiedad a none para que no sea editable
    this.Productos[pos].Lotes[pos2].AgregarLote = 'none';
    if (!this.Editar) {

      let fila = {
        Codigo: "Ingresa uno Nuevo ->",
        Lote:'',
        textencimiento: '',
        Cantidad_Encontrada: '',
        Cantidad_Inventario: 0,
        Id_Inventario_Nuevo: 0,
        AgregarLote: 'none',
        Id_Producto: this.Productos[pos].Id_Producto
      }

      this.Productos[pos].Lotes.push(fila);
      this.reGuardarLotes();
    } else {
      this.Editar = false;
    }


  }
  mostrarUltimo(producto) {
    this.Productos[producto].Lotes[this.Productos[producto].Lotes.length - 1].AgregarLote = 'block'
  }

  verModelos(pos, pos2) {
    console.log(pos, pos2);

    console.log(this.Productos[pos].Lotes[pos2]);

    console.log('cantidad encontrada', this.Productos[pos].Lotes[pos2].Cantidad_Encontrada, 'Lote:', this.Productos[pos].Lotes[pos2].Lote, 'Fecha V', this.Productos[pos].Lotes[pos2].Fecha_Vencimiento);
    if (this.Productos[pos].Lotes[pos2].Lote == "" || this.Productos[pos].Lotes[pos2].Fecha_Vencimiento == "" || this.Productos[pos].Lotes[pos2].Cantidad_Encontrada == "", this.Productos[pos].Lotes[pos2].Cantidad_Encontrada == undefined, this.Productos[pos].Lotes[pos2].Cantidad_Encontrada == null) {
      console.log('datos erroneos');
      return false;
    }



    if (this.Productos[pos].Lotes[pos2].Lote != "" && this.Productos[pos].Lotes[pos2].Fecha_Vencimiento != "" && this.Productos[pos].Lotes[pos2].Cantidad_Encontrada >= 0) {
      this.Productos[pos].Lotes[pos2].AgregarLote = 'none';
      console.log('entró');
      return false;
      //this.Productos[pos].Lotes[pos2].EditLote = false;

    }
  }

  reValidarFecha(producto, lote) {
    console.log(this.Productos[producto].Lotes[lote], 'revalidar fecha');

    this.Fecha_Hoy = new Date();
    var dia = new Date(this.Fecha_Hoy.setDate(this.Fecha_Hoy.getDate() - 365));
    var fecha_limite = new Date(this.Fecha_Hoy.setDate(this.Fecha_Hoy.getDate() + 3650));
    //Fecha Inferior es un(1) año menos que la actual
    var Fecha_Inferior = dia.toISOString().split("T")[0];
    //Fecha Superior son (10) años mas que la actual
    var Fecha_Superior = fecha_limite.toISOString().split("T")[0];

    //la fecha de vencimiento no puede ser menor a un año ni tamoco puede ser mayor que 10 años, si pasa eso genere un error
    if (this.Productos[producto].Lotes[lote].Fecha_Vencimiento < Fecha_Inferior || this.Productos[producto].Lotes[lote].Fecha_Vencimiento > Fecha_Superior) {
      let swal = {
        icon: "error",
        title: "Error en la Fecha de Vencimiento ",
        text: "Hay un error en la fecha de la Vencimiento, Por Favor Revise "
      };
      this._swalService.show(swal);
      this.Producto_Barras[producto][lote].Fecha_Vencimiento = '';
    } else {
      //en caso contrario enfoque el siguiente campo para ser rellenado
      console.log('fecha esta ok');

      //document.getElementById("Cantidad"+pos).focus();
    }


  }

  reValidarLote(producto, lote) {
    console.log(this.Productos[producto].Lotes[lote], 'revalidar lote');

    if (this.Productos[producto].Lotes[lote].Lote.length < 4) {

      let swal = {
        icon: "error",
        title: "Error en Lote",
        text: "La longitud del Lote debe ser mayor o igual a tres letras"
      };
      this._swalService.show(swal);
      this.Productos[producto].Lotes[lote].Lote = '';
    } else {
      this.Productos[producto].Lotes[lote].Lote = this.Productos[producto].Lotes[lote].Lote.trim();
      this.Productos[producto].Lotes[lote].Lote = this.Productos[producto].Lotes[lote].Lote.toUpperCase();
      console.log('Lote ok');



      return false;

    }


  }
  reValidarCantidad(producto, lote) {
    console.log(this.Productos[producto].Lotes[lote], 'revalidar cantiadad');
    //si en la lista de Lotes solo existe uno (el de ingresar nuevo ) no deja guardar lotes, debe ser agregado previamente a la lista pasando todas las validaciones
    if (this.Productos[producto].Lotes[lote].Codigo == 'Ingresa uno Nuevo ->' && this.Productos[producto].Lotes[lote].Cantidad_Encontrada == 0) {
      console.log('es uno nuevo', this.Productos[producto].Lotes[lote]);
      let swal = {
        icon: "error",
        title: "Hay un error  ",
        text: "Los lotes nuevos deben ser mayor a 0, Por favor revise"
      };
      this._swalService.show(swal);

      return false

    }
    //antes de pasar a agregar a fila y guardar debemos verificar si todos los campos anteriores no están vacios
    let cantidad = (this.Productos[producto].Lotes[lote].Cantidad_Encontrada).toString();
    if (cantidad == '' || this.Productos[producto].Lotes[lote].Fecha_Vencimiento == '' || this.Productos[producto].Lotes[lote].Lote == '') {
      let swal = {
        icon: "error",
        title: "Hay un error  ",
        text: "Debe agregar todos los campos , por favor revise "
      };
      this._swalService.show(swal);
      return false
    }
    //si todo sale bien verifica si exite en la fila previamente
    console.log(' cantidad correcta');

    this.reVerificarSiExisteEnFila(producto, lote);

  }

  reVerificarSiExisteEnFila(producto, lote) {


    //verificamos antes de agregar a la fila si existe un lote agregado al mismo producto

    //si solo hay un lote quiere decir que es el de insertar, entonces no es necesario hacer la verificación
    if (this.Productos[producto].Lotes.length > 1) {


      //recorremos los lotes menos el último que es el de insertar buscando coincidencias si la encuentra mande un mensaje de error!
      for (let index = 0; index < this.Productos[producto].Lotes.length - 1; index++) {

        //SI el producto con el lote correspondiente es
        if (this.Productos[producto].Lotes[lote].Lote == this.Productos[producto].Lotes[index].Lote && this.Productos[producto].Lotes[lote] != this.Productos[producto].Lotes[index]) {

          this.Productos[producto].Lotes[lote].Lote = '';
          this.Productos[producto].Lotes[lote].Fecha_Vencimiento = '';
          this.Productos[producto].Lotes[lote].Cantidad_Encontrada = '';
          console.log('encontre coincidencias', this.Productos[producto].Lotes[index].Lote);
          let swal = {
            icon: "error",
            title: "Error en referencia del Lote",
            text: "Existe un Lote del mismo producto agregado , Por Favor Revise "
          };
          this._swalService.show(swal);
          return false

        }
      };

    }
    //si no encotró coincidencia agregue a la fila
    this.addLote(producto, lote);
  }

  reGuardarLotes() {
    let productos = JSON.stringify(this.Productos);
    let datos = new FormData();
    datos.append("Id_Doc_Inventario_Fisico", this.Model["Id_Doc_Inventario_Fisico"]);
    datos.append("Productos", productos);
    console.log(datos, 'prueba datos');
    this.inventariofisico.saveLote(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this._swalService.show(data);
        this.Cargado = false;
        // localStorage.setItem("ProductosInventario", this._generalService.normalize(JSON.stringify(this.Productos)));
      } else {
        this._swalService.show(data);
      }
    });
  }

  AjustarInventario() {
    for (let producto = 0; producto < this.Productos.length; producto++) {

      for (let lote = 0; lote < this.Productos[producto]['Lotes'].length; lote++) {
        if (this.Productos[producto]['Lotes'][lote]['AgregarLote'] == 'block') {
          let swal = {
            icon: "error",
            title: "Error Lotes editables",
            text: "Existen lotes en edición y deben ser agregados, Por Favor Revise "
          };
          this._swalService.show(swal);
          return false
        }

      }

    }

    let productos = functionsUtils.normalize(JSON.stringify(this.Productos));
    let datos = new FormData();
    datos.append("Id_Doc_Inventario_Fisico", this.Model["Id_Doc_Inventario_Fisico"]);
    datos.append("productos", productos);

    this.AjustarInventarioEstiba(datos).subscribe((data: any) => {
      if (data.tipo == 'success') {
        this.respuestaGuardarOk.title = data.titulo;
        this.respuestaGuardarOk.text = data.mensaje;
        this.respuestaGuardarOk.icon = 'success';
        this.respuestaGuardarOk.fire();

      } else {
        this.respuestaGuardarError.title = data.titulo;
        this.respuestaGuardarError.text = data.mensaje;
        this.respuestaGuardarError.icon = 'error';
        this.respuestaGuardarError.fire();
      }

    });
  }


  AjustarInventarioEstiba(data: FormData){
    return this.http.post(environment.ruta + 'php/inventariofisico/estiba/ajustar_inventario.php', data);
  }

  guardarGeneral(tipo_accion) {


    for (let producto = 0; producto < this.Productos.length; producto++) {

      for (let lote = 0; lote < this.Productos[producto]['Lotes'].length; lote++) {
        if (this.Productos[producto]['Lotes'][lote]['AgregarLote'] == 'block') {
          let swal = {
            icon: "error",
            title: "Error Lotes editables",
            text: "Existen lotes en edición y deben ser agregados, Por Favor Revise "
          };
          this._swalService.show(swal);
          return false
        }

      }

    }


    let datos = new FormData();

    datos.append("Id_Doc_Inventario_Fisico", this.Model["Id_Doc_Inventario_Fisico"]);
    datos.append("tipo_accion", tipo_accion);
    this.GestionarEstado(datos).subscribe((data: any) => {

      if (data.tipo == 'success') {

        this.respuestaGuardarOk.title = data.titulo;
        this.respuestaGuardarOk.text = data.mensaje;
        this.respuestaGuardarOk.icon = 'success';

        this.respuestaGuardarOk.fire();

      } else {
        this.respuestaGuardarError.title = data.titulo;
        this.respuestaGuardarError.text = data.mensaje;
        this.respuestaGuardarError.icon = 'error';
        this.respuestaGuardarError.fire();
      }


    });


  }

  GestionarEstado(data:FormData){
    return this.http.post(environment.ruta + 'php/inventariofisico/estiba/gestion_de_estado.php', data);
  }

  actualizarProductos() {

  }

}
