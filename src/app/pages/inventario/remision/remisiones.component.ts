import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import '../../../../assets/charts/amchart/amcharts';
import '../../../../assets/charts/amchart/gauge';
import '../../../../assets/charts/amchart/pie';
import '../../../../assets/charts/amchart/serial';
import '../../../../assets/charts/amchart/light';
import '../../../../assets/charts/amchart/ammap';
import '../../../../assets/charts/amchart/worldLow';
import '../../../../assets/charts/amchart/continentsLow';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { IMyDrpOptions } from 'mydaterangepicker';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';


@Component({
  selector: 'app-remisiones',
  templateUrl: './remisiones.component.html',
  styleUrls: ['./remisiones.component.scss']
})
export class RemisionesComponent implements OnInit {

  public Mes = [];
  public Datos: any = [];
  public Remisiones = [];
  public Nofacturadas: any = [];
  public Facturadas: any = [];
  public Noconforme: any = [];
  public Borrador: any = [];
  public Anulada: any = [];
  public Indicador: boolean = true;
  public Anuladas: any = {};
  public studentChartOption: any;
  public Cargando: boolean = true;
  @ViewChild('studentChart') studentChart: ElementRef;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('confirmaSwal') confirmaSwal: any;
  @ViewChild('anularSwal') anularSwal: any;
  public facturacionChartTag: CanvasRenderingContext2D;
  rowsFilter = [];
  tempFilter = [];
  columns = [];
  loadingIndicator = true;
  timeout: any;
  public user: any;
  Lista_Remisiones: any = [];
  public maxSize = 15;
  public TotalItems: number;
  public page = 1;
  public filtro_fecha: any = '';
  public filtro_cod: string = '';
  public filtro_tipo: string = '';
  public filtro_origen: string = '';
  public filtro_grupo: string = '';
  public filtro_destino: string = '';
  public filtro_est: string = '';
  public filtro_fase: string = '';

  public punto_informe = 0;
  public punto_informe2 = 0;
  public fecha_informe = '';
  public fecha_informe2 = '';
  public Id_Remision: any = '';
  public Id_Contrato: any = '';

