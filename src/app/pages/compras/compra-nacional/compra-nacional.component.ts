import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Location } from "@angular/common";
import { UserService } from 'src/app/core/services/user.service';
import { MatAccordion } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { DateAdapter } from 'saturn-datepicker';
import { CompraNacionalService } from './compra-nacional.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';

@Component({
  selector: 'app-compra-nacional',
  templateUrl: './compra-nacional.component.html',
  styleUrls: ['./compra-nacional.component.scss'],
})
export class CompraNacionalComponent implements OnInit {
  datePipe = new DatePipe('es-CO');
  date: { year: number; month: number };

  checkFoto: boolean = true;
  checkFuncionario: boolean = true;
  checkFecha: boolean = true;
  checkCodigo: boolean = true;
  checkProveedor: boolean = true;
  checkEstado: boolean = true;
  checkAprobacion: boolean = true;
  panelOpenState = false;

  public loading: boolean = false;
  public comprasnacionales: any[] = [];
  @ViewChild('Formcomprasnacionacrear') Formcomprasnaciona: any;
  @ViewChild('studentChart') studentChart: ElementRef;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('PlantillaEstado') PlantillaEstado: TemplateRef<any>;
  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('PlantillaValor') PlantillaValor: TemplateRef<any>;

  @ViewChild('infoSwal') infoSwal: any;
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
  matPanel = false;
  openClose(){
    if (this.matPanel == false){
      this.firstAccordion.openAll();
      this.matPanel = true;
    } else {
      this.firstAccordion.closeAll();
      this.matPanel = false;
    }
  }
  matPanel2 = false;
  openClose2(){
    if (this.matPanel2 == false){
      this.secondAccordion.openAll();
      this.matPanel2 = true;
    } else {
      this.secondAccordion.closeAll();
      this.matPanel2 = false;
    }
  }

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
  public filtros: any = {
    cod: '',
    est: '',
    prov: '',
    fecha: '',
    func: ''
  }
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
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
 /*  myDateRangePickerOptions: IMyDrpOptions = {
    width: '156px',
    height: '27px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '12px',
    dateFormat: 'yyyy-mm-dd',
  }; */
  private mes = [];
  public subtotal = [];
  facturacionChartTag: any;

  constructor(
    private http: HttpClient,
    private location: Location,
    private _user: UserService,
    private _compraNacional: CompraNacionalService,
    private dateAdapter: DateAdapter<any>,
    private _people: PersonService
  ) {}


  ngOnInit() {
    this.requiredParams.params.company_id = this._user.user.person.company_worked.id

    this.dateAdapter.setLocale('es');
    this.listarComprasNacionales();
    this.getDiasAnulacion();
    this.getFuncioriosParaResponsables();
    /* this.http.get(environment.base_url + '/php/rotativoscompras/lista_pre_compra').subscribe((res: any) => {
      this.Pre_Compras = res.data;
    }); */
  }

  listarComprasNacionales(page=1) {

    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._compraNacional.getListaComprasNacionales(params).subscribe((res: any) => {
      this.comprasnacionales = res.data.data;
      this.loading = false;
      this.pagination.collectionSize = res.data.total;
    });
  }

  selectedDate(fecha) {
    if (fecha.value){
      this.filtros.fecha =
      this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd') +
      ' - ' +
      this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd');
    } else {
      this.filtros.fecha = ''
    }
    this.listarComprasNacionales();
  }

 /*  fechita:any;
  fechitaF(event){
    this.fechita = event.target.value;
    if(this.fechita2 !=null){
      this.filtros.fecha = this.fechita + ' - ' + this.fechita2;
      this.filtros();
    }
  }

  fechita2:any;
  fechitaF2(event){
    this.fechita2 = event.target.value;
    if(this.fechita !=null){
      this.filtros.fecha = this.fechita + ' - ' + this.fechita2;
      this.filtros();
    }
  }

  dateRangeChanged(event) {

    if (event.formatted != "") {
      this.filtros.fecha = event.formatted;
      console.log(this.filtros.fecha)
    } else {
      this.filtros.fecha = '';
    }

    //this.filtros();
  } */

