import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { SweetAlertOptions } from 'sweetalert2';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ActivatedRoute } from '@angular/router';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-notas-carteras',
  templateUrl: './notas-carteras.component.html',
  styleUrls: ['./notas-carteras.component.scss']
})
export class NotasCarterasComponent implements OnInit {
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
  public NotasCarteras: any = [];
  public Cargando: boolean = true;
  public maxSize = 20;
  public TotalItems: number;
  public page = 1;
  public filtros: any = {
    codigo: '',
    fechas: '',
    tercero: '',
    estado: '',
  }
  public filtro_fecha: any = '';
  myDateRangePickerOptions: IMyDrpOptions = {
    width: '240px',
    height: '28px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };
  IdDocumento: string = '';
  // id_funcionario: any = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
  alertOption: SweetAlertOptions;
  perfilUsuario: any = localStorage.getItem('miPerfil');
  envirom: any;

  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location, private swalService: SwalService) {
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

  ngOnInit() {
    this.ListarNotasCarteras();
    this.envirom = environment;
  }

  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }


  ListarNotasCarteras() {

    this.http.get(environment.base_url + '/php/contabilidad/notascarteras/lista_notas_carteras.php').subscribe((data: any) => {
      this.Cargando = false;
      this.NotasCarteras = data.Notas;
      this.TotalItems = data.numReg;
      console.log(this.NotasCarteras);

    });

  }

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
    if (pagination) {
      params.pag = this.page
    } else {
      this.page = 1;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/comprobante/notascartera', queryString);

    return queryString;
  }

  filtrar(pagination = false) {

    let queryString = this.getStrConditions(pagination);

    this.Cargando = true;

    this.http.get(environment.base_url + '/php/contabilidad/notascarteras/lista_notas_carteras.php?' + queryString).subscribe((data: any) => {
      this.Cargando = false;
      this.NotasCarteras = data.Notas;
      this.TotalItems = data.numReg;
    });

  }

  anularDocumento() {
    let datos: any = {
      Id_Registro: this.IdDocumento,
      Tipo: 'Notas_Cartera',
      // Identificacion_Funcionario: this.id_funcionario
    }

    this.AnularDocumentoContable(datos).subscribe((data: any) => {
      let swal = {
        codigo: data.tipo,
        titulo: data.titulo,
        mensaje: data.mensaje
      };
      this.swalService.ShowMessage(swal);

      this.ListarNotasCarteras();
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
