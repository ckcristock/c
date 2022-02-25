import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Location } from "@angular/common";
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-compra-nacional',
  templateUrl: './compra-nacional.component.html',
  styleUrls: ['./compra-nacional.component.scss']
})
export class CompraNacionalComponent implements OnInit {

  public comprasnacionales: any[] = [];
  @ViewChild('Formcomprasnacionacrear') Formcomprasnaciona: any;
  @ViewChild('studentChart') studentChart: ElementRef;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('PlantillaEstado') PlantillaEstado: TemplateRef<any>;
  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('PlantillaValor') PlantillaValor: TemplateRef<any>;

  @ViewChild('infoSwal') infoSwal: any;

  loadingIndicator = true;
  timeout: any;
  public dias_anulacion: any = '';
  public funcionario_anulacion: any = '';
  public funcionarios_anulacion: any = [];


  public precompra: any[];
  public proveedorPreCompra = [];
  public indicadores = [];
  public grafica: any;
  public TotalItems: number;
  public page = 1;
  public maxSize = 10;
  public filtro_cod: string = '';
  public filtro_est: string = '';
  public filtro_prov: string = '';
  public filtro_func: string = '';
  public studentChartData: any;
  public Fecha = new Date();
  public Actas_Pendientes: any = [];
  public Compras_Pendientes: any = [];
  public Compras_Rechazadas: any = [];
  public Pre_Compras: any[] = [];
  /*  public user = JSON.parse(localStorage.getItem('User')); */

  /* TODO ACTUALIZAR FUNCIONARIO */
  public miPerfil = '1';
  /*     public miPerfil = JSON.parse(localStorage.getItem('miPerfil')); */


