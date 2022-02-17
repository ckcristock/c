import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyDrpOptions } from 'mydaterangepicker';
import { SweetAlertOptions } from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.scss']
})
export class IngresosComponent implements OnInit {

  @ViewChild('modalNuevoComprobante') modalNuevoComprobante: any;
  @ViewChild('modalVerComprobante') modalVerComprobante: any;
  @ViewChild('alertSwal') alertSwal: any;
  envirom: any;
  myDateRangePickerOptions: IMyDrpOptions = {
    width:'180px', 
    height: '21px',
    selectBeginDateTxt:'Inicio',
    selectEndDateTxt:'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  public Archivos: any[] = [];
  public Clientes:any = [
    {Id_Cliente: 1, Nombre_Cliente:'Kendry Ortiz'},
    {Id_Cliente: 2, Nombre_Cliente:'Pedro Castillo'},
    {Id_Cliente: 3, Nombre_Cliente:'Franklin Guerra'},
    {Id_Cliente: 4, Nombre_Cliente:'Augusto Carrillo'}
  ];

  public Bancos:any = [];

  public FormaPago:any = [ ];

  public Comprobantes:any = [
  ];

  public CuentasContables:any = [
    {id_Cuenta: 1, Nro_Cuenta: '12546328'},
    {id_Cuenta: 2, Nro_Cuenta: '6591316'},
    {id_Cuenta: 3, Nro_Cuenta: '516135468'}
  ];

  public ComprobanteModel:any = {
    Codigo: '', 
    Concepto: '', 
    Fecha: '', 
    Cliente: '', 
    Forma_Pago:'', 
    Valor:'', 
    Banco:'',
    Soporte:'CuentasContables'
  };
  public Cliente = [];
  public Cuenta=[];
  public Cuenta_Pasivos=[];
  public Id_Cliente = '';
  public Nom_Cliente = '';
  public Cuenta_Deb='';
  public Cuenta_Acred='';
  public Id_Cuenta_Acredita='';
  public Id_Cuenta_Debita='';
  public Tipo='Ingreso';
  public boolVal:boolean = false;
  public Funcionario=JSON.parse(localStorage.getItem("User"));
  public perfilUsuario = localStorage.getItem('miPerfil');
  public Comprobante:any={};

  public filtro_cod:string='';
  public filtro_cli:string='';
  public filtro_tipo:string='';
  public filtro_fecha:any='';
  public page = 1;
  public maxSize = 10;
  public TotalItems:number;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  Soporte: any;
  IdDocumento: string = '';
  // id_funcionario: any = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
  alertOption: SweetAlertOptions;

  public filtro:any = {
    codigo: '',
    fechas: '',
    cliente: '',
    estado: ''
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location, private swalService: SwalService) {
    this.ListarComprobantes();

    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a Anular este Documento",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Anular',
      showLoaderOnConfirm: true,
      focusCancel: true,
      // type: 'warning',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.anularDocumento();
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
  search2 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Cuenta_Pasivos.filter(v => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
    );
  formatter2 = (x: { Codigo: string }) => x.Codigo;
  ngOnInit() {
    this.envirom = environment;
    this.http.get(environment.ruta + 'php/comprobantes/lista_cliente.php').subscribe((data: any) => {
      this.Cliente = data;
    });
    this.http.get(environment.ruta + 'php/comprobantes/lista_cuentas.php').subscribe((data: any) => {
      this.Cuenta = data.Activo;
      this.Cuenta_Pasivos=data.Pasivo;
    });
   
    this.http.get(environment.ruta + 'php/comprobantes/lista_bancos.php').subscribe((data: any) => {
      this.Bancos = data;
    });
    this.http.get(environment.ruta + 'php/comprobantes/formas_pago.php').subscribe((data: any) => {
      this.FormaPago = data;
    });
  }
ListarComprobantes(){
  this.http.get(environment.ruta + 'php/comprobantes/lista_comprobantes.php',{params:{tipo_comprobante:'ingreso'}}).subscribe((data: any) => {
    this.Comprobantes = data.Lista;
    this.TotalItems = data.numReg;
  });
}
dateRangeChanged(event) {
    
  if (event.formatted != "") {
    this.filtro.fechas = event.formatted;
  } else {
    this.filtro.fechas = '';
  }

  setTimeout(() => {
    this.filtros();
  }, 100);
}

pagination() {
  let queryString = this.getQueryString(true);

  this.location.replaceState('/comprobante/ingresos', queryString);

  
  this.http.get(environment.ruta + 'php/comprobantes/lista_comprobantes.php'+queryString).subscribe((data: any) => {
    this.Comprobantes = data.Lista;
    this.TotalItems = data.numReg;
  });
}
AbrirModalNuevoComprobante(){
    this.modalNuevoComprobante.show();
  }

  filtros(pagination:boolean = false){

    let queryString = this.getQueryString(pagination);

    this.location.replaceState('/comprobantes/ingresos', queryString);

    
    this.http.get(environment.ruta + 'php/comprobantes/lista_comprobantes.php'+queryString).subscribe((data: any) => {
      this.Comprobantes = data.Lista;
      this.TotalItems = data.numReg;

    });
    
  }
  getQueryString(pagination:boolean = false) {

    let params:any = {
      tipo_comprobante: 'ingreso'
    };
    let queryString = '';

    if (!pagination) {
      this.page = 1;
    } 
    
    params.pag = this.page;
    
    if (this.filtro.cliente != "") {
      params.cli = this.filtro.cliente;
    }
    if (this.filtro.fechas != "") {
      params.fecha = this.filtro.fechas;
    }
    if (this.filtro.codigo != "") {
      params.cod = this.filtro.codigo;
    }
    if (this.filtro.estado != "") {
      params.est = this.filtro.estado;
    }

    queryString = '?'+ Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
    
    }

    Archivo(event){
      if (event.target.files.length === 1) {
        this.Soporte = event.target.files[0];
      } 
    }

  GuardarComprobante(formulario: NgForm, modal:any) {
    
    let datos = new FormData();
    let info=this.normalize(JSON.stringify(formulario.value))
    datos.append("Datos", info);
    datos.append("Archivo", this.Soporte);
    this.http.post(environment.ruta + 'php/comprobantes/guardar_comprobante.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = 'Operación Exitosa';
      this.confirmacionSwal.html = data.mensaje;
      this.confirmacionSwal.type = data.tipo;
      this.confirmacionSwal.show();   
      formulario.reset();

      this.ListarComprobantes();
 
    });

  
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
      this.alertSwal.type = tipo;
      this.alertSwal.title = titulo;
      this.alertSwal.text = msg;
      this.alertSwal.show();
  }

  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();

  ArmarComprobante(comprobanteObject:any){
    let comprobante = {
      Codigo: comprobanteObject.Codigo, 
      Concepto: comprobanteObject.Concepto, 
      Fecha: comprobanteObject.Fecha, 
      Cliente: comprobanteObject.Cliente, 
      Forma_Pago: comprobanteObject.Forma_Pago, 
      Valor: comprobanteObject.Valor, 
      Banco: comprobanteObject.Banco
    };

    return comprobante;
  }

  LimpiarModelo(){
    this.ComprobanteModel = {
      Codigo: '', 
      Concepto: '', 
      Fecha: '', 
      Cliente: '', 
      Forma_Pago:'', 
      Valor:'', 
      Banco:'',
      Cuenta_Debita: '',
      Cuenta_Acredita: ''
    };
  }

  MostrarBanco(){
    // console.log(this.ComprobanteModel.Forma_Pago);
    
    if(this.ComprobanteModel.Forma_Pago == '4' || this.ComprobanteModel.Forma_Pago == ''){
      this.boolVal = false;
    }else{
      this.boolVal = true;
    }
  }

  CargaArchivo(event, i) {
    if (event.target.files.length === 1) {
      if (this.Archivos[i] !== 'undefined') {
        this.Archivos[i] = event.target.files[0];
      } else {
        this.Archivos.push(event.target.files[0]);
      }
      // this.Soportes[i].NomArchivo = event.target.files[0].name;

    }
  }

  BuscarDatosCliente(cliente) {
    this.Id_Cliente=cliente.Id_Cliente;
  }

  BuscarCuenta(cuenta,tipo){
    switch (tipo) {
      case 'Credita':
        this.Id_Cuenta_Acredita=cuenta.Id_Plan_Cuentas;
        break;
      case 'Debita':
        this.Id_Cuenta_Debita=cuenta.Id_Plan_Cuentas;
        break;
    
      
    }
  }
  VerComprobante(id){
    this.http.get(environment.ruta + 'php/comprobantes/detalle_comprobante.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      this.Comprobante=data;
      this.modalVerComprobante.show();
    });
  }

  anularDocumento() {
    let datos:any = {
      Id_Registro: this.IdDocumento,
      Tipo: 'Recibos_Caja',
      // Identificacion_Funcionario: this.id_funcionario
    }

    this.AnularDocumentoContable(datos).subscribe((data:any) => {
      let swal = {
        codigo: data.tipo,
        titulo: data.titulo,
        mensaje: data.mensaje
      };
      this.swalService.ShowMessage(swal);

      this.ListarComprobantes();
    }, error => {
      let swal = {
        codigo: 'warning',
        titulo: 'Oops!',
        mensaje: 'Lamentablemente se ha perdido la conexión a internet. Por favor vuelve a intentarlo.'
      };
      this.swalService.ShowMessage(swal);
    });
    
  }

  public AnularDocumentoContable(datos) {
    let info = JSON.stringify(datos);

    let data = new FormData();
    data.append('datos', info);

    return this.http.post(environment.ruta+'php/contabilidad/anular_documento.php', data);
  }

}
