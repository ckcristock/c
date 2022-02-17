import { Component, OnInit } from '@angular/core';
import { IMyDrpOptions } from 'mydaterangepicker';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../globales';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notascredito',
  templateUrl: './notascredito.component.html',
  styleUrls: ['./notascredito.component.scss']
})
export class NotascreditoComponent implements OnInit {

  public perfilUsuario:string = '';
  public funcionario:any = {};
  public filtro_cod_nota:string = '';
  public filtro_cod_factura:string = '';
  public filtro_fecha_nota:any = '';
  public filtro_funcionario:string = '';
  public filtro_cliente:string = '';
  public filtro_tipo_fact:string = '';
  public page1 = 1;
  public maxSize = 15;
  public TotalItems1:number;
  public Cargando=false;
  public Notas:any = [];
  public Servicios:any=[];
  myDateRangePickerOptions1: IMyDrpOptions = {
    width:'120px', 
    height: '21px',
    selectBeginDateTxt:'Inicio',
    selectEndDateTxt:'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };
  constructor(private http: HttpClient, public globales: Globales, private route: ActivatedRoute, private location: Location) { 
    // this.perfilUsuario = localStorage.getItem('miPerfil');
    // this.funcionario = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
    console.log(this.funcionario);
    
    // this.getServicios();


  }

  ngOnInit() {
    this.ListarDetallesFacturacion();
  }

  ListarDetallesFacturacion() {
    this.Cargando = true;
    let params = this.route.snapshot.queryParams;

    let queryString = '';
    
    if (Object.keys(params).length > 0) { // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page1 = params.pag ? params.pag : 1;
      this.filtro_cod_nota = params.cod_nota ? params.cod_nota : '';
      this.filtro_cod_factura = params.cod_factura ? params.cod_factura : '';
      this.filtro_fecha_nota = params.fecha_nota ? params.fecha_nota : '';
      this.filtro_funcionario = params.funcionario ? params.funcionario : '';
      this.filtro_cliente = params.cliente ? params.cliente : '';

      queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    }
    
    this.http.get(environment.ruta + '/php/notas_credito_nuevo/get_notas_creditos.php?'+queryString).subscribe((data: any) => {
      this.Cargando = false;
      this.Notas = data.Notas_Credito;
      this.TotalItems1 = data.numReg;
    });
  }

  paginacion() {

    let params:any = {
      pag: this.page1
    };
  console.log('page', this.page1);
  
    if (this.filtro_cod_nota != "") {
      params.cod_nota= this.filtro_cod_nota;
    }
    if (this.filtro_cod_factura != "") {
      params.cod_factura= this.filtro_cod_factura;
    }
    if (this.filtro_fecha_nota != "" && this.filtro_fecha_nota != null) {
      if (typeof(this.filtro_fecha_nota)=='object') {
        this.filtro_fecha_nota = this.filtro_fecha_nota.formatted;
      }
      params.fecha_nota = this.filtro_fecha_nota.formatted ;
    }
    if (this.filtro_funcionario != "") {
      params.funcionario = this.filtro_funcionario;
    }
    if (this.filtro_cliente != "") {
      params.cliente = this.filtro_cliente;
    }
    if (this.filtro_tipo_fact != "") {
      params.tipo = this.filtro_tipo_fact;
    }



    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
   this.Cargando = true;
    this.location.replaceState('/notascreditonuevo', queryString);
    
    this.http.get(environment.ruta + '/php/notas_credito_nuevo/get_notas_creditos.php?'+queryString).subscribe((data: any) => {
      this.Notas = data.Notas_Credito;
      this.TotalItems1 = data.numReg;
      this.Cargando = false;
    });
  }
  filtros1() {
    let params:any = {};

    if (this.filtro_cod_nota != "" || this.filtro_cod_factura != "" || this.filtro_fecha_nota != ""  || this.filtro_funcionario != "" || this.filtro_cliente != "" || this.filtro_tipo_fact != "") {
      this.page1 = 1;
      params.pag = this.page1;
      
      if (this.filtro_cod_nota != "") {
        params.cod_nota= this.filtro_cod_nota;
      }
      if (this.filtro_cod_factura != "") {
        params.cod_factura= this.filtro_cod_factura;
        
      }
      if (this.filtro_fecha_nota != "" && this.filtro_fecha_nota != null) {
        if (typeof(this.filtro_fecha_nota)=='object') {
          this.filtro_fecha_nota = this.filtro_fecha_nota.formatted;
        }
        params.fecha_nota = this.filtro_fecha_nota;
      }
     
      if (this.filtro_funcionario != "") {
        params.funcionario = this.filtro_funcionario;
      }
      if (this.filtro_cliente != "") {
        params.cliente = this.filtro_cliente;
      }
      if (this.filtro_tipo_fact != "") {
        params.tipo = this.filtro_tipo_fact;
      }
      

      let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

      this.location.replaceState('/notascreditonuevo', queryString);
    this.Cargando = true;
      this.http.get(environment.ruta + '/php/notas_credito_nuevo/get_notas_creditos.php?'+queryString).subscribe((data: any) => {
        this.Notas = data.Notas_Credito;
        this.TotalItems1 = data.numReg;
        this.Cargando = false;
      });
    } else {
      this.location.replaceState('/notascreditonuevo', '');

      this.page1 = 1;
      this.filtro_fecha_nota = '';
      this.filtro_cod_nota = '';
      this.filtro_cod_factura = '';
      this.filtro_funcionario = '';
      this.filtro_cliente = '';
      this.filtro_tipo_fact = '';
      this.Cargando = true;
      this.http.get(environment.ruta + '/php/notas_credito_nuevo/get_notas_creditos.php?').subscribe((data: any) => {
        this.Notas = data.Notas_Credito;
        this.TotalItems1 = data.numReg; 
        this.Cargando = false;
      });
    }
  }

  dateRangeChanged1(event) {
    
    if (event.formatted != "") {
      this.filtro_fecha_nota = event.formatted;
    } else {
      this.filtro_fecha_nota = '';
    }
    console.log('fecha date_R', this.filtro_fecha_nota);
    this.filtros1();
  }
  /* getServicios(){
    this._tiposervicio.GetServiciosTipoServicio().subscribe((data:any)=>{
      this.Servicios=data;
    })
  } */

}
