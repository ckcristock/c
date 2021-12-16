import { Component, OnInit, ViewChild } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-comprobanteingresocrear',
  templateUrl: './comprobanteingresocrear.component.html',
  styleUrls: ['./comprobanteingresocrear.component.scss']
})
export class ComprobanteingresocrearComponent implements OnInit {

  public alertOption:SweetAlertOptions = {};
  public Cargando:boolean = false;

  public datosCabecera:any = {
    Titulo: 'Nuevo Recibo de Caja',
    Fecha: new Date(),
    Codigo: ''
  }

  @ViewChild('FormComprobante') FormComprobante: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  public fecha=new Date();
  public Fecha:any = '';
  public display_Banco:string = 'none';
  public Proveedores:any[]=[];
  public Lista_Facturas:any[]=[{
    RetencionesFactura:[],
    DescuentosFactura:[]
  }];
  public Archivo:any;
  public Fecha_Comprobante= this.fechaHoy();
  public Id_Proveedor: any = '';
  public NombreProveedor: string = '';
  public Nom_Cliente:any;
  public Id_Cliente = '';
  public Cliente = [];
  // public Funcionario=JSON.parse(localStorage.getItem("User"));
  public Cuenta=[];
  public Cuentas: Array<any>;
  public FormaPago:any = [ ];
  public Rentenciones:any[]=[];
  public RentencionesFactura:any[]=[];
  public Categorias:any[]=[{
    Cuenta: '',
    Valor: '',
    Cantidad: '',
    Impuesto: 0,
    Observaciones :'',
    Subtotal :0,
    Total_Impuesto:0
  }];
  public Cuenta_Banco='';
  public Costo_Ingreso = 0;
  public Impuesto_Ingreso = 0;
  public Subtotal_Ingreso =0;
  public Total_Ingreso = 0;
  public Subtotal_Retenciones = 0;
  public Subtotal_Facturas = 0;
  public Total_ValorP = 0;
  public Retenciones_Totales =0;
  public Mostrar:boolean=false;
  public Mostrar_Cliente:boolean=false;
  public Impuesto = 0;
  public reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer_imp = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Total_Impuesto);
  public reducer_ret = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Valor);
  public reducer_desc = (accumulator, currentValue) => accumulator + parseFloat(currentValue.ValorDescuento);
  public reducer_valorp = (accumulator, currentValue) => accumulator + parseFloat(currentValue.ValorIngresado);
  public reducer3 = (accumulator, currentValue) => {
    var acu_iva = 0;
    currentValue.RetencionesFacturas.forEach((v, i)=>{

      acu_iva += isNaN(v.Valor) ? 0 : parseFloat(v.Valor);
    });

    return accumulator + acu_iva;
  };
  ListaRetenciones: any = [];
  ListaFact:any = [];
  Total_Facturas: number = 0;
  Mostrar_Opciones: boolean = true;
  Mostrar_Input_Cli: boolean = true;
  public Facturas_Multiple:boolean=true;
  public Faltantes:any=[];
  public Valor_Banco:number = 0;
  public Total_Debito:number = 0;
  public Total_Credito:number = 0;
  public Valor_Devoluciones:number = 0;

  constructor( private route: ActivatedRoute, private http: HttpClient, private router: Router, private _swalService:SwalService) {

    let queryParams = this.route.snapshot.queryParams;


    if (queryParams.facturas != undefined && queryParams.cliente != undefined) {

      this.Id_Cliente = queryParams.cliente;
      this.Cargando = true;
      this.Mostrar_Opciones = false;
      this.Mostrar_Cliente = true;
      this.http.get(environment.ruta + 'php/comprobantes/facturas_seleccionadas_cliente.php',{ params: queryParams }).subscribe((data: any) => {
        this.Mostrar = false;
        this.Cargando = false;
        this.Mostrar_Input_Cli = false;

        this.Lista_Facturas = data.Facturas;
        this.Nom_Cliente = data.Cliente.Nombre;
      });
    }

    this.http.get(environment.ruta + 'php/contabilidad/proveedor_buscar.php').subscribe((data: any) => {
      this.Proveedores = data;
    });
    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a Guardar este Comprobante",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      // type: 'info',
      input: 'select',
      inputOptions: {
        Pcga: 'Imprimir en PCGA',
        Niif: 'Imprimir en NIIF'
      },
      preConfirm: (value) => {
        return new Promise((resolve) => {
          this.guardarComprobante(this.FormComprobante, value);
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }
  }
  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    map(term => term.length < 4 ? []
      : this.Cliente.filter(v => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
  );
    formatter = (x: { Nombre: string }) => x.Nombre;

    search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Cuenta.filter(v => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
    );
formatter1 = (x: { Codigo: string }) => x.Codigo;
    ngOnInit() {
      this.http.get(environment.ruta + 'php/comprobantes/lista_cliente.php').subscribe((data: any) => {
        this.Cliente = data;
      });
      this.http.get(environment.ruta + 'php/comprobantes/cuentas.php').subscribe((data: any) => {
        this.Cuentas = data;
      });
      this.http.get(environment.ruta + 'php/comprobantes/formas_pago.php').subscribe((data: any) => {
        this.FormaPago = data;
      });
      this.http.get(environment.ruta + 'php/comprobantes/lista_cuentas.php').subscribe((data: any) => {
        this.Cuenta = data.Activo;
      });
      this.http.get(environment.ruta + 'php/lista_generales.php', { params: { modulo: 'Impuesto' } }).subscribe((data: any) => {
        this.Impuesto = data;
      });

      this.ListarRetenciones();

      this.getCodigoIngreso();

    }
  BuscarProveedor(modelo) {
    this.NombreProveedor = modelo.Proveedores;
    this.Id_Proveedor = modelo.Id_Proveedor;
  }

  BuscarDatosCliente(cliente) {
    this.Id_Cliente=cliente.Id_Cliente;
    this.ListaFact = [];

    if (this.Mostrar_Cliente) {
      if (this.Id_Cliente != undefined) {
        this.MostarContenido('Si');
      }
    }


  }
  MostarContenido(tipo){

    if(tipo=='Si'){
      this.Mostrar=false;
      if(this.Id_Cliente!=''){
        this.Cargando = true;
        this.http.get(environment.ruta + 'php/comprobantes/lista_facturas_clientes.php?id=' + this.Id_Cliente).subscribe((data: any) => {

          if (data.Facturas.length > 0) {
            this.Lista_Facturas = data.Facturas;
            this.Mostrar_Cliente=true;
          } else {
            this.confirmacionSwal.title = "Sin Facturas!";
            this.confirmacionSwal.text = `${this.Nom_Cliente.Nombre} no tiene facturas asociadas.`;
            this.confirmacionSwal.type = "info";
            this.confirmacionSwal.show();
            $('input[type=radio]').prop('checked', false);
          }

          this.Cargando = false;
        });
      } else {
        this.confirmacionSwal.title = "Faltan datos!";
        this.confirmacionSwal.text = `No se ha seleccionado el Cliente, por favor revisar.`;
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
        $('input[type=radio]').prop('checked', false);
      }

      this.Categorias = [{ // Limpiar cuentas contables.
        Cuenta: '',
        Valor: '',
        Cantidad: '',
        Impuesto: 0,
        Observaciones :'',
        Subtotal :0,
        Total_Impuesto:0
      }];

      this.Rentenciones = []; // Limpiar listado de retenciones.

      this.Total_ValorP = 0;
      this.Subtotal_Facturas = 0;
      this.Retenciones_Totales = 0;

    }else if(tipo=='No'){


      this.Mostrar=true;
      this.Mostrar_Cliente=false;

      this.Lista_Facturas = [];

      this.ListaFact = []

      this.Subtotal_Ingreso = 0;
      this.Impuesto_Ingreso = 0;
      this.Total_Ingreso = 0;
      this.Subtotal_Retenciones = 0;
    }else if('Archivo'){
      if(this.Id_Cliente!='' && (this.Cuenta_Banco)!=''){
        this.Mostrar_Cliente = false;
        this.Lista_Facturas = [];
        this.Mostrar=true;
        this.Facturas_Multiple=false;
      }else{
        this.confirmacionSwal.title = "Faltan datos!";
        this.confirmacionSwal.text = `No se ha seleccionado el Cliente o un banco, por favor revise.`;
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
        $('input[type=radio]').prop('checked', false);
      }
    }
  }

  BuscarCuenta(cuenta, pos){
   let pos2=pos+1;

      this.Categorias[pos].Id_Plan_Cuentas=cuenta.Id_Plan_Cuentas;
      if(cuenta.Id_Plan_Cuentas){
        if (this.Categorias[pos2] == undefined){
          this.Categorias.push({
            Cuenta: '',
            Valor: '',
            Cantidad: '',
            Impuesto: 0,
            Observaciones :'',
            Subtotal :0,
            Total_Impuesto:0
          });
        }
      }

  }

  Calcular(pos, tipo?){

    this.Categorias[pos].Subtotal=this.Categorias[pos].Cantidad*this.Categorias[pos].Valor;
    this.Categorias[pos].Total_Impuesto=(this.Categorias[pos].Cantidad*this.Categorias[pos].Valor)*(this.Categorias[pos].Impuesto/100);
    this.ActualizaValores();
  }

  ActualizaValores(tipo?) {
    if (tipo!=undefined && tipo!=null) {
      this.Retenciones_Totales = this.Lista_Facturas.reduce(this.reducer3, 0);

      setTimeout(() => {
        this.Total_ValorP = parseFloat(this.Lista_Facturas.reduce(this.reducer_valorp, 0));
        this.Subtotal_Facturas =this.Total_ValorP + this.Retenciones_Totales;
        this.Total_Facturas = this.Subtotal_Facturas - this.Retenciones_Totales;

        this.calcularTotalesDebitoCredito();
      }, 300);
    } else {
      this.Subtotal_Ingreso = parseFloat(this.Categorias.reduce(this.reducer, 0));
      this.Impuesto_Ingreso = parseFloat(this.Categorias.reduce(this.reducer_imp, 0));
      this.Total_Ingreso = this.Subtotal_Ingreso+this.Impuesto_Ingreso-this.Subtotal_Retenciones;
      if(this.Rentenciones.length>0){
        this.RecalcularRetenciones();
      }
    }
  }
  RecalcularRetenciones(){
    for (let index = 0; index < this.Rentenciones.length; index++) {

      if (this.Rentenciones[index].Id_Retencion == 12) {
        this.Rentenciones[index].Valor=((parseFloat(this.Rentenciones[index].Porcentaje)/100)*this.Impuesto_Ingreso).toFixed(2);
      } else {
        this.Rentenciones[index].Valor=((parseFloat(this.Rentenciones[index].Porcentaje)/100)*this.Subtotal_Ingreso).toFixed(2);
      }

    }
    setTimeout(() => {
      this.Subtotal_Retenciones = parseFloat(this.Rentenciones.reduce(this.reducer_ret, 0));
      this.ActualizaValores();
    }, 200);

  }
  AgregarRetencion(){
    this.Rentenciones.push({
      Retencion:'',
      Valor:''
    });
  }

  EliminarRetencion(pos){

    this.Rentenciones.splice(pos,1)
    if(this.Rentenciones.length==0){
      this.Subtotal_Retenciones=0;
    }else{
      this.RecalcularRetenciones();
    }

  }
  CalcularRetenciones(pos){

    let posicion=this.ListaRetenciones.findIndex(x=>x.Id_Retencion==this.Rentenciones[pos].Id_Retencion);

    let Id_Retencion = this.Rentenciones[pos].Id_Retencion;

    if (Id_Retencion == 12) {
      this.Rentenciones[pos].Porcentaje=parseFloat(this.ListaRetenciones[posicion].Porcentaje);
      this.Rentenciones[pos].Valor=(parseFloat(this.ListaRetenciones[posicion].Porcentaje)/100)*this.Impuesto_Ingreso;
    } else {
      this.Rentenciones[pos].Porcentaje=parseFloat(this.ListaRetenciones[posicion].Porcentaje);
      this.Rentenciones[pos].Valor=(parseFloat(this.ListaRetenciones[posicion].Porcentaje)/100)*this.Subtotal_Ingreso;
    }

   setTimeout(() => {
     this.RecalcularRetenciones();
   }, 200);

   }
  CalcularRetencionesFacturas(pos, pos2){

    let posicion=this.ListaRetenciones.findIndex(x=>x.Id_Retencion==this.Lista_Facturas[pos].RetencionesFacturas[pos2].Id_Retencion);

    let Tipo_Retencion = this.ListaRetenciones[posicion].Tipo_Retencion;

    this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje=parseFloat(this.ListaRetenciones[posicion].Porcentaje);

    this.Lista_Facturas[pos].RetencionesFacturas[pos2].Tipo=this.ListaRetenciones[posicion].Tipo_Retencion;

    this.Lista_Facturas[pos].RetencionesFacturas[pos2].Id_Plan_Cuenta=this.ListaRetenciones[posicion].Id_Plan_Cuenta;

    let valorRetencion = 0;

    if (Tipo_Retencion == "Iva") {
      valorRetencion = (parseFloat(this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje)/100)*this.Lista_Facturas[pos].Iva;
      this.Lista_Facturas[pos].RetencionesFacturas[pos2].Valor=(Math.round(valorRetencion)).toFixed(2);
    } else {
      valorRetencion = (parseFloat(this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje)/100)*this.Lista_Facturas[pos].Total_Compra;
      this.Lista_Facturas[pos].RetencionesFacturas[pos2].Valor=(Math.round(valorRetencion)).toFixed(2);
    }

    let retencionesFact = 0;

    this.Lista_Facturas[pos].RetencionesFacturas.forEach(e => {

      retencionesFact += Math.round(parseFloat(e.Valor));
    });

    setTimeout(() => {

      // this.Lista_Facturas[pos].ValorIngresado = this.Lista_Facturas[pos].Por_Pagar - retencionesFact;


      this.Retenciones_Totales = this.Lista_Facturas.reduce(this.reducer3, 0);

      this.ActualizaValores('Facturas');
    }, 300);

  }

  AgregarRetencionFactura(pos){
  this.Lista_Facturas[pos].RetencionesFacturas.push({
    Id_Retencion:'',
    Valor:0
  });
  }

  AgregarDescuentoFactura(pos){
    if (this.Lista_Facturas[pos].DescuentosFactura.length < 3) {
      this.Lista_Facturas[pos].DescuentosFactura.push({
        Descuento:'',
        ValorDescuento:0
      });
    } else {
      this.confirmacionSwal.title = 'Advertencia!';
      this.confirmacionSwal.type = 'warning';
      this.confirmacionSwal.text = 'No puedes agregar más descuentos en esta factura.';
      this.confirmacionSwal.show();
    }

  }

  EliminarRetencionFactura(pos,pos2){

    this.restablecerValorFactura(pos,pos2,'Retencion');

    setTimeout(() => {
      this.Lista_Facturas[pos].RetencionesFacturas.splice(pos2,1);
      this.Retenciones_Totales = this.Lista_Facturas.reduce(this.reducer3, 0);

      this.ActualizaValores('Facturas');
    }, 100);

  }

  EliminarDescuentoFactura(pos,pos2){

    this.restablecerValorFactura(pos,pos2, 'Descuento');

    setTimeout(() => {

      this.Lista_Facturas[pos].DescuentosFactura.splice(pos2,1);

      this.ActualizaValores('Facturas');
      (document.getElementById('botondescuentos'+pos) as HTMLElement).style.display = 'block';
    }, 100);

  }

  restablecerValorFactura(pos,pos2, tipo) {

    if (tipo == 'Retencion') {
      let posicion=this.ListaRetenciones.findIndex(x=>x.Id_Retencion==this.Lista_Facturas[pos].RetencionesFacturas[pos2].Id_Retencion);

      let Tipo_Retencion = this.ListaRetenciones[posicion].Tipo_Retencion;

      this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje=parseFloat(this.ListaRetenciones[posicion].Porcentaje);

      let valorRetencion = 0;

      if (Tipo_Retencion == "Iva") {
        valorRetencion = (parseFloat(this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje)/100)*this.Lista_Facturas[pos].Iva;
        this.Lista_Facturas[pos].RetencionesFacturas[pos2].Valor=(Math.round(valorRetencion)).toFixed(2);
      } else {
        valorRetencion = (parseFloat(this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje)/100)*this.Lista_Facturas[pos].Total_Compra;
        this.Lista_Facturas[pos].RetencionesFacturas[pos2].Valor=(Math.round(valorRetencion)).toFixed(2);
      }

      // this.Lista_Facturas[pos].ValorIngresado += Math.round(valorRetencion);
    } else if (tipo == 'Descuento') {
      let valorDescuento = parseFloat(this.Lista_Facturas[pos].DescuentosFactura[pos2].ValorDescuento);

      this.Lista_Facturas[pos].ValorIngresado = parseFloat(this.Lista_Facturas[pos].ValorIngresado) + Math.round(valorDescuento);
    }
  }

  ListarRetenciones() {

    this.http.get(environment.ruta+'php/contabilidad/lista_retenciones.php').subscribe((data:any)=>{
      this.ListaRetenciones = data;
    })

  }

  listaFacturas(fact,pos) {

    let exist_fact = this.ListaFact.indexOf(fact);
    let CodigoFactura = this.Lista_Facturas[pos].Codigo;

    if (exist_fact < 0) {
      this.ListaFact.push(fact);

      this.Lista_Facturas[pos].ValorIngresado = this.Lista_Facturas[pos].Por_Pagar;

      let esNotaC = this.esNotaCredito(CodigoFactura);

      if (!esNotaC) { // Si no es una nota credito, habilito estos campos.
        (document.getElementById('ValorIngresado'+pos) as HTMLInputElement).readOnly = false;
        (document.getElementById('MayorPagar'+pos) as HTMLInputElement).readOnly = false;
        (document.getElementById('ValorMayorPagar'+pos) as HTMLInputElement).readOnly = false;
        (document.getElementById('botonretencion'+pos) as HTMLInputElement).style.display = 'block';
        (document.getElementById('botondescuentos'+pos) as HTMLInputElement).style.display = 'block';
      } else {
        this.Valor_Devoluciones += parseFloat( this.Lista_Facturas[pos].ValorIngresado);
      }

    } else {
      this.ListaFact.splice(exist_fact,1);
      (document.getElementById('ValorIngresado'+pos) as HTMLInputElement).readOnly = true;
      (document.getElementById('MayorPagar'+pos) as HTMLInputElement).readOnly = true;
      (document.getElementById('ValorMayorPagar'+pos) as HTMLInputElement).readOnly = true;
      (document.getElementById('botonretencion'+pos) as HTMLInputElement).style.display = 'none';
      (document.getElementById('botondescuentos'+pos) as HTMLInputElement).style.display = 'none';

      let esNotaC = this.esNotaCredito(CodigoFactura);

      if (esNotaC) {
        this.Valor_Devoluciones -= parseFloat(this.Lista_Facturas[pos].ValorIngresado);
      }

      this.Lista_Facturas[pos].RetencionesFacturas = [];
      this.Lista_Facturas[pos].Id_Cuenta_Descuento = 0;
      this.Lista_Facturas[pos].Id_Cuenta_MayorPagar = 0;
      this.Lista_Facturas[pos].Descuento = '';
      this.Lista_Facturas[pos].ValorDescuento = 0;
      this.Lista_Facturas[pos].MayorPagar = '';
      this.Lista_Facturas[pos].ValorMayorPagar = 0;
      this.Lista_Facturas[pos].ValorIngresado = 0;

    }

    setTimeout(() => {
      this.ActualizaValores('Facturas');
    }, 100);
  }

  esNotaCredito(codigo_factura) {
    let res = codigo_factura.indexOf('NC');

    if (res < 0) {
      return false;
    }

    return true;
  }

  guardarComprobante(Formulario:NgForm, tipo) {

    let info = JSON.stringify(Formulario.value);

    let datos = new FormData();

    datos.append('Datos', info);
    datos.append('Facturas', JSON.stringify(this.ListaFact));
    datos.append('Categorias', JSON.stringify(this.Categorias));
    datos.append('Retenciones', JSON.stringify(this.Rentenciones));

    this.http.post(environment.ruta+'php/comprobantes/guardar_comprobante.php', datos).subscribe((data:any)=>{

      this.confirmacionSwal.title =data.titulo;
      this.confirmacionSwal.text = data.mensaje;
      this.confirmacionSwal.type = data.tipo;
      this.confirmacionSwal.show();

      if (data.tipo == 'success' && data.id != undefined) {
        window.open(environment.ruta+'php/comprobantes/comprobantes_pdf.php?id='+data.id+'&tipo='+Formulario.value.Tipo,'_blank');
        if (tipo == 'Pcga') {
          window.open(environment.ruta+'php/contabilidad/movimientoscontables/movimientos_comprobante_pdf.php?id_registro='+data.id+'&id_funcionario_elabora='+Formulario.value.Id_Funcionario+'&tipo='+Formulario.value.Tipo,'_blank');
        } else {
          window.open(environment.ruta+'php/contabilidad/movimientoscontables/movimientos_comprobante_pdf.php?id_registro='+data.id+'&id_funcionario_elabora='+Formulario.value.Id_Funcionario+'&tipo_valor=Niif&tipo='+Formulario.value.Tipo,'_blank');
        }

        setTimeout(() => {

          this.router.navigate(['/comprobante/ingresos']);
        }, 1000);
      }

    });

  }

  validarValorFactura(valor, pos) {

    if (parseFloat(valor) > parseFloat(this.Lista_Facturas[pos].Por_Pagar)) {
      this.confirmacionSwal.title ="Error!";
      this.confirmacionSwal.text = "El valor no puede ser superior al valor que se corresponde pagar.";
      this.confirmacionSwal.type = "error";
      this.confirmacionSwal.show();
      this.Lista_Facturas[pos].ValorIngresado = this.Lista_Facturas[pos].Por_Pagar;
    }
  }

  calculosAdicionales(pos, pos2?) {

    let descuento = parseFloat(this.Lista_Facturas[pos].DescuentosFactura.reduce(this.reducer_desc, 0));
    let mayor_pagar = parseFloat(this.Lista_Facturas[pos].ValorMayorPagar);
    let retenciones = parseFloat(this.Lista_Facturas[pos].RetencionesFacturas.reduce(this.reducer_ret, 0));
    this.Lista_Facturas[pos].ValorDescuento = descuento;

    // this.Lista_Facturas[pos].ValorIngresado = Math.round(parseFloat(this.Lista_Facturas[pos].Por_Pagar));

    setTimeout(() => {
      this.ActualizaValores('Facturas');
    }, 100);

  }

  AgregarCampos(pos,modelo,tipo,pos2?){
    if(tipo=='Descuento'){
      this.Lista_Facturas[pos].DescuentosFactura[pos2].Id_Cuenta_Descuento=modelo.Id_Plan_Cuentas;
    }else if(tipo=='MayorPagar'){
      this.Lista_Facturas[pos].Id_Cuenta_MayorPagar=modelo.Id_Plan_Cuentas;
    }
  }

  fechaHoy(){
    let fecha:any = new Date();
    fecha = (fecha.toISOString()).split('T')[0];

    return fecha
  }
  CargarArchivo(event){
    if (event.target.files.length === 1) {
        this.Archivo = event.target.files[0];
        this.EnviarArchivo();
    }
  }
  EnviarArchivo(){
    this.Cargando=true;
    this.Facturas_Multiple=false;
    let datos = new FormData();
    datos.append('archivo', this.Archivo);
    this.http.post(environment.ruta + 'php/comprobantes/subir_facturas.php', datos).subscribe((data:any)=>{
      this.ListaFact=data.Facturas;
      this.Lista_Facturas=data.Facturas;
      this.Faltantes=data.Faltantes;
      this.Cargando=false;
      this.ListaFact.length

      setTimeout(() => {
        this.Retenciones_Totales = this.Lista_Facturas.reduce(this.reducer3, 0);
        this.ActualizaValores('Facturas')
      }, 300);
    }, error => {
      this.Cargando = false;
      this.confirmacionSwal.title = "Oops!";
      this.confirmacionSwal.text = "Se perdió la conexión a internet. Por favor vuelve a intentarlo.";
      this.confirmacionSwal.type = "warning";
      this.confirmacionSwal.show();
    })
  }

  calcularTotalesDebitoCredito() {
    let total_descuento = 0;
    let total_ajustes = 0;
    this.Lista_Facturas.forEach((val, pos) => {
      total_descuento += parseFloat(this.Lista_Facturas[pos].DescuentosFactura.reduce(this.reducer_desc, 0));
      total_ajustes += isNaN(this.Lista_Facturas[pos].ValorMayorPagar) ? 0 : parseFloat(this.Lista_Facturas[pos].ValorMayorPagar);
    });
    this.Total_Debito = this.Valor_Banco + this.Retenciones_Totales + total_descuento + this.Valor_Devoluciones;
    this.Total_Credito = total_ajustes + (this.Total_ValorP - this.Valor_Devoluciones);
  }

  validarCampo(campo, event, tipo) { // Funcion que validará los campos de typeahead
    if (typeof(campo) != 'object' && campo != '') {
      let id = event.target.id;
      (document.getElementById(id) as HTMLInputElement).focus();
      let swal = {
        codigo: 'error',
        titulo: 'Incorrecto!',
        mensaje: `El valor ${tipo} no es valido.`
      };
      this._swalService.ShowMessage(swal);
    }
  }

  getCodigoIngreso(fecha?:string) {

    let datos:any = {Tipo:'Ingreso'};

    if (fecha != undefined && fecha != null) {
      datos.Fecha = fecha;
    }

    this.http.get(environment.ruta+'php/comprobantes/get_codigo.php', {params: datos}).subscribe((data:any) => {
      this.datosCabecera.Codigo = data.consecutivo;
    })
  }

}
