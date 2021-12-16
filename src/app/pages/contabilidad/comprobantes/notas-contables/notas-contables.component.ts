import { Component, OnInit } from '@angular/core';
import {IMyDrpOptions} from 'mydaterangepicker';
import { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-notas-contables',
  templateUrl: './notas-contables.component.html',
  styleUrls: ['./notas-contables.component.scss']
})
export class NotasContablesComponent implements OnInit {

  public NotasContables:any = [];
  public Cargando:boolean = true;
  public maxSize = 20; 
  public TotalItems:number;
  public page = 1;
  public filtros:any = {
    codigo: '',
    fechas: '',
    tercero: '',
    estado: ''
  }
public filtro_fecha:any='';
myDateRangePickerOptions: IMyDrpOptions = {
    width:'200px', 
    height: '21px',
    selectBeginDateTxt:'Inicio',
    selectEndDateTxt:'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };
  IdDocumento: string = '';
  envirom: any;
  // id_funcionario: any = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
  alertOption: SweetAlertOptions;
  // perfilUsuario:any = localStorage.getItem('miPerfil');

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
    this.ListarNotasContables()
    this.envirom = environment;
  }

  ListarNotasContables() {

    this.http.get(environment.ruta+'php/contabilidad/notascontables/lista_notas_contables.php').subscribe((data:any) => {
      this.Cargando = false;
      this.NotasContables = data.Notas;
      this.TotalItems = data.numReg;
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

  getStrConditions(pagination = false) {
    let params:any = {};

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

    this.location.replaceState('/comprobante/notascontables', queryString);

    return queryString;
  }

  filtrar(pagination = false) {

    let queryString = this.getStrConditions(pagination);

    this.Cargando = true;

    this.http.get(environment.ruta+'php/contabilidad/notascontables/lista_notas_contables.php?'+queryString).subscribe((data:any) => {
      this.Cargando = false;
      this.NotasContables = data.Notas;
      this.TotalItems = data.numReg;
    });    
    
  }

  anularDocumento() {
    let datos:any = {
      Id_Registro: this.IdDocumento,
      Tipo: 'Notas_Contables',
      // Identificacion_Funcionario: this.id_funcionario
    }

    this.AnularDocumentoContable(datos).subscribe((data:any) => {
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

    return this.http.post(environment.ruta+'php/contabilidad/anular_documento.php', data);
  }

}