  public requiredParams: any = { params: { tipo: "todo", funcionario: 1, company_id: '' } };
  myDateRangePickerOptions: IMyDrpOptions = {
    width: '180px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };
  public filtro_fecha: any = '';
  private mes = [];
  public subtotal = [];
  facturacionChartTag: any;

  constructor(private http: HttpClient, private location: Location, private route: ActivatedRoute, private _user: UserService) {
    this.requiredParams.params.company_id = this._user.user.person.company_worked.id

    this.ListarComprasNacionales();
    this.getDiasAnulacion();
    this.getFuncioriosParaResponsables();
  }


  ngOnInit() {

    this.http.get(environment.ruta + 'php/rotativoscompras/lista_pre_compra.php').subscribe((data: any) => {
      this.Pre_Compras = data;
    });

  }


  ListarComprasNacionales() {

    let params = this.route.snapshot.queryParams;

    let queryString = '';

    if (Object.keys(params).length > 0) { // Si existe parametros o filtros
      this.page = params.pag ? params.pag : 1;
      this.filtro_cod = params.cod ? params.cod : '';
      this.filtro_func = params.func ? params.func : '';
      this.filtro_est = params.est ? params.est : '';
      this.filtro_prov = params.prov ? params.prov : '';
      queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    }

    this.http.get(environment.ruta + 'php/comprasnacionales/lista_compras.php' + queryString,

      this.requiredParams).subscribe((data: any) => {
        this.comprasnacionales = data.compras;
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

  filtros() {

    let params: any = {};

    if (this.filtro_fecha != "" || this.filtro_cod != "" || this.filtro_prov != "" || this.filtro_est != '' || this.filtro_func != '') {
      this.page = 1;
      params.pag = this.page;


      if (this.filtro_fecha != "" && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha.formatted;
      }
      if (this.filtro_cod != "") {
        params.cod = this.filtro_cod;
      }
      if (this.filtro_prov != "") {
        params.prov = this.filtro_prov;
      }
      if (this.filtro_est != "") {
        params.est = this.filtro_est;
      }
      if (this.filtro_func != "") {
        params.func = this.filtro_func;
      }
      let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

      this.location.replaceState('/comprasnacionales', queryString); // actualizando URL

      this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php?' + queryString, this.requiredParams).subscribe((data: any) => {
        this.comprasnacionales = data.compras;
        this.TotalItems = data.numReg;

      });
    } else {
      this.location.replaceState('/comprasnacionales', '');

      this.page = 1;
      this.filtro_cod = '';
      this.filtro_est = '';
      this.filtro_fecha = '';
      this.filtro_prov = '';
      this.filtro_func = '';
      this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php?', this.requiredParams).subscribe((data: any) => {
        this.comprasnacionales = data.compras;
        this.TotalItems = data.numReg;
      });
    }

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
    if (this.filtro_est != "") {
      params.est = this.filtro_est;
    }
    if (this.filtro_prov != "") {
      params.prov = this.filtro_prov;
    }
    if (this.filtro_func != "") {
      params.func = this.filtro_func;
    }
    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/comprasnacionales', queryString); // actualizando URL

    this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php?' + queryString, this.requiredParams).subscribe((data: any) => {
      this.comprasnacionales = data.compras;
      this.TotalItems = data.numReg;

    });
  }

  anularCompra(id, motivo) {
    let datos = new FormData();
    datos.append("id", id);

    datos.append("funcionario", '1');
    datos.append("estado", "Anulada");
    datos.append("motivo", motivo);
    this.http.post(environment.ruta + 'php/comprasnacionales/actualiza_compra.php', datos).subscribe((data: any) => {
      this.deleteSwal.show();
      this.cargarIndicadores();
      this.ListarComprasNacionales();
    })
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      // console.log('paged!', event);
    }, 100);
  }

  tablaLocalstorage() {
    if (this.proveedorPreCompra.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  actualiza_filtro(txt) {
    const val = txt.toLowerCase();
    switch (val) {
      case "todos": {
        this.location.replaceState('/comprasnacionales', ''); // Quitar los queryStrings
        this.filtro_cod = '';
        this.filtro_est = '';

        this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php', this.requiredParams).subscribe((data: any) => {
          this.comprasnacionales = data.compras;
          this.TotalItems = data.numReg;

        });

        break;
      }
      case "pendiente": {

        this.filtro_est = val; // Setear variable global del filtro de estado

        let params: any = {
          pag: this.page,
          est: val
        };

        if (this.filtro_cod != "") {
          params.cod = this.filtro_cod;
        }

        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

        this.location.replaceState('/comprasnacionales', queryString);

        this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php?' + queryString, this.requiredParams).subscribe((data: any) => {
          this.comprasnacionales = data.compras;
          this.TotalItems = data.numReg;

        });
        break;
      }
      case "no conforme": {

        this.filtro_est = val; // Setear variable global del filtro de estado

        let params: any = {
          pag: this.page,
          est: val
        };

        if (this.filtro_cod != "") {
          params.cod = this.filtro_cod;
        }

        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

        this.location.replaceState('/comprasnacionales', queryString);

        this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php?' + queryString, this.requiredParams).subscribe((data: any) => {
          this.comprasnacionales = data.compras;
          this.TotalItems = data.numReg;

        });

        break;
      }
      case "anulada": {

        this.filtro_est = val; // Setear variable global del filtro de estado

        let params: any = {
          pag: this.page,
          est: val
        };

        if (this.filtro_cod != "") {
          params.cod = this.filtro_cod;
        }

        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

        this.location.replaceState('/comprasnacionales', queryString);

        this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php?' + queryString, this.requiredParams).subscribe((data: any) => {
          this.comprasnacionales = data.compras;
          this.TotalItems = data.numReg;

        });

        break;
      }
      case 'codigo': {

        let params: any = {
          pag: this.page
        };

        if (this.filtro_cod != "") {
          params.cod = this.filtro_cod;
        }

        if (this.filtro_est != "") {
          params.est = this.filtro_est;
        }

        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

        this.location.replaceState('/comprasnacionales', queryString);

        setTimeout(() => {
          this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php?' + queryString, this.requiredParams).subscribe((data: any) => {
            this.comprasnacionales = data.compras;
            this.TotalItems = data.numReg;

          });
        }, 500);

        break;
      }
      case 'recibida': {
        this.filtro_est = val; // Setear variable global del filtro de estado

        let params: any = {
          pag: this.page,
          est: val
        };

        if (this.filtro_cod != "") {
          params.cod = this.filtro_cod;
        }

        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

        this.location.replaceState('/comprasnacionales', queryString);

        this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php?' + queryString, this.requiredParams).subscribe((data: any) => {
          this.comprasnacionales = data.compras;
          this.TotalItems = data.numReg;

        });

        break;
      }
      case 'devuelta': {
        this.filtro_est = val; // Setear variable global del filtro de estado

        let params: any = {
          pag: this.page,
          est: val
        };

        if (this.filtro_cod != "") {
          params.cod = this.filtro_cod;
        }

        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

        this.location.replaceState('/comprasnacionales', queryString);

        this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php?' + queryString, this.requiredParams).subscribe((data: any) => {
          this.comprasnacionales = data.compras;
          this.TotalItems = data.numReg;

        });

        break;
      }
    }
  }

  cargarIndicadores() {
    this.http.get(environment.ruta + '/php/comprasnacionales/indicadores_conteo_nacional.php').subscribe((data: any) => {
      this.indicadores = data;
    })
  }

  getDiasAnulacion() {
    this.http.get(environment.ruta + '/php/comprasnacionales/get_dias_anulacion.php').subscribe((data: any) => {
      this.dias_anulacion = data['Dias_Anulacion'];
      this.funcionario_anulacion = data['Funcionario_Anulacion'];
    })
  }

  getFuncioriosParaResponsables() {
    this.http.get(environment.ruta + 'php/funcionarios/lista_funcionarios.php?depen=sistemas').subscribe((data: any) => {
      this.funcionarios_anulacion = data['funcionarios'];
    })
  }




  setDiasAnulacion() {

    if (this.dias_anulacion <= 0) {
      this.infoSwal.type = 'error'
      this.infoSwal.title = '¡Ha ocurrido un error!'
      this.infoSwal.text = 'El valor no puede ser menor a 1';
      this.infoSwal.show();
      return false;
    }

    let params: any = {};
    params.Dias_Anulacion = this.dias_anulacion;
    params.Funcionario_Anulacion = this.funcionario_anulacion;

    this.http.get(environment.ruta + '/php/comprasnacionales/set_dias_anulacion.php', { params: params }).subscribe((data: any) => {
      this.infoSwal.type = data.type;
      this.infoSwal.title = data.title;
      this.infoSwal.text = data.message;
      this.infoSwal.show();
    })
  }



}
