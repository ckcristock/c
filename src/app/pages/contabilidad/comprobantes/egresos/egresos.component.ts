import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyDrpOptions } from 'mydaterangepicker';
import { SweetAlertOptions } from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CentroCostosService } from '../../centro-costos/centro-costos.service';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.scss']
})
export class EgresosComponent implements OnInit {

  public fecha=new Date();
  public Proveedores:any[]=[];
  public Id_Proveedor: any = '';
  public NombreProveedor: string = '';
  public IdDocumento:string = '';
  
    //Nuevas variables
    @ViewChild('modalNuevoComprobante') modalNuevoComprobante: any;
    @ViewChild('modalVerComprobante') modalVerComprobante: any;
    @ViewChild('alertSwal') alertSwal: any;
    myDateRangePickerOptions: IMyDrpOptions = {
      width:'180px', 
      height: '21px',
      selectBeginDateTxt:'Inicio',
      selectEndDateTxt:'Fin',
      selectionTxtFontSize: '10px',
      dateFormat: 'yyyy-mm-dd',
    };
  
    // private id_funcionario = JSON.parse(localStorage.getItem("User")).Identificacion_Funcionario;
  
    public Clientes:any = [
      {Id_Cliente: 1, Nombre_Cliente:'Kendry Ortiz'},
      {Id_Cliente: 2, Nombre_Cliente:'Pedro Castillo'},
      {Id_Cliente: 3, Nombre_Cliente:'Franklin Guerra'},
      {Id_Cliente: 4, Nombre_Cliente:'Augusto Carrillo'}
    ];
  
    public Bancos:any = [];
  
    public FormaPago:any = [];
  
    public Comprobantes:any = [];
  
    public ComprobanteModel:any = {
      Nro_Referencia: '', 
      Concepto: '', 
      Fecha_Comprobante: '', 
      Id_Cliente: 0,
      Id_Proveedor: '', 
      Id_Forma_Pago:'', 
      Monto:'', 
      Id_Banco:'',
      Id_Cuenta_Acredita: 0,
      Id_Cuenta_Debita: 0,
      Observaciones: '',
      // Id_Funcionario: this.id_funcionario,
      Tipo:'Egreso'
    };
  
    private requiredParams:any = {tipo_comprobante: 'egreso'};
  
    public Soporte:any = [];
  
    public ClientesFiltrar = [];
    public NombreCliente = '';
  
    public CuentasActivos = [];
    public CuentasPasivos = [];
    public NombreCodigoCuenta = '';
    public NombreCodigoCuenta2 = '';
  
    public BancosFiltrar:any = [];
    public FormasPagoFiltrar:any = [];
  
    public Archivos: any[] = [];
  
    //Paginación
    public maxSize = 5;
    public pageSize = 20;
    public TotalItems:number;
    public page = 1;
    public InformacionPaginacion:any = {
      desde: 0,
      hasta: 0,
      total: 0
    }
  
    //Variables para filtros
    public filtro_empresa:any = '';
    public filtro_codigo:any = '';
    public filtro_fecha:any = '';
    public filtro_tipo:any = '';
    public filtro_cliente:any = '';
    public filtro_cheque:any = '';
    public alertOption:SweetAlertOptions = {};
    perfilUsuario:any = localStorage.getItem('miPerfil');
  
