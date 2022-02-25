import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IMyDrpOptions } from 'mydaterangepicker';

@Component({
  selector: 'app-acta-recepion-aprobados',
  templateUrl: './acta-recepion-aprobados.component.html',
  styleUrls: ['./acta-recepion-aprobados.component.scss']
})
export class ActaRecepionAprobadosComponent implements OnInit {

  public User : any  =  {};
  public filtro_cod: string = '';
  public filtro_fact: string = '';
  public filtro_fecha: any = '';
  public filtro_fecha2: any = '';
  public filtro_proveedor: any = '';
  public filtro_compra: any = '';
  public maxSize = 10;
  
  public Cargando = false;

  public page = 1;
  public TotalItems: number;
  myDateRangePickerOptions: IMyDrpOptions = {
    width: '120px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };


  
  public actarecepciones: any = [];

  constructor(private location: Location,private http: HttpClient,private route: ActivatedRoute,){ 
      //TODO auth user
      this.User = {Identificacion_Funcionario:'1'}
      this.ListarActaRecepcion();
  }

  ngOnInit() {  }

  ListarActaRecepcion() {
    let params = this.route.snapshot.queryParams;
 
    let queryString = '';
    if (Object.keys(params).length > 0) { // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page = params.pag ? params.pag : 1;
      this.filtro_cod = params.cod ? params.cod : '';
      this.filtro_fecha = params.fecha ? params.fecha : '';
      this.filtro_fact = params.fact ? params.fact : '';
      this.filtro_fecha2 = params.fecha2 ? params.fecha2 : '';
      this.filtro_proveedor = params.proveedor ? params.proveedor : '';
      this.filtro_compra = params.compra ? params.compra : '';

      //
      queryString =  Object.keys(params).map(key => key + '=' + params[key]).join('&');
    }
    this.Cargando = true;
    this.http.get(`${environment.ruta}php/actarecepcion_nuevo/lista_actarecepcion.php?estado=Aprobada&id_funcionario=${this.User.Identificacion_Funcionario}&${queryString}`)
      .subscribe((data: any) => {
      this.actarecepciones = data.actarecepciones;
      this.TotalItems = data.numReg;
      this.Cargando = false;
    });
  }





  //---------------------------------------
  //filtros
  //---------------------------------------
 
  filtros() {

    let params: any = {};

    if (this.filtro_cod != "" || this.filtro_fecha != "" || this.filtro_fact != "" || this.filtro_compra != "" || this.filtro_fecha2 != "" || this.filtro_proveedor != "") {
      this.page = 1;
      params.pag = this.page;

      if (this.filtro_cod != "") {
        params.cod = this.filtro_cod;
      }
      if (this.filtro_fecha != "" && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha.formatted;
      }
      if (this.filtro_fecha2 != "" && this.filtro_fecha2 != null) {
        params.fecha2 = this.filtro_fecha2;
      }
      if (this.filtro_fact != "") {
        params.fact = this.filtro_fact;
      }
      if (this.filtro_compra != "") {
        params.compra = this.filtro_compra;
      }
      if (this.filtro_proveedor != "") {
        params.proveedor = this.filtro_proveedor
      }

      let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

      this.location.replaceState('/actarecepcionaprobados', queryString);
      this.Cargando = true;
      this.http.get(`${environment.ruta}php/actarecepcion_nuevo/lista_actarecepcion.php?estado=Aprobada&id_funcionario=${this.User.Identificacion_Funcionario}&${queryString}`)
      .subscribe((data: any) => {
        this.actarecepciones = data.actarecepciones;
        this.TotalItems = data.numReg;
        this.Cargando = false;

      });
    } else {
      this.location.replaceState('/actarecepcionaprobados', '');
      this.filtro_cod = '';
      this.filtro_fact = '';
      this.filtro_fecha = '';
      this.filtro_proveedor = '';
      this.filtro_fecha2 = '';
      this.filtro_compra = '';
      this.Cargando = true;
      this.http.get(`${environment.ruta}php/actarecepcion_nuevo/lista_actarecepcion.php?estado=Aprobada&id_funcionario=${this.User.Identificacion_Funcionario}&`)
      .subscribe((data: any) => {
        this.actarecepciones = data.actarecepciones;
        this.TotalItems = data.numReg;
        this.Cargando = false;
      });
    }

  }

  
  dateRangeChanged(event) {
    if (event.formatted != "") {
      this.filtro_fecha = event;
    } else {
      this.filtro_fecha = '';
    }
    this.filtros();
  }
  dateRangeChanged2(event) {
    if (event.formatted != "") {
      this.filtro_fecha2 = event.formatted;
    } else {
      this.filtro_fecha2 = '';
    }
    this.filtros();
  }
  
  paginacion() {

    let params: any = {
      pag: this.page
    };

    if (this.filtro_cod != "") {
      params.cod = this.filtro_cod;
    }
    if (this.filtro_fecha != "" && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha.formatted;
    }
    if (this.filtro_fecha2 != "" && this.filtro_fecha2 != null) {
      params.fecha2 = this.filtro_fecha2;
    }
    if (this.filtro_fact != "") {
      params.fact = this.filtro_fact;
    }
    if (this.filtro_compra != "") {
      params.compra = this.filtro_compra;
    }
    if (this.filtro_proveedor != "") {
      params.proveedor = this.filtro_proveedor;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/actarecepcionaprobados', queryString);
    this.Cargando = true;
    this.http.get(`${environment.ruta}php/actarecepcion_nuevo/lista_actarecepcion.php?estado=Aprobada&id_funcionario=${this.User.Identificacion_Funcionario}&${queryString}`)
    .subscribe((data: any) => {
      this.actarecepciones = data.actarecepciones;
      this.TotalItems = data.numReg;
      this.Cargando = false;
    });
  }

}
