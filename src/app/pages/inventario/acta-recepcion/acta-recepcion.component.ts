import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { functionsUtils } from '../../../core/utils/functionsUtils';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { UserService } from 'src/app/core/services/user.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from 'saturn-datepicker';
import { ActaRecepcionService } from './acta-recepcion.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-acta-recepcion',
  templateUrl: './acta-recepcion.component.html',
  styleUrls: ['./acta-recepcion.component.scss'],
})
export class ActaRecepcionComponent implements OnInit {
  datePipe = new DatePipe('es-CO');
  companyWorkedId: any;
  filtersCP = {
    codigo: '',
    proveedor: ''
  }
  pendientesNacional = [];
  ListaIntrernacional = [];
  actas_pendientes = [];
  rowsFilter = [];
  tempFilter = [];
  columns = [];
  public actarecepciones: any = [];
  public maxSize = 10;
  public TotalItems: number;
  public page = 1;
  public filtro_cod: string = '';
  public filtro_fact: string = '';
  public filtro_fecha: any = '';
  public filtro_fecha2: any = '';
  public filtro_proveedor: any = '';
  public filtro_compra: any = '';
  public filtro_Codigo: any = '';
  public filtro_Proveedor: any = '';
  public Cargando: boolean = false;
  public loadingComprasPendientes: boolean = false;
  public Cargando3: boolean = false;
  public loadindAA: boolean = false;

  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('PlantillaBotones1') PlantillaBotones1: TemplateRef<any>;
  @ViewChild('confirmacionGuardar') private confirmacionGuardar: SwalComponent;
  filtro_codigo: string;
  //TODO Auth Person
  public funcionario = { Identificacion_Funcionario: '1' };
  public perfilUsuario: '1';
  public Model: any = {
    Id_Acta_Recepcion: '',
    Id_Causal_Anulacion: '',
    Observaciones: '',
    Identificacion_Funcionario: '1',
  };

  public Causales = [];
  public alertOption: SweetAlertOptions = {};

