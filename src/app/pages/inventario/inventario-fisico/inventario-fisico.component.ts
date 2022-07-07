import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IMyDrpOptions } from 'mydaterangepicker';
import { BodeganuevoService } from '../services/bodeganuevo.service';
import { GrupoestibaService } from '../services/grupoestiba.service';
import { InventariofisicoService } from '../services/inventariofisico.service';
import { ModaldataInitComponent } from './modaldata-init/modaldata-init.component';
import { environment } from 'src/environments/environment';
import { ModalformComponent } from './modalform/modalform.component';
import { UserService } from 'src/app/core/services/user.service';
import { MatAccordion } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DateAdapter } from 'saturn-datepicker';

@Component({
  selector: 'app-inventario-fisico',
  templateUrl: './inventario-fisico.component.html',
  styleUrls: ['./inventario-fisico.component.scss'],
})
export class InventarioFisicoComponent implements OnInit {
  @ViewChild('actualizaSwal') private actualizaSwal: SwalComponent;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose(){
    if (this.matPanel == false){
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }    
  }
  datePipe = new DatePipe('es-CO');
  public FiltrosTabla: any = {
    Fechas: '',
    Bodega: '',
    Grupo: '',
  };

  public listaBodegas: any = [];
  public listaGrupoEstibas: any = [];
  public listaSubcategorias: any = [];
  public Inventarios_Terminados = [];
  public Documentos = [];

  public funcionario = JSON.parse(localStorage.getItem('User'));
  public miPerfil = JSON.parse(localStorage.getItem('miPerfil'));

