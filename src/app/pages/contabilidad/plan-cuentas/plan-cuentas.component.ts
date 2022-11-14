import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { MatAccordion } from '@angular/material';
import { User } from 'src/app/core/models/users.model';
import { UserService } from 'src/app/core/services/user.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-plan-cuentas',
  templateUrl: './plan-cuentas.component.html',
  styleUrls: ['./plan-cuentas.component.scss'],
})
export class PlanCuentasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  env = environment
  public Planes: any = [];
  public Cargando = false;
  Bancos: any;

  envirom: any = {};
  //Paginación
  public maxSize = 5;
  public pageSize = 20;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };

  @ViewChild('alertSwal') alertSwal: SwalComponent;
  @ViewChild('modalCrearCuenta') modalCrearCuenta: any;
  @ViewChild('modalEditarCuenta') modalEditarCuenta: any;
  @ViewChild('modalVerCuenta') modalVerCuenta: any;

  //Variables para filtros
  public filtro_codigo: any = '';
  public filtro_nombre: any = '';
  public filtro_codigo_niif: any = '';
  public filtro_nombre_niif: any = '';
  public filtro_estado_cuenta: any = 'ACTIVO';
  public filtro_empresa: any = '';
  public company_id: any;

  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }
  public PlanCuentaModel: any = {
    Id_Plan_Cuenta: '',
    Tipo_P: '',
    Tipo_Niif: '',
    Codigo: '',
    Nombre: '',
    Codigo_Niif: '',
    Nombre_Niif: '',
    Estado: 'ACTIVO',
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
    company_id: '',
  };

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private swalService: SwalService,
    private _planCuentas: PlanCuentasService,
    private _user: UserService,
    private _modal: ModalService

  ) {}

  ngOnInit() {
    this.RecargarDatos();

    //this.ListaPlanCuentas();
    this.ListarBancos();
    this.envirom = environment;
    this.company_id = this._user.user.person.company_worked.id;
  }

  ListaPlanCuentas() {
    this.http
      .get(environment.ruta + 'php/plancuentas/lista_plan_cuentas.php', {
        params: { company_id: this._user.user.person.company_worked.id },
      })
      .subscribe(
        (data: any) => {
          this.Cargando = false;
          this.Planes = data.query_result;
        },
        (error) => {}
      );
  }

  SetInformacionPaginacion() {
    var calculoHasta = this.page * this.pageSize;
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  RecargarDatos() {
    let urlParams = this.route.snapshot.queryParams;
    if (Object.keys(urlParams).length > 0) {
      // Si existe parametros o filtros
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

    if (this.filtro_codigo != '') {
      params.cod = this.filtro_codigo;
    }
    if (this.filtro_codigo_niif != '') {
      params.cod_niif = this.filtro_codigo_niif;
    }
    if (this.filtro_nombre != '') {
      params.nombre = this.filtro_nombre;
    }
    if (this.filtro_nombre_niif != '') {
      params.nombre_niif = this.filtro_nombre_niif;
    }
    if (this.filtro_estado_cuenta != '') {
      params.estado = this.filtro_estado_cuenta;
    }
    params.company_id = this._user.user.person.company_worked.id;

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    return queryString;
  }

  //Aplicar filtros en la tabla
  filtros(paginacion: boolean = false) {
    this.Cargando = true;
    var params = this.SetFiltros(paginacion);

    this.location.replaceState('/contabilidad/plan-cuentas', params);

    this.http
      .get(environment.ruta + 'php/plancuentas/lista_plan_cuentas.php' + params)
      .subscribe((data: any) => {
        this.Planes = data.query_result;
        this.TotalItems = data.numReg;
        this.SetInformacionPaginacion();
        this.Cargando = false;
      });
  }

  openInNewTab() {
    window
      .open(this.envirom.ruta + 'php/centroscostos/exportar.php', '_blank')
      .focus();
  }

  AsignarParametrosUrl(urlParams: any) {
    this.page = urlParams.pag ? urlParams.pag : 1;
    this.filtro_codigo_niif = urlParams.cod_niif ? urlParams.cod_niif : '';
    this.filtro_codigo = urlParams.cod ? urlParams.cod : '';
    this.filtro_nombre = urlParams.nombre ? urlParams.nombre : '';
    this.filtro_nombre_niif = urlParams.nombre_niif
      ? urlParams.nombre_niif
      : '';
    this.filtro_estado_cuenta = urlParams.estado ? urlParams.estado : '';
  }

  ListarBancos() {
    this.http
      .get(environment.ruta + 'php/plancuentas/lista_bancos.php')
      .subscribe((data: any) => {
        this.Bancos = data;
      });
  }

  habInfoValue(value) {
    if (value == 'S') {
      (document.getElementById('Valor') as HTMLInputElement).disabled = false;
      (document.getElementById('Porcentaje') as HTMLInputElement).disabled =
        false;
    } else {
      (document.getElementById('Valor') as HTMLInputElement).disabled = true;
      (document.getElementById('Porcentaje') as HTMLInputElement).disabled =
        true;
    }
  }
  habInfoValue2(value) {
    if (value == 'S') {
      (document.getElementById('Valor_Editar') as HTMLInputElement).disabled = false;
      (document.getElementById('Porcentaje_Editar') as HTMLInputElement).disabled =
        false;
    } else {
      (document.getElementById('Valor_Editar') as HTMLInputElement).disabled = true;
      (document.getElementById('Porcentaje_Editar') as HTMLInputElement).disabled =
        true;
    }
  }

  habBancos(value) {
    if (value == 'S') {
      (document.getElementById('Cod_Banco') as HTMLInputElement).disabled =
        false;
      (document.getElementById('Cod_Banco') as HTMLInputElement).value = '';
    } else {
      (document.getElementById('Cod_Banco') as HTMLInputElement).disabled =
        true;
      (document.getElementById('Cod_Banco') as HTMLInputElement).value = '';
    }
  }
  habBancos2(value) {
    if (value == 'S') {
      (document.getElementById('Cod_Banco_Editar') as HTMLInputElement).disabled =
        false;
      (document.getElementById('Cod_Banco_Editar') as HTMLInputElement).value = '';
    } else {
      (document.getElementById('Cod_Banco_Editar') as HTMLInputElement).disabled =
        true;
      (document.getElementById('Cod_Banco_Editar') as HTMLInputElement).value = '';
    }
  }
  openModal(content){
    this._modal.openScrollableContent(content)
  }
  habCampos(value) {
    this.PlanCuentaModel = value.query_result;
    //console.log(value.query_result.Movimiento)
    if (typeof value == 'object') {
      if (value.query_result.Movimiento == 'S') {
        $('.input').prop('disabled', false);
      } else {
        $('.input').prop('disabled', true);
      }


    } else {
      if (value == 'S') {
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
    this.http
      .post(
        environment.ruta + 'php/contabilidad/plancuentas/guardar_puc.php',
        datos
      )
      .subscribe((data: any) => {
        let title = data.tipo == 'error' ? 'Error' : 'Exito';
        this.ShowSwal(data.tipo, title, data.mensaje);
        this._modal.close()

        setTimeout(() => {
          this.filtros();
        }, 1000);
      });
  }

  EditarPlanCuenta(idPlanCuenta, content) {
    this.http
      .get(
        environment.ruta +
          'php/contabilidad/plancuentas/detalle_plan_cuenta.php',
        { params: { id_cuenta: idPlanCuenta } }
      )
      .subscribe((data: any) => {
        this.openModal(content)
        this.habCampos(data);
        /* this.modalEditarCuenta.show(); */
        /* setTimeout(() => {
        this.PlanCuentaModel = data.query_result;

      }, 500); */
      });
  }

  VerPlanCuenta(idPlanCuenta, content) {
    this.http
      .get(
        environment.ruta +
          'php/contabilidad/plancuentas/detalle_plan_cuenta.php',
        { params: { id_cuenta: idPlanCuenta } }
      )
      .subscribe((data: any) => {
        this.PlanCuentaModel = data.query_result;
        this.openModal(content)
      });
  }

  CambiarEstadoPlan(idPlanCuenta) {
    let datos = new FormData();
    datos.append('id_cuenta',idPlanCuenta);
    this.http
      .post( environment.ruta + 'php/contabilidad/plancuentas/cambiar_estado.php', datos )
      .subscribe((data: any) => {
        Swal.fire({
          icon: data.icon,
          title: data.title,
          text: data.msg,
        });
        setTimeout(() => {
          this.filtros();
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
    this.http
      .get(
        environment.ruta +
          'php/contabilidad/plancuentas/descargar_informe_plan_cuentas_excel.php',
        { params: { company_id: this._user.user.person.company_worked.id } }
      )
      .subscribe((data: any) => {});
  }

  ImprimirPdf() {
    this.http
      .get(
        environment.ruta +
          'php/contabilidad/plancuentas/descargar_informe_plan_cuentas.php'
      )
      .subscribe((data: any) => {});
  }

  lengthByType(tipo) {
    let tipos = {
      clase: 1,
      grupo: 2,
      cuenta: 4,
      subcuenta: 6,
      auxiliar: 8,
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

    tipo_plan = !editar
      ? (
          document.getElementById('Tipo_Niif') as HTMLInputElement
        ).value.toLowerCase()
      : (
          document.getElementById('Tipo_Niif_Editar') as HTMLInputElement
        ).value.toLowerCase();


    setTimeout(() => {
      if (tipo_plan != '') {
        if (codigo.length != this.lengthByType(tipo_plan)) {
          swal.fire({
            icon: 'error',
            title: 'Ooops!',
            text: `El código no corresponde al tipo de plan "${tipo_plan}"`,
          });
          // (document.getElementById(id_campo) as HTMLInputElement).focus();
          // this.showAlert('error','Ooops!',`El código no corresponde al tipo de plan "${tipo_plan}"`);
        } else if (tipo_plan != 'grupo') {
          let p: any = {
            Tipo_Plan: tipo_plan,
            Codigo: codigo,
            Tipo_Puc: tipo_puc,
          };
          this.http
            .get(environment.ruta + 'php/plancuentas/validar_puc_niveles.php', {
              params: p,
            })
            .subscribe((data: any) => {
              if (data.validacion == 0) {
                // (document.getElementById(id_campo) as HTMLInputElement).focus();
                swal.fire({
                  icon: 'error',
                  title: 'Ooops!',
                  text: `El código ${codigo} no pertenece al nivel superior "${data.nivel_superior}"`,
                });
                // this.showAlert('error','Ooops!',`El código ${codigo} no pertenece al nivel superior "${data.nivel_superior}"`);
              }
            });
        }
      }
    }, 300);
  }

  showAlert(tipo, titulo, mensaje) {
    let swal = {
      icon: tipo,
      titulo: titulo,
      mensaje: mensaje,
    };
    this.swalService.ShowMessage(swal);

    return;
  }
}