  public maxSize1 = 5;
  public pageSize1 = 10;
  public TotalItems1: number;
  public page1 = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };
  public Filtros: any = {
    codigo_acta: '',
  };
  public ActasAnuladas: any = [];
  date: { year: number; month: number };
  date2: { year: number; month: number };
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private _swalService: SwalService,
    private _modal: ModalService,
    private _user: UserService,
    private _actaRecepcion: ActaRecepcionService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale('es');
    this.companyWorkedId = this._user.user.person.company_worked.id;
    this.alertOption = {
      title: '¿Estás seguro(a)?',
      text: 'Vamos a anular el acta de recepción, esta acción es irreversible.',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: this._swalService.buttonColor.confirm,
      cancelButtonColor: this._swalService.buttonColor.cancel,
      confirmButtonText: '¡Sí, confirmar!',
      showLoaderOnConfirm: true,
      focusCancel: true,
      reverseButtons: true,
      icon: 'question',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.AnularActa();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  ngOnInit() {
    this.getComprasPendientes();
    this.getActasPendientes();
    this.getActasAnuladas();
    this.getCausalesAnulacion();
    this.getActasIngresadas();
  }

  getComprasPendientes(compra = 'Nacional') {
    this.loadingComprasPendientes = true;
    let params = {
      compra: compra,
      company_id: this.companyWorkedId,
      ...this.filtersCP
    }
    this._actaRecepcion.getComprasPendientes(params).subscribe((res: any) => {
      this.pendientesNacional = res.data;
      //this.ListaIntrernacional = res;
      this.loadingComprasPendientes = false;
    })
  }

  getActasPendientes() {
    this.Cargando3 = true;
    let params = {
      company_id: this.companyWorkedId
    }
    this._actaRecepcion.getActaRecepcion(params).subscribe((data: any) => {
      this.actas_pendientes = data;
      this.Cargando3 = false;
    });
  }

  getActasIngresadas() {
    let params = this.route.snapshot.queryParams;
    let queryString = '';
    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page = params.pag ? params.pag : 1;
      this.filtro_cod = params.cod ? params.cod : '';
      this.filtro_fecha = params.fecha ? params.fecha : '';
      this.filtro_fact = params.fact ? params.fact : '';
      this.filtro_fecha2 = params.fecha2 ? params.fecha2 : '';
      this.filtro_proveedor = params.proveedor ? params.proveedor : '';
      this.filtro_compra = params.compra ? params.compra : '';

      queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    }
    this.Cargando = true;
    let params2 = {
      estado: 'Acomodada',
      tipo: 'General',
      company_id: this.companyWorkedId
    }
    this._actaRecepcion.getActasIngresadas(params2).subscribe((data: any) => {
      this.actarecepciones = data.actarecepciones;
      this.TotalItems = data.numReg;
      this.Cargando = false;
    });
  }

  paginacion() {
    let params: any = {
      pag: this.page,
    };

    if (this.filtro_cod != '') {
      params.cod = this.filtro_cod;
    }
    if (this.filtro_fecha != '' && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha;
    }
    if (this.filtro_fecha2 != '' && this.filtro_fecha2 != null) {
      params.fecha2 = this.filtro_fecha2;
    }
    if (this.filtro_fact != '') {
      params.fact = this.filtro_fact;
    }
    if (this.filtro_compra != '') {
      params.compra = this.filtro_compra;
    }
    if (this.filtro_proveedor != '') {
      params.proveedor = this.filtro_proveedor;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/actarecepcionnuevo', queryString);
    this.Cargando = true;
    this.http
      .get(
        environment.base_url +
        '/php/actarecepcion_nuevo/lista_actarecepcion.php?estado=Acomodada&tipo=General&' +
        queryString,
        { params: { company_id: this._user.user.person.company_worked.id } }
      )
      .subscribe((data: any) => {
        this.actarecepciones = data.actarecepciones;
        this.TotalItems = data.numReg;
        this.Cargando = false;
      });
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.filtro_fecha = event;
    } else {
      this.filtro_fecha = '';
    }
    this.filtros();
  }
  dateRangeChanged2(event) {
    if (event.formatted != '') {
      this.filtro_fecha2 = event.formatted;
    } else {
      this.filtro_fecha2 = '';
    }
    this.filtros();
  }
  selectedDate(fecha) {
    //console.log(fecha);
    this.filtro_fecha =
      this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd') +
      ' - ' +
      this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd');
    console.log(this.filtro_fecha);
  }
  selectedDate2(fecha) {
    //console.log(fecha);
    this.filtro_fecha2 =
      this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd') +
      ' - ' +
      this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd');
    console.log(this.filtro_fecha);
  }

  filtros() {
    let params: any = {};

    if (
      this.filtro_cod != '' ||
      this.filtro_fecha != '' ||
      this.filtro_fact != '' ||
      this.filtro_compra != '' ||
      this.filtro_fecha2 != '' ||
      this.filtro_proveedor != ''
    ) {
      this.page = 1;
      params.pag = this.page;

      if (this.filtro_cod != '') {
        params.cod = this.filtro_cod;
      }
      if (this.filtro_fecha != '' && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha;
      }
      if (this.filtro_fecha2 != '' && this.filtro_fecha2 != null) {
        params.fecha2 = this.filtro_fecha2;
      }
      if (this.filtro_fact != '') {
        params.fact = this.filtro_fact;
      }
      if (this.filtro_compra != '') {
        params.compra = this.filtro_compra;
      }
      if (this.filtro_proveedor != '') {
        params.proveedor = this.filtro_proveedor;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/actarecepcionnuevo', queryString);
      this.Cargando = true;
      this.http
        .get(
          environment.base_url +
          '/php/actarecepcion_nuevo/lista_actarecepcion.php?estado=Acomodada&tipo=General&' +
          queryString,
          { params: { company_id: this._user.user.person.company_worked.id } }
        )
        .subscribe((data: any) => {
          this.actarecepciones = data.actarecepciones;
          this.TotalItems = data.numReg;
          this.Cargando = false;
        });
    } else {
      this.location.replaceState('/actarecepcionnuevo', '');
      this.filtro_cod = '';
      this.filtro_fact = '';
      this.filtro_fecha = '';
      this.filtro_proveedor = '';
      this.filtro_fecha2 = '';
      this.filtro_compra = '';
      this.Cargando = true;
      this.http
        .get(
          environment.base_url +
          '/php/actarecepcion_nuevo/lista_actarecepcion.php?estado=Acomodada&tipo=General.php',
          { params: { company_id: this._user.user.person.company_worked.id } }
        )
        .subscribe((data: any) => {
          this.actarecepciones = data.actarecepciones;
          this.TotalItems = data.numReg;
          this.Cargando = false;
        });
    }
  }

  actualiza_filtro(txt, col, tipo) {
    const val = txt.target.value.toLowerCase();
    const temp = this.tempFilter.filter(function (d) {
      if (tipo === '=') {
        return d[col].toLowerCase().indexOf(val) !== -1 || !val;
      } else if (tipo === '!=') {
        return d[col].toLowerCase().indexOf(val) === -1;
      }
    });
    this.rowsFilter = temp;
  }

  AnularActa() {
    let modelo = functionsUtils.normalize(JSON.stringify(this.Model));
    let data = new FormData();
    data.append('modelo', modelo);
    this.http
      .post(environment.base_url + '/php/actarecepcion/anular_acta.php', data)
      .subscribe((data: any) => {
        if (data.tipo == 'success') {
          this.Model = {
            Id_Acta_Recepcion: '',
            Id_Causal_Anulacion: '',
            Observaciones: '',
            Identificacion_Funcionario: '1',
          };

          this._swalService.show({ ...data, showCancel: false });
        } else {
          this._swalService.show({ ...data, showCancel: false });
        }
        this._modal.close();
        this.getActasPendientes();
        this.getActasAnuladas();
      });
  }
  AsignarDatos(id, content) {
    this.Model.Id_Acta_Recepcion = id;
    this._modal.open(content)
  }

  getCausalesAnulacion() {
    this._actaRecepcion.getCausalesAnulacion().subscribe((res: any) => {
      this.Causales = res.data;
    });
  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pageSize1;

    if (paginacion === true) {
      params.pag = this.page1;
    } else {
      this.page1 = 1; // Volver a la página 1 al filtrar
      params.pag = this.page1;
    }

    if (this.Filtros.codigo_acta != '') {
      params.codigo = this.Filtros.codigo_acta;
    }

    return params;
  }

  getActasAnuladas(paginacion: boolean = false) {
    this.loadindAA = true;
    let params = {
      ...this.SetFiltros(paginacion),
      company_id: this.companyWorkedId,
    }
    this._actaRecepcion.getActasAnuladas(params).subscribe((data: any) => {
      if (data.status) {
        this.ActasAnuladas = data.data.data;
        this.TotalItems1 = data.data.total;
        this.loadindAA = false;
      } else {
        this.ActasAnuladas = [];
        this.loadindAA = false;
      }
      this.SetInformacionPaginacion();
    });
  }

  SetInformacionPaginacion() {
    var calculoHasta = this.page1 * this.pageSize1;
    var desde = calculoHasta - this.pageSize1 + 1;
    var hasta =
      calculoHasta > this.TotalItems1 ? this.TotalItems1 : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems1;
  }

  verActa(item) {
    switch (item.Tipo_Acomodar) {
      case 'Acta_Recepcion':
        this.router.navigate(['/inventario/acta-recepcion/ver', item.Id_Acta]);
        break;

      case 'Ajuste_Individual':
        this.router.navigate(['/ajustesinventariover', item.Id_Acta]);
        break;

      case 'Nota_Credito':
        this.router.navigate(['/notascreditover', item.Id_Acta]);
        break;

      default:
        break;
    }
  }

  verContabilidad(item, tipo) {
    let tipoCont = tipo == 'NIF' ? '&tipo_valor=Niif' : '';
    let archivo = '';

    if (item.Tipo_Acomodar == 'Acta_Recepcion') {
      archivo = 'movimientos_acta_recepcion_pdf.php';
    } else if (item.Tipo_Acomodar == 'Ajuste_Individual') {
      archivo = 'movimientos_ajuste_individual_pdf.php';
    } else if (item.Tipo_Acomodar == 'Nota_Credito') {
      archivo = 'movimientos_nota_credito_pdf.php';
    }

    let ruta = `${environment.ruta}php/contabilidad/movimientoscontables/${archivo}?id_registro=${item.Id_Acta}&id_funcionario_elabora=${this.funcionario.Identificacion_Funcionario}${tipoCont}`;
    window.open(ruta, '_blank');
  }
}