  /* filtros() {

    let params: any = {};

    if (this.filtros.fecha != "" || this.filtros.cod != "" || this.filtros.prov != "" || this.filtros.est != '' || this.filtros.func != '') {
      this.page = 1;
      params.pag = this.page;


      if (this.filtros.fecha != "" && this.filtros.fecha != null) {
        params.fecha = this.filtros.fecha;
      }
      if (this.filtros.cod != "") {
        params.cod = this.filtros.cod;
      }
      if (this.filtros.prov != "") {
        params.prov = this.filtros.prov;
      }
      if (this.filtros.est != "") {
        params.est = this.filtros.est;
      }
      if (this.filtros.func != "") {
        params.func = this.filtros.func;
      }
      let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

      this.location.replaceState('/comprasnacionales', queryString); // actualizando URL

      this.http.get(environment.base_url + '/php/comprasnacionales/lista_compras/' + queryString, this.requiredParams).subscribe((data: any) => {
        this.comprasnacionales = data.compras;
        this.TotalItems = data.numReg;

      });
    } else {
      this.location.replaceState('/comprasnacionales', '');

      this.page = 1;
      this.filtros.cod = '';
      this.filtros.est = '';
      this.filtros.fecha = '';
      this.filtros.prov = '';
      this.filtros.func = '';
      this.http.get(environment.base_url + '/php/comprasnacionales/lista_compras/', this.requiredParams).subscribe((data: any) => {
        this.comprasnacionales = data.compras;
        this.TotalItems = data.numReg;
      });
    }

  } */

  /* paginacion() {

    let params: any = {
      pag: this.page
    };

    if (this.filtros.fecha != "" && this.filtros.fecha != null) {
      params.fecha = this.filtros.fecha;
    }
    if (this.filtros.cod != "") {
      params.cod = this.filtros.cod;
    }
    if (this.filtros.est != "") {
      params.est = this.filtros.est;
    }
    if (this.filtros.prov != "") {
      params.prov = this.filtros.prov;
    }
    if (this.filtros.func != "") {
      params.func = this.filtros.func;
    }
    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/comprasnacionales', queryString); // actualizando URL

    this.http.get(environment.base_url + '/php/comprasnacionales/lista_compras/' + queryString, this.requiredParams).subscribe((data: any) => {
      this.comprasnacionales = data.compras;
      this.TotalItems = data.numReg;

    });
  } */

  /* anularCompra(id, motivo) {
    let datos = new FormData();
    datos.append("id", id);

    datos.append("funcionario", '1');
    datos.append("estado", "Anulada");
    datos.append("motivo", motivo);
    this.http.post(environment.ruta + 'php/comprasnacionales/actualiza_compra.php', datos).subscribe((data: any) => {
      this.deleteSwal.show();
      this.cargarIndicadores();
      this.listarComprasNacionales();
    })
  } */

 /*  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      // console.log('paged!', event);
    }, 100);
  } */

 /*  tablaLocalstorage() {
    if (this.proveedorPreCompra.length > 0) {
      return true;
    } else {
      return false;
    }
  } */

  /* actualiza_filtro(txt) {
    const val = txt.toLowerCase();
    switch (val) {
      case "todos": {
        this.location.replaceState('/comprasnacionales', ''); // Quitar los queryStrings
        this.filtros.cod = '';
        this.filtros.est = '';

        this.http.get(environment.ruta + '/php/comprasnacionales/lista_compras.php', this.requiredParams).subscribe((data: any) => {
          this.comprasnacionales = data.compras;
          this.TotalItems = data.numReg;

        });

        break;
      }
      case "pendiente": {

        this.filtros.est = val; // Setear variable global del filtro de estado

        let params: any = {
          pag: this.page,
          est: val
        };

        if (this.filtros.cod != "") {
          params.cod = this.filtros.cod;
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

        this.filtros.est = val; // Setear variable global del filtro de estado

        let params: any = {
          pag: this.page,
          est: val
        };

        if (this.filtros.cod != "") {
          params.cod = this.filtros.cod;
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

        this.filtros.est = val; // Setear variable global del filtro de estado

        let params: any = {
          pag: this.page,
          est: val
        };

        if (this.filtros.cod != "") {
          params.cod = this.filtros.cod;
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

        if (this.filtros.cod != "") {
          params.cod = this.filtros.cod;
        }

        if (this.filtros.est != "") {
          params.est = this.filtros.est;
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
        this.filtros.est = val; // Setear variable global del filtro de estado

        let params: any = {
          pag: this.page,
          est: val
        };

        if (this.filtros.cod != "") {
          params.cod = this.filtros.cod;
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
        this.filtros.est = val; // Setear variable global del filtro de estado

        let params: any = {
          pag: this.page,
          est: val
        };

        if (this.filtros.cod != "") {
          params.cod = this.filtros.cod;
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
  } */

  /* cargarIndicadores() {
    this.http.get(environment.ruta + '/php/comprasnacionales/indicadores_conteo_nacional.php').subscribe((data: any) => {
      this.indicadores = data;
    })
  } */

  getDiasAnulacion() {
    this.http.get(environment.ruta + '/php/comprasnacionales/get_dias_anulacion.php').subscribe((data: any) => {
      this.dias_anulacion = data['Dias_Anulacion'];
      this.funcionario_anulacion = data['Funcionario_Anulacion'];
    })
  }

  getFuncioriosParaResponsables() {
    this.http.get(environment.base_url + '/php/funcionarios/lista_funcionarios?depen=admin').subscribe((res: any) => {
      this.funcionarios_anulacion = res.data;
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
