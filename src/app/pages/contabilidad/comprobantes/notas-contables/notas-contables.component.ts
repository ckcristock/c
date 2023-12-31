import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyDrpOptions } from 'mydaterangepicker';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CentroCostosService } from '../../centro-costos/centro-costos.service';
import { MatAccordion } from '@angular/material/expansion';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-notas-contables',
  templateUrl: './notas-contables.component.html',
  styleUrls: ['./notas-contables.component.scss']
})
export class NotasContablesComponent implements OnInit {
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

  public NotasContables: any = [];
  public Cargando: boolean = true;
  public maxSize = 20;
  public TotalItems: number;
  public page = 1;
  public filtros = {
    codigo: '',
    fechas: '',
    tercero: '',
    estado: '',
    Id_Empresa: ''
  }
  public filtro_fecha: any = '';
  myDateRangePickerOptions: IMyDrpOptions = {
    width: '200px',
    height: '28px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };
  IdDocumento: string = '';
  envirom: any;
  id_funcionario;
  alertOption: SweetAlertOptions;
  // perfilUsuario:any = localStorage.getItem('miPerfil');
  companies: any[] = [];
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private swalService: SwalService,
    private _company: CentroCostosService,
    private _user: UserService
  ) {
    this.id_funcionario = this._user.user.person.id
    this.alertOption = {
      title: "¿Estás seguro(a)?",
      text: "Vamos a anular el documento",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: '¡Sí, confirmar!',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#A3BD30',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'question',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.anularDocumento();
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }
  }

  ngOnInit() {
    this.ListarNotasContables()
    this.envirom = environment;
    // this.listarEmpresas();
  }
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }
  ListarNotasContables() {

    this.http.get(environment.base_url + '/php/contabilidad/notascontables/lista_notas_contables.php').subscribe((data: any) => {
      this.Cargando = false;
      this.NotasContables = data.Notas;
      this.TotalItems = data.numReg;
    });

  }

  /*   listarEmpresas(){
      this._company.getCompanies().subscribe((data:any) => {
        this.companies = data.data;
      })
    } */

  dateRangeChanged(event) {

    if (event.formatted != "") {
      this.filtros.fechas = event.formatted;
    } else {
      this.filtros.fechas = '';
    }

    this.filtrar();
  }
  fechita: any;
  fechitaF(event) {
    this.fechita = event.target.value;
    if (this.fechita2 != null) {
      this.filtros.fechas = this.fechita + ' - ' + this.fechita2;
      this.filtrar();
    }
  }
  fechita2: any;
  fechitaF2(event) {
    this.fechita2 = event.target.value;
    if (this.fechita != null) {
      this.filtros.fechas = this.fechita + ' - ' + this.fechita2;
      this.filtrar();
    }
  }

  getStrConditions(pagination = false) {
    let params: any = {};

    if (this.filtros.codigo != '') {
      params.cod = this.filtros.codigo;
    }
    if (this.filtros.tercero != '') {
      params.tercero = this.filtros.tercero;
    }
    if (this.filtros.fechas != '') {
      params.fecha = this.filtros.fechas;
    }
    if (this.filtros.estado != '') {
      params.est = this.filtros.estado;
    }
    if (this.filtros.Id_Empresa != '') {
      params.empresa = this.filtros.Id_Empresa;
    }
    if (pagination) {
      params.pag = this.page
    } else {
      this.page = 1;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/contabilidad/comprobantes/notas-contables', queryString);

    return queryString;
  }

  filtrar(pagination = false) {

    let queryString = this.getStrConditions(pagination);

    this.Cargando = true;

    this.http.get(environment.base_url + '/php/contabilidad/notascontables/lista_notas_contables.php?' + queryString).subscribe((data: any) => {
      this.Cargando = false;
      this.NotasContables = data.Notas;
      this.TotalItems = data.numReg;
    });

  }

  anularDocumento() {
    let datos: any = {
      Id_Registro: this.IdDocumento,
      Tipo: 'Notas_Contables',
      Identificacion_Funcionario: this.id_funcionario
    }

    this.AnularDocumentoContable(datos).subscribe((data: any) => {
      let swal = {
        codigo: data.tipo,
        titulo: data.titulo,
        mensaje: data.mensaje
      };
      this.swalService.ShowMessage(swal);

      this.ListarNotasContables();
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

    return this.http.post(environment.base_url + '/php/contabilidad/anular_documento.php', data);
  }

}