  public maxSize = 5;
  public pageSize = 5;
  public TotalItems: number;
  public page = 1;
  public company_id: any = '';

  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };

  myDateRangePickerOptions: IMyDrpOptions = {
    width: '130px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  iniciado: boolean;
  Cargando: boolean = false;
  Cargando2: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _user: UserService,
    private inventariofisico: InventariofisicoService,
    private modalService: NgbModal,
    private _bodega: BodeganuevoService,
    private _grupoEstiba: GrupoestibaService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.company_id = this._user.user.person.company_worked.id;
    this.dateAdapter.setLocale('es');
  }

  ngOnInit() {
    this.getDocumentosIniciados();
    this.ConsultaFiltrada();

    //buscar las bodegas existentes
    // this._bodega.getBodegas().subscribe(res => {
    //   if (res.Tipo == 'success') this.listaBodegas = res.Bodegas
    // })
    this.http
      .get(environment.ruta + 'php/bodega_nuevo/get_bodegas.php')
      .subscribe((data: any) => {
        if (data.Tipo == 'success') this.listaBodegas = data.Bodegas;
      });

    //buscar las bodegas existentes
    // this._grupoEstiba.getGrupoEstibas().subscribe(res => {
    //   if (res.Tipo == 'success') this.listaGrupoEstibas = res.Grupo_Estibas
    // })
    this.http
      .get(environment.ruta + 'php/grupo_estiba/get_grupo_estibas.php')
      .subscribe((data: any) => {
        if (data.Tipo == 'success') this.listaGrupoEstibas = data.Grupo_Estibas;
      });
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    this.Cargando2 = true;
    var params = this.SetFiltros(paginacion);

    // this.inventariofisico.GetDocumentosTerminados(params).subscribe((data: any) => {
    //   if (data.codigo == 'success') {
    //     this.Inventarios_Terminados = data.query_result;
    //     this.TotalItems = data.numReg;
    //   } else {
    //     this.Inventarios_Terminados = [];
    //   }
    //   this.Cargando2 = false;
    //   this.SetInformacionPaginacion();
    // });

    this.http
      .get(
        environment.ruta +
          'php/inventariofisico/estiba/documentos_terminados.php',
        { params }
      )
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.Inventarios_Terminados = data.query_result;
          this.TotalItems = data.numReg;
        } else {
          this.Inventarios_Terminados = [];
        }
        this.Cargando2 = false;
        this.SetInformacionPaginacion();
      });
  }

  SetInformacionPaginacion() {
    var calculoHasta = this.page * this.pageSize;
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pageSize;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.FiltrosTabla.Fechas != '' && this.FiltrosTabla.Fechas != null) {
      params.fechas = this.FiltrosTabla.Fechas;
    }

    if (this.FiltrosTabla.Bodega != '') {
      params.bodega = this.FiltrosTabla.Bodega;
    }

    if (this.FiltrosTabla.Grupo != '') {
      params.grupo = this.FiltrosTabla.Grupo;
    }

    return params;
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.FiltrosTabla.Fechas = event.formatted;
    } else {
      this.FiltrosTabla.Fechas = '';
    }
    this.ConsultaFiltrada();
  }

  selectedDate(fecha) {
    this.FiltrosTabla.Fechas =
      this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd') +
      ' - ' +
      this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd');
      this.ConsultaFiltrada();
  }
  date: { year: number; month: number };

  iniciar_inventario_fisico() {
    const modalRef = this.modalService.open(ModalformComponent);
  }

  inventario_auditor() {
    const modalAlertReference = this.modalService.open(ModaldataInitComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
  }

  getDocumentosIniciados() {
    this.Cargando = true;

    return this.http
      .get(
        environment.ruta +
          'php/inventariofisico/estiba/documentos_iniciados.php'
      )
      .subscribe((res: any) => {
        // this.inventariofisico.GetDocumentosIniciados().subscribe(res => {
        if (res.tipo == 'success') {
          this.Documentos = res.documentos;
        } else {
          this.Documentos = [];
        }
        this.Cargando = false;
      });
  }

  AccionInventario(
    url_api,
    funcionario: string,
    id_modelo,
    documento: any = []
  ) {
    if (funcionario == '' || funcionario.length <= 4) {
      this.actualizaSwal.title = 'Dato inválido';
      this.actualizaSwal.html = 'Lo sentimos. Debe ingresar datos correctos';
      this.actualizaSwal.icon = 'error';
      this.actualizaSwal.fire();
    } else {
      // TODO funcionarios autorizados para realizar inventario
      // let funcionarios = this.globales.funcionarios_autorizados_inventario.split(',');
      let funcionarios = '31179925';
     // let company_id = this.company_id;

      if (funcionarios.indexOf(funcionario) >= 0) {
        this.router.navigate([url_api, id_modelo], {
          queryParams: { func: '1',company_id : this.company_id },
        });
      } else {
        this.actualizaSwal.title = 'Sin autorización';
        this.actualizaSwal.html =
          'Lo sentimos, no tienes autorización para confirmar el inventario.';
        this.actualizaSwal.icon = 'error';
        this.actualizaSwal.fire();
      }
    }
  }

  continuarConteo(Documento) {
    this.router.navigate(['show-inventario'], {
      queryParams: {
        bodega: Documento.id_Bodega_Nuevo,
        doc: Documento.Id_Doc_Inventario_Fisico,
      },
    });
  }

  CambiarEstadoDocumento(estado, documento) {
    let estadoNuevo;
    if (estado == 'Haciendo Primer Conteo') {
      estadoNuevo = 'Pendiente Primer Conteo';
    } else if (estado == 'Haciendo Segundo Conteo') {
      estadoNuevo = 'Primer Conteo';
    }

    let data = new FormData();
    data.append('estado', estadoNuevo);
    data.append('idDocumento', documento.Id_Doc_Inventario_Fisico);
    data.append('Tipo', documento.Tipo);
    this.http
      .post(
        environment.ruta +
          'php/inventariofisico/estiba/cambiar_estados_documentos.php',
        data
      )
      .subscribe((res: any) => {
        if (res.tipo == 'success') {
          this.actualizaSwal.title = res.title;
          this.actualizaSwal.html = res.mensaje;
          this.actualizaSwal.icon = res.tipo;
          this.actualizaSwal.fire();
          documento.Estado = estadoNuevo;
        }
      });
  }
}