  public Puntos = [];
  public Clientes = [];
  myDateRangePickerOptions: IMyDrpOptions = {
    width: '100px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('PlantillaEstado') PlantillaEstado: TemplateRef<any>;
  @ViewChild('PlantillaTipo') PlantillaTipo: TemplateRef<any>;
  @ViewChild('EstadoRemision') EstadoRemision: TemplateRef<any>;
  public studentChartData: any;
  public alertInputOption: SweetAlertOptions = {};
  public env = environment;

  constructor(private http: HttpClient, private location: Location, private route: ActivatedRoute) {
    this.ListarRemisiones();
  }

  ngOnInit() {
    console.clear();
    this.user = JSON.parse(localStorage.getItem("User"));
    this.http.get(environment.ruta + 'php/remision/grafica_remisiones.php').subscribe((data: any) => {

      data.forEach(element => {
        this.Mes.push(element.date);
        this.Remisiones.push(element.Remisiones);
      });

    });

    this.http.get(environment.ruta + 'php/remision/detalle_tipo.php').subscribe((data: any) => {
      this.Datos = data.Tipo;
      this.Anuladas = data.Anuladas;
      this.Facturadas = data.Tipo_Facturacion[0].Facturadas;
      this.Nofacturadas = data.Tipo_Facturacion[0].No_Facturadas;
      this.Noconforme = data.No_Conforme;
      //// console.log(data);

    });
    this.ListarBorradores();

    this.alertInputOption = {
      title: "Observacion ",
      text: "Ingrese una Observacion o motivo de anulacion",
      input: 'text',
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: 'Anular',
      focusCancel: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (!value) {
            resolve('Valor no puede estar vacio');
          } else if (value.length < 10) {
            resolve('la observacion debe tener como minimo 10 caracteres!');
          } else {
            //Metodo de Anular
            this.AnularRemision(value);
            resolve('');
          }
        })
      },
      // type: 'info'
    }
  }
  ListarBorradores() {
    this.http.get(environment.ruta + 'php/remision/borradores_remision.php?func=' + environment.id_funcionario).subscribe((data: any) => {
      this.Borrador = data;
    });
  }

  ListarRemisiones() {
    let params = this.route.snapshot.queryParams;
    let queryString = '';

    if (Object.keys(params).length > 0) { // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page = params.pag ? params.pag : 1;
      this.filtro_fecha = params.fecha ? params.fecha : '';
      this.filtro_cod = params.cod ? params.cod : '';
      this.filtro_tipo = params.tipo ? params.tipo : '';
      this.filtro_origen = params.origen ? params.origen : '';
      this.filtro_grupo = params.grupo ? params.grupo : '';
      this.filtro_destino = params.destino ? params.destino : '';
      this.filtro_est = params.est ? params.est : '';
      this.filtro_fase = params.fase ? params.fase : '';

      queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    }
    this.http.get(environment.ruta + '/php/remision_nuevo/remisiones.php' + queryString).subscribe((data: any) => {
      console.log(data);

      this.Cargando = false;
      this.Lista_Remisiones = data.remisiones;
      this.TotalItems = data.numReg;
    });

    this.http.get(environment.ruta + 'php/remision/detalle_tipo.php').subscribe((data: any) => {
      this.Datos = data.Tipo;
      this.Anuladas = data.Anuladas;
      this.Facturadas = data.Tipo_Facturacion[0].Facturadas;
      this.Nofacturadas = data.Tipo_Facturacion[0].No_Facturadas;
      //// console.log(data);

    });
  }
  EliminarBorrador(id) {
    let datos = new FormData();
    datos.append("Id_Borrador", id);
    this.http.post(environment.ruta + 'php/remision/elimina_borrador.php', datos).subscribe((data: any) => {
      this.confirmaSwal.show();
      this.ListarBorradores();
    });
  }

  paginacion() {
    let params: any = {
      pag: this.page
    };
    if (this.filtro_fecha != "" && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha.formatted;
    }
    if (this.filtro_cod != "") {
      params.cod = this.filtro_cod;
    }
    if (this.filtro_tipo != "") {
      params.tipo = this.filtro_tipo;
    }
    if (this.filtro_origen != "") {
      params.origen = this.filtro_origen;
    }
    if (this.filtro_grupo != "") {
      params.grupo = this.filtro_grupo;
    }
    if (this.filtro_destino != "") {
      params.destino = this.filtro_destino;
    }
    if (this.filtro_fase != "") {
      params.fase = this.filtro_fase;
    }
    if (this.filtro_est != "") {
      params.est = this.filtro_est;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/remisionesnuevo', queryString);

    this.Cargando = true;

    this.http.get(environment.ruta + '/php/remision_nuevo/remisiones.php?' + queryString).subscribe((data: any) => {
      this.Cargando = false;
      this.Lista_Remisiones = data.remisiones;
      this.TotalItems = data.numReg;
    });
  }

  dateRangeChanged(event) {

    if (event.formatted != "") {
      this.filtro_fecha = event;
    } else {
      this.filtro_fecha = '';
    }

    this.filtros();
  }
  dateRangeChanged2(event, tipo) {
    // console.log(event);
    if (event.formatted != "") {
      if (tipo == 'remision') {
        this.fecha_informe = event.formatted;
      } else {
        this.fecha_informe2 = event.formatted;
      }

    } else {
      if (tipo == 'remision') {
        this.fecha_informe = '';
      } else {
        this.fecha_informe2 = '';
      }
    }
  }

  filtros() {
    let params: any = {};
    if (this.filtro_fecha != "" || this.filtro_cod != "" || this.filtro_tipo != "" || this.filtro_origen != "" || this.filtro_grupo != "" || this.filtro_destino != "" || this.filtro_est || this.filtro_fase) {
      this.page = 1;
      params.pag = this.page;

      if (this.filtro_fecha != "" && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha.formatted;
      }
      if (this.filtro_cod != "") {
        params.cod = this.filtro_cod;
      }
      if (this.filtro_tipo != "") {
        params.tipo = this.filtro_tipo;
      }
      if (this.filtro_origen != "") {
        params.origen = this.filtro_origen;
      }
      if (this.filtro_grupo != "") {
        params.grupo = this.filtro_grupo;
      }
      if (this.filtro_destino != "") {
        params.destino = this.filtro_destino;
      }
      if (this.filtro_est != "") {
        params.est = this.filtro_est;
      }
      if (this.filtro_fase != "") {
        params.fase = this.filtro_fase;
      }

      let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

      this.location.replaceState('/remisionesnuevo', queryString);

      this.Cargando = true;

      this.http.get(environment.ruta + '/php/remision_nuevo/remisiones.php?' + queryString).subscribe((data: any) => {
        this.Cargando = false;
        this.Lista_Remisiones = data.remisiones;
        this.TotalItems = data.numReg;
      });
    } else {
      this.location.replaceState('/remisionesnuevo', '');

      this.page = 1;
      this.filtro_cod = '';
      this.filtro_destino = '';
      this.filtro_est = '';
      this.filtro_fecha = '';
      this.filtro_tipo = '';
      this.filtro_origen = '';
      this.filtro_grupo = '';
      this.filtro_fase = '';

      this.Cargando = true;
      this.http.get(environment.ruta + '/php/remision_nuevo/remisiones.php').subscribe((data: any) => {
        this.Cargando = false;
        this.Lista_Remisiones = data.remisiones;
        this.TotalItems = data.numReg;
      });
    }

  }

  SuspenderRemision(id, idc) {
    this.Id_Remision = id;
    this.Id_Contrato = idc;
    this.anularSwal.show();
  }

  AnularRemision(value) {

    let datos = new FormData();
    datos.append("modulo", 'Remision');
    datos.append("id", this.Id_Remision);
    datos.append("idc", this.Id_Contrato);
    datos.append("funcionario", this.user.Identificacion_Funcionario);
    datos.append("observacion", functionsUtils.utf8_encode(value))
    this.http.post(environment.ruta + 'php/remision_nuevo/anular_remision_dev.php', datos).subscribe((data: any) => {
      this.deleteSwal.title = data.title;
      this.deleteSwal.type = data.type;
      this.deleteSwal.text = data.message;
      this.deleteSwal.show();
      this.ListarRemisiones();

      this.Id_Remision = '';
    });
  }


  perfilAdministrador() {
    let miPerfil = localStorage.getItem('miPerfil');

    if (miPerfil == '16') {
      return true;
    }

    return false;
  }

}
