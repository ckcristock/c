import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import Swal from 'sweetalert2';
import { PlanCuentasService } from './plan-cuentas.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import swal from 'sweetalert2';
import * as $ from "jquery";
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-plan-cuentas',
  templateUrl: './plan-cuentas.component.html',
  styleUrls: ['./plan-cuentas.component.scss']
})
export class PlanCuentasComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  public Planes: any = [];
  public Cargando = true;
  Bancos: any;

  envirom: any = {}
  //Paginación
  public maxSize = 5;
  public pageSize = 20;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  @ViewChild('alertSwal') alertSwal: SwalComponent;
  @ViewChild('modalCrearCuenta') modalCrearCuenta: any;
  @ViewChild('modalEditarCuenta') modalEditarCuenta: any;
  @ViewChild('modalVerCuenta') modalVerCuenta: any;

  ngAfterViewInit() {
    if (this.activeFiltros != '?pag=1') {
      this.openClose()
      /* setTimeout(() =>{
        //this.openClose();
        this.accordion.openAll()
        this.matPanel = true;
      }, 1500);  */
    }
  }

  //Variables para filtros
  public filtro_codigo: any = '';
  public filtro_nombre: any = '';
  public filtro_codigo_niif: any = '';
  public filtro_nombre_niif: any = '';
  public filtro_estado_cuenta: any = '';
  public filtro_empresa: any = '';

  public PlanCuentaModel: any = {
    Id_Plan_Cuenta: '',
    Tipo_P: '',
    Tipo_Niif: '',
    Codigo: '',
    Nombre: '',
    Codigo_Niif: '',
    Nombre_Niif: '',
    Estado: '',
    Ajuste_Contable: '',
    Cierra_Terceros: '',
    Movimiento: '',
    Documento: '',
    Base: '',
    Valor: '',
    Porcentaje: '',
    Centro: '',
    Centro_Costo: '',
    Depreciacion: '',
    Amortizacon: '',
    Exogeno: '',
    Naturaleza: '',
    Maneja_Nit: '',
    Banco: '',
    Cod_Banco: '',
    Cie_Anual: '',
    Nit_Cierre: '',
    Nit: '',
    Clase_Cta: '',
    Cta_Numero: '',
    Reporte: '',
    Id_Empresa: ''
  };

  companies: any[] = [];

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private swalService: SwalService,
    private modalService: NgbModal,
    private _planCuentas: PlanCuentasService) { }



  ngOnInit() {

    this.RecargarDatos();

    this.ListaPlanCuentas();
    this.ListarBancos();
    this.envirom = environment;
    this.filtros();
    // this.ListasEmpresas();
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true }).result.then((result) => {
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
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }
  openInNewTab() {
    window.open(this.envirom.ruta + 'php/contabilidad/plancuentas/descargar_informe_plan_cuentas_excel.php', '_blank').focus();
  }

  ListaPlanCuentas() {
    this.http.get(environment.ruta + 'php/plancuentas/lista_plan_cuentas.php').subscribe((data: any) => {
      this.Cargando = false;
      this.Planes = data.query_result;

    }, error => {

    })
  }


  SetInformacionPaginacion() {
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  RecargarDatos() {
    let urlParams = this.route.snapshot.queryParams;
    if (Object.keys(urlParams).length > 0) { // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.AsignarParametrosUrl(urlParams);
      this.filtros(this.page > 1);
    } else {
      this.filtros();
    }
  }

  //Setear filtros
  SetFiltros(paginacion: boolean = false) {
    let params: any = {};

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1;
      params.pag = this.page;
    }

    if (this.filtro_codigo != "") {
      params.cod = this.filtro_codigo;
    }
    if (this.filtro_codigo_niif != "") {
      params.cod_niif = this.filtro_codigo_niif;
    }
    if (this.filtro_nombre != "") {
      params.nombre = this.filtro_nombre;
    }
    if (this.filtro_nombre_niif != "") {
      params.nombre_niif = this.filtro_nombre_niif;
    }
    if (this.filtro_estado_cuenta != "") {
      params.estado = this.filtro_estado_cuenta;
    }
    if (this.filtro_empresa != "") {
      params.empresa = this.filtro_empresa;
    }

    let queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
  }
  activeFiltros: any;
  //Aplicar filtros en la tabla
  filtros(paginacion: boolean = false) {
    this.Cargando = true;
    var params = this.SetFiltros(paginacion);
    this.activeFiltros = params;
    this.location.replaceState('/contabilidad/plan-cuentas', params);

    this.http.get(environment.ruta + 'php/plancuentas/lista_plan_cuentas.php' + params).subscribe((data: any) => {

      this.Planes = data.query_result;
      this.TotalItems = data.numReg;
      this.SetInformacionPaginacion();
      this.Cargando = false;
    });

  }

  AsignarParametrosUrl(urlParams: any) {
    this.page = urlParams.pag ? urlParams.pag : 1;
    this.filtro_codigo_niif = urlParams.cod_niif ? urlParams.cod_niif : '';
    this.filtro_codigo = urlParams.cod ? urlParams.cod : '';
    this.filtro_nombre = urlParams.nombre ? urlParams.nombre : '';
    this.filtro_nombre_niif = urlParams.nombre_niif ? urlParams.nombre_niif : '';
    this.filtro_estado_cuenta = urlParams.estado ? urlParams.estado : '';
    this.filtro_empresa = urlParams.empresa ? urlParams.empresa : '';
  }


  ListarBancos() {
    this.http.get(environment.ruta + 'php/plancuentas/lista_bancos.php').subscribe((data: any) => {
      this.Bancos = data;
    });
  }

  /*   ListasEmpresas(){
      this._planCuentas.getCompanies().subscribe((data:any) => {
        this.companies = data.data;
      })
    } */

  habInfoValue(value) {

    if (value == "S") {
      (document.getElementById('Valor') as HTMLInputElement).disabled = false;
      (document.getElementById('Porcentaje') as HTMLInputElement).disabled = false;
    } else {
      (document.getElementById('Valor') as HTMLInputElement).disabled = true;
      (document.getElementById('Porcentaje') as HTMLInputElement).disabled = true;
    }
  }

  habBancos(value) {
    if (value == "S") {
      (document.getElementById('Cod_Banco') as HTMLInputElement).disabled = false;
      (document.getElementById('Cod_Banco') as HTMLInputElement).value = '';
    } else {
      (document.getElementById('Cod_Banco') as HTMLInputElement).disabled = true;
      (document.getElementById('Cod_Banco') as HTMLInputElement).value = '';
    }
  }

  habCampos(value) {
    if (typeof (value) == 'object') {
      if (value.query_result.Movimiento == "S") {
        $('.input').prop('disabled', false);

      } else {
        $('.input').prop('disabled', true);
      }

      this.PlanCuentaModel = value.query_result;
    } else {
      if (value == "S") {
        $('.input').val('').prop('disabled', false);
      } else {
        $('.input').val('N').prop('disabled', true);
      }
    }

  }

  guardarPlan(Formulario: NgForm, accion: string) {
    let datos = new FormData();

    if (accion == 'guardar') {
      let info = JSON.stringify(Formulario.value);
      datos.append('Datos', info);
    } else if (accion == 'editar') {
      let info = JSON.stringify(this.PlanCuentaModel);
      datos.append('Datos', info);
    }

    this.http.post(environment.ruta + 'php/contabilidad/plancuentas/guardar_puc.php', datos).subscribe((data: any) => {
      let title = (data.tipo == 'error' ? 'Error' : 'Exito');
      this.ShowSwal(data.tipo, title, data.mensaje);
      if (accion == 'guardar') {
        //this.modalCrearCuenta.hide();
        this.modalService.dismissAll(); 

      } else if (accion == 'editar') {
        //this.modalEditarCuenta.hide();
        this.modalService.dismissAll(); 

      }

      setTimeout(() => {
        this.filtros();
      }, 1000);
    });


  }

  EditarPlanCuenta(idPlanCuenta) {
    this.http.get(environment.ruta + 'php/contabilidad/plancuentas/detalle_plan_cuenta.php', { params: { id_cuenta: idPlanCuenta } }).subscribe((data: any) => {
      this.habCampos(data);
      this.modalEditarCuenta.show();

      /* setTimeout(() => {
        this.PlanCuentaModel = data.query_result;
        
      }, 500); */

    });
  }

  VerPlanCuenta(idPlanCuenta) {
    this.http.get(environment.ruta + 'php/contabilidad/plancuentas/detalle_plan_cuenta.php', { params: { id_cuenta: idPlanCuenta } }).subscribe((data: any) => {
      this.PlanCuentaModel = data.query_result;
      this.modalVerCuenta.show();
    });
  }

  CambiarEstadoPlan(idPlanCuenta) {
    this.http.post(environment.ruta + 'php/contabilidad/plancuentas/cambiar_estado_cuenta.php', { params: { id_cuenta: idPlanCuenta } }).subscribe((data: any) => {
      if (data.codigo == 'OK') {
        Swal.fire({
          icon: 'success',
          title: 'Cambio Exitoso',
          text: data.msg
        })
        // this.ShowSwal('success', 'Cambio Exitoso', data.msg);  
      } else if (data.codigo == 'ERR') {
        Swal.fire({
          icon: 'error',
          title: 'Error Inesperado',
          text: data.msg
        })
        // this.ShowSwal('error', 'Error Inesperado', data.msg);
      } else if (data.codigo == 'WARNING') {
        Swal.fire({
          icon: 'warning',
          title: 'Alerta',
          text: data.msg
        })
        // this.ShowSwal('warning', 'Alerta', data.msg);
      }

      setTimeout(() => {
        this.ListaPlanCuentas();
      }, 1000);
    });
  }

  ShowSwal(tipo, titulo: string, msg: string) {
    this.alertSwal.icon = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.fire();
  }

  ImprimirExcel() {
    this.http.get(environment.ruta + 'php/contabilidad/plancuentas/descargar_informe_plan_cuentas_excel.php').subscribe((data: any) => {
    });
  }

  ImprimirPdf() {
    this.http.get(environment.ruta + 'php/contabilidad/plancuentas/descargar_informe_plan_cuentas.php').subscribe((data: any) => {
    });
  }

  lengthByType(tipo) {
    let tipos = {
      clase: 1,
      grupo: 2,
      cuenta: 4,
      subcuenta: 6,
      auxiliar: 8
    };
    return tipos[tipo];
  }

  TransformarValor(value) {
    if (value == 'N' || value == '' || value === null) {
      return 'NO';
    } else {
      return 'SI';
    }
  }

  validarPUC(campo, tipo_puc, editar = false) {
    let codigo = campo.target.value;
    let id_campo = campo.target.id;

    let tipo_plan = '';
    if (tipo_puc == 'pcga') {
      tipo_plan = !editar ? ((document.getElementById('Tipo_P') as HTMLInputElement).value).toLowerCase() : ((document.getElementById('Tipo_P_Editar') as HTMLInputElement).value).toLowerCase();
    } else {
      tipo_plan = !editar ? ((document.getElementById('Tipo_Niif') as HTMLInputElement).value).toLowerCase() : ((document.getElementById('Tipo_Niif_Editar') as HTMLInputElement).value).toLowerCase();
    }

    setTimeout(() => {

      if (tipo_plan != '') {
        if (codigo.length != this.lengthByType(tipo_plan)) {
          swal.fire({
            icon: 'error',
            title: 'Ooops!',
            text: `El código no corresponde al tipo de plan "${tipo_plan}"`
          });
          // (document.getElementById(id_campo) as HTMLInputElement).focus();
          // this.showAlert('error','Ooops!',`El código no corresponde al tipo de plan "${tipo_plan}"`);
        } else if (tipo_plan != 'grupo') {
          let p: any = {
            Tipo_Plan: tipo_plan,
            Codigo: codigo,
            Tipo_Puc: tipo_puc
          };
          this.http.get(environment.ruta + 'php/plancuentas/validar_puc_niveles.php', { params: p }).subscribe((data: any) => {
            console.log(data);
            if (data.validacion == 0) {
              // (document.getElementById(id_campo) as HTMLInputElement).focus();
              swal.fire({
                icon: 'error',
                title: 'Ooops!',
                text: `El código ${codigo} no pertenece al nivel superior "${data.nivel_superior}"`
              });
              // this.showAlert('error','Ooops!',`El código ${codigo} no pertenece al nivel superior "${data.nivel_superior}"`);
            }
          })
        }
      }
    }, 300);
  }

  showAlert(tipo, titulo, mensaje) {
    let swal = {
      icon: tipo,
      titulo: titulo,
      mensaje: mensaje
    };
    this.swalService.ShowMessage(swal);

    return;
  }

}