    //ComprobanteVer
    public Comprobante:any = {};
    filtro_estado: string = '';
    enviromen:any;
    companies:any[] = [];
  constructor( private route: ActivatedRoute, 
                private http: HttpClient, 
                private router: Router, 
                private location: Location,
                private swalService: SwalService,
                private _company: CentroCostosService  
              ) { 
    this.http.get(environment.ruta + 'php/contabilidad/proveedor_buscar.php').subscribe((data: any) => {
      this.Proveedores = data;
    });
  
    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a Anular este Documento",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Anular',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'warning',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.anularDocumento();
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }
  }
  
  //BUSQUEDA CLIENTE
  search = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(term => term.length < 4 ? []
          : this.ClientesFiltrar.filter(v => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
      );
  formatter = (x: { Nombre: string }) => x.Nombre;
  
  //BUSQUEDA CUENTAS ACTIVO
  searchCuenta = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(term => term.length < 4 ? []
          : this.CuentasActivos.filter(v => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
      );
  formatterCuenta = (x: { Codigo: string }) => x.Codigo;
  
  //BUSQUEDA CUENTAS PASIVO
  searchCuentaP = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(term => term.length < 4 ? []
          : this.CuentasPasivos.filter(v => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
      );
  formatterCuentaP = (x: { Codigo: string }) => x.Codigo;
  
    search2 = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(term => term.length < 4 ? []
          : this.Proveedores.filter(v => v.NombreProveedor.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      );
    formatter2 = (x: { NombreProveedor: string }) => x.NombreProveedor;
  
    ngOnInit() {
      this.enviromen = environment
      this.ListarComprobantes();
  
      this.http.get(environment.ruta + 'php/comprobantes/lista_proveedores.php').subscribe((data: any) => {
        this.ClientesFiltrar = data;
      });
  
      this.http.get(environment.ruta + 'php/comprobantes/lista_cuentas.php').subscribe((data: any) => {
        this.CuentasActivos = data.Activo;
        this.CuentasPasivos = data.Pasivo;
      });
  
      this.http.get(environment.ruta + 'php/comprobantes/lista_bancos.php').subscribe((data: any) => {
        this.Bancos = data;
      });
  
      this.http.get(environment.ruta + 'php/comprobantes/formas_pago.php').subscribe((data: any) => {
        this.FormaPago = data;
      });
  
      this.RecargarDatos();
      // this.listarEmpresas();
    }
/* 
    listarEmpresas(){
      this._company.getCompanies().subscribe((data:any) => {
        this.companies = data.data;
      })
    } */
  
    BuscarProveedor(modelo) {
      this.NombreProveedor = modelo.Proveedores;
      this.Id_Proveedor = modelo.Id_Proveedor;
    }
  
    AbrirModalNuevoComprobante(){
      this.modalNuevoComprobante.show();
    }
  
    ListarComprobantes(){
      this.http.get(environment.ruta + 'php/comprobantes/lista_egresos.php').subscribe((data: any) => {
        this.Comprobantes = data.Lista;
        this.TotalItems = data.numReg;      
      });
    }
  
    GuardarComprobante(formulario: NgForm, modal:any) {  
  
      let datos = new FormData();
      let data = this.normalize(JSON.stringify(this.ComprobanteModel));
      datos.append("Datos", data);
      datos.append("Archivo", this.Soporte);
      
      // console.log(data);
      //return;
      //this.Comprobantes.push(data);
      this.PeticionGuardarComprobante(datos);
      modal.hide();
      this.LimpiarModelo();
  
      setTimeout(()=>{
        this.ListarComprobantes();
      }, 1000);
      
    }
  
    ShowSwal(tipo, titulo:string, msg:string){
      this.alertSwal.icon = tipo;
      this.alertSwal.title = titulo;
      this.alertSwal.text = msg;
      this.alertSwal.fire();
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
        Nro_Referencia: '', 
        Concepto: '', 
        Fecha_Comprobante: '', 
        Id_Cliente: '', 
        Id_Forma_Pago:'', 
        Monto:'', 
        Id_Banco:'',
        Id_Cuenta_Acredita: 0,
        Id_Cuenta_Debita: 0,
        Observaciones: '',
        // Id_Funcionario: this.id_funcionario,
        Tipo:'Egreso'
      };
        
      this.Soporte= [];
      this.NombreCliente = '';
      this.NombreCodigoCuenta = '';
      this.NombreCodigoCuenta2 = '';
    }
  
    CargaArchivo(event, i) {
      if (event.target.files.length === 1) {
        if (this.ComprobanteModel.Soporte[i] !== 'undefined') {
          this.ComprobanteModel.Soporte[i] = event.target.files[0];
        } else {
          this.ComprobanteModel.Soporte.push(event.target.files[0]);
        }
        // this.Soportes[i].NomArchivo = event.target.files[0].name;
  
      }
    }
  
    BuscarDatosCliente(proveedor) {
      this.ComprobanteModel.Id_Proveedor=proveedor.Id_Proveedor;
    }
  
    BuscarDatosBanco(banco:any) {
      this.ComprobanteModel.Id_Banco=banco.Id_Banco;
    }
  
    BuscarDatosFormasPago(formaPago:any) {
      this.ComprobanteModel.Id_Cliente=formaPago.Id_Forma_Pago;
    }
  
    BuscarDatosCuenta(cuenta, tipoCuenta:number) {
      
      if(tipoCuenta === 1){      
        
        this.ComprobanteModel.Id_Cuenta_Debita=cuenta.Id_Plan_Cuentas;
      }else{
        
        this.ComprobanteModel.Id_Cuenta_Acredita=cuenta.Id_Plan_Cuentas;
      }
    }
  
    PeticionGuardarComprobante(data){
      this.http.post(environment.ruta + 'php/comprobantes/guardar_comprobante.php', data).subscribe((data: any) => {
        this.ShowSwal(data.tipo, 'Registro Exitoso', data.msg);
      });
    }
  
    Archivo(event){
      if (event.target.files.length === 1) {
        this.Soporte = event.target.files[0];
      } 
    }
  
    SetInformacionPaginacion(){
      var calculoHasta = (this.page*this.pageSize);
      var desde = calculoHasta-this.pageSize+1;
      var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;
  
      this.InformacionPaginacion['desde'] = desde;
      this.InformacionPaginacion['hasta'] = hasta;
      this.InformacionPaginacion['total'] = this.TotalItems;
    }
  
    //Setear filtros
    SetFiltros(paginacion:boolean = false){
      let params:any = {};
  
      if(paginacion === true){      
        params.pag = this.page;
      }else{      
        this.page = 1;
        params.pag = this.page;
      }
      
      if (this.filtro_cliente != "") {
        params.cli= this.filtro_cliente;
      }
      if (this.filtro_codigo != "") {
        params.cod = this.filtro_codigo;
      }
      if (this.filtro_empresa != "") {
        params.empresa = this.filtro_empresa;
      }
      if (this.filtro_fecha != null && this.filtro_fecha != '') {
        params.fecha = this.filtro_fecha.formatted;
      }
      if (this.filtro_cheque != "") {
        params.cheque = this.filtro_cheque;
      }
      if (this.filtro_estado != "") {
        params.est = this.filtro_estado;
      }
  
      let queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
      return queryString;
    }
  
    //Aplicar filtros en la tabla
    filtros(paginacion:boolean = false) {
  
      var params = this.SetFiltros(paginacion);
  
      this.location.replaceState('/contabilidad/comprobantes/egresos', params);    
  
      this.http.get(environment.ruta + 'php/comprobantes/lista_egresos.php'+params).subscribe((data: any) => {
        this.Comprobantes = data.Lista;
        this.TotalItems = data.numReg;
        this.SetInformacionPaginacion();
      });
    }
  
    RecargarDatos() {
      let urlParams = this.route.snapshot.queryParams;
      if (Object.keys(urlParams).length > 0) { // Si existe parametros o filtros
        // actualizando la variables con los valores de los paremetros.
        this.page = urlParams.pag ? urlParams.pag : 1;
        this.filtro_cliente = urlParams.cli ? urlParams.cli : '';
        this.filtro_codigo = urlParams.cod ? urlParams.cod : '';
        this.filtro_fecha = urlParams.fecha ? urlParams.fecha : '';
        this.filtro_tipo = urlParams.tipo ? urlParams.tipo : '';
        this.filtros(this.page > 1);
      }else{
        this.filtros();
      }
    }
  
    dateRangeChanged(event) {
      
      if (event.formatted != "") {
        this.filtro_fecha = event;
      } else {
        this.filtro_fecha = '';
      }
      
      this.filtros(true); 
    }
  
    VerComprobante(id) {
      //this.modalVerComprobante.show();
      this.http.get(environment.ruta + 'php/comprobantes/detalle_comprobante.php', { params: {  id: id } }).subscribe((data: any) => {
        this.Comprobante = data;
        this.modalVerComprobante.show();
      });
    }
  
    anularDocumento() {
      let datos:any = {
        Id_Registro: this.IdDocumento,
        Tipo: 'Egreso',
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
  
      return this.http.post(environment.ruta + 'php/contabilidad/anular_documento.php', data);
    }

}
