import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {  HttpClient } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { IMyDrpOptions } from 'mydaterangepicker';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html',
  styleUrls: ['./vacantes.component.scss']
})



export class VacantesComponent implements OnInit {

  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('PlantillaEstado') PlantillaEstado: TemplateRef<any>;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('PlantillaFoto') PlantillaFoto: TemplateRef<any>;
  
   
  timeout: any;
  public user: any;
  public page = 1;
  public filtro_Fecha: any='';
  public filtro_Fecha_Inicio: string='';
  public filtro_Fecha_Fin: string='';
  public filtro_titulo: string='';
  public filtro_dependencia: string='';
  public  filtro_Cargo: string='';
  public filtro_departamento: any='';
  public filtro_municipio: any='';
  public filtro_estado: string='';
  public Cargando: boolean=false;
  public Lista_Vacantes:any = [
    { Fecha:'04/08/2021', Fecha_Inicio:'04/08/2021' , Fecha_Fin:'09/08/2021' , Titulo_Vacante:'Pruebas ', NDependencia:'Tecnología', NCargo:'Analista de datos' , NDepartamento:'Santander', NMunicipio:'Santander', Estado:'Activo' },
    { Fecha:'04/08/2021', Fecha_Inicio:'04/08/2021' , Fecha_Fin:'09/08/2021' , Titulo_Vacante:'Pruebas ', NDependencia:'Tecnología', NCargo:'Analista de datos' , NDepartamento:'Santander', NMunicipio:'Santander', Estado:'Activo' },
    { Fecha:'04/08/2021', Fecha_Inicio:'04/08/2021' , Fecha_Fin:'09/08/2021' , Titulo_Vacante:'Pruebas ', NDependencia:'Tecnología', NCargo:'Analista de datos' , NDepartamento:'Santander', NMunicipio:'Santander', Estado:'Activo' },
    { Fecha:'04/08/2021', Fecha_Inicio:'04/08/2021' , Fecha_Fin:'09/08/2021' , Titulo_Vacante:'Pruebas ', NDependencia:'Tecnología', NCargo:'Analista de datos' , NDepartamento:'Santander', NMunicipio:'Santander', Estado:'Activo' },
    { Fecha:'04/08/2021', Fecha_Inicio:'04/08/2021' , Fecha_Fin:'09/08/2021' , Titulo_Vacante:'Pruebas ', NDependencia:'Tecnología', NCargo:'Analista de datos' , NDepartamento:'Santander', NMunicipio:'Santander', Estado:'Activo' },
    { Fecha:'04/08/2021', Fecha_Inicio:'04/08/2021' , Fecha_Fin:'09/08/2021' , Titulo_Vacante:'Pruebas ', NDependencia:'Tecnología', NCargo:'Analista de datos' , NDepartamento:'Santander', NMunicipio:'Santander', Estado:'Activo' },
    { Fecha:'04/08/2021', Fecha_Inicio:'04/08/2021' , Fecha_Fin:'09/08/2021' , Titulo_Vacante:'Pruebas ', NDependencia:'Tecnología', NCargo:'Analista de datos' , NDepartamento:'Santander', NMunicipio:'Santander', Estado:'Activo' },
    { Fecha:'04/08/2021', Fecha_Inicio:'04/08/2021' , Fecha_Fin:'09/08/2021' , Titulo_Vacante:'Pruebas ', NDependencia:'Tecnología', NCargo:'Analista de datos' , NDepartamento:'Santander', NMunicipio:'Santander', Estado:'Activo' },
    { Fecha:'04/08/2021', Fecha_Inicio:'04/08/2021' , Fecha_Fin:'09/08/2021' , Titulo_Vacante:'Pruebas ', NDependencia:'Tecnología', NCargo:'Analista de datos' , NDepartamento:'Santander', NMunicipio:'Santander', Estado:'Activo' },
    { Fecha:'04/08/2021', Fecha_Inicio:'04/08/2021' , Fecha_Fin:'09/08/2021' , Titulo_Vacante:'Pruebas ', NDependencia:'Tecnología', NCargo:'Analista de datos' , NDepartamento:'Santander', NMunicipio:'Santander', Estado:'Activo' },
  ];
  public maxSize = 15;
  public TotalItems:number;
  myDateRangePickerOptions: IMyDrpOptions = {
    width:'100px',
    height: '21px',
    selectBeginDateTxt:'Inicio',
    selectEndDateTxt:'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  constructor( private http: HttpClient, private location: Location, private route: ActivatedRoute) {
   /*  this.ListarVacantes(); */
  }

  ngOnInit() {
   /*  this.user = JSON.parse(localStorage.getItem("User")); */

  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      // console.log('paged!', event);
    }, 100);
  }

  dateRangeChanged(event) {

    if (event.formatted != "") {
      this.filtro_Fecha = event;
    } else {
      this.filtro_Fecha = '';
    }

    this.filtros();
  }

  ListarVacantes() {
    let params = this.route.snapshot.queryParams;
    let queryString = '';

    if (Object.keys(params).length > 0) { // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page = params.pag ? params.pag : 1;
      this.filtro_Fecha = params.fecha ? params.fecha : '';
      this.filtro_Fecha_Inicio = params.fechainicio ? params.fechainicio : '';
      this.filtro_Fecha_Fin = params.fechafin ? params.fechafin : '';
      this.filtro_titulo = params.titulo ? params.titulo : '';
      this.filtro_dependencia = params.dependencia ? params.dependencia : '';
      this.filtro_Cargo = params.cargo ? params.cargo : '';
      this.filtro_departamento = params.departamento ? params.departamento : '';
      this.filtro_municipio = params.municipio ? params.municipio : '';
      this.filtro_estado = params.estado ? params.estado : '';

      queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    }

    this.http.get( environment.base_url + 'php/vacantes/vacantes.php'+queryString).subscribe((data: any) => {
      this.Cargando = false;
     /*  this.Lista_Vacantes = data.vacantes; */
      this.TotalItems = data.numReg;
    });

  }

  paginacion() {
    let params:any = {
      pag: this.page
    };
    if (this.filtro_Fecha != "" && this.filtro_Fecha != null) {
      params.fecha= this.filtro_Fecha.formatted;
    }
    if (this.filtro_Fecha_Inicio != "") {
      params.fechainicio = this.filtro_Fecha_Inicio;
    }
    if (this.filtro_Fecha_Fin != "") {
      params.fechafin = this.filtro_Fecha_Fin;
    }
    if (this.filtro_titulo != "") {
      params.titulo = this.filtro_titulo;
    }
    if (this.filtro_dependencia != "") {
      params.dependencia = this.filtro_dependencia;
    }
    if (this.filtro_Cargo != "") {
      params.carg = this.filtro_Cargo;
    }
    if (this.filtro_departamento != "") {
      params.departamento = this.filtro_departamento;
    }
    if (this.filtro_municipio != "") {
      params.municipio = this.filtro_municipio;
    }
    if (this.filtro_estado != "") {
      params.estado = this.filtro_estado;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/vacantes', queryString);

    this.Cargando = true;

    this.http.get( environment.base_url + 'php/vacantes/vacantes.php?'+queryString).subscribe((data: any) => {
      this.Cargando = false;
     /*  this.Lista_Vacantes = data.vacantes; */
      this.TotalItems = data.numReg;
    });
  }

  filtros(){
    let params:any = {};

      if (this.filtro_Fecha != "" || this.filtro_Fecha_Inicio != "" || this.filtro_Fecha_Fin != "" || this.filtro_titulo != "" || this.filtro_dependencia != "" || this.filtro_Cargo != "" || this.filtro_departamento != "" ||this.filtro_municipio != "" ||this.filtro_estado) {
      this.page = 1;
      params.pag = this.page;

      if (this.filtro_Fecha != "" && this.filtro_Fecha != null) {
        params.fecha= this.filtro_Fecha.formatted;
      }
      if (this.filtro_Fecha_Inicio != "" && this.filtro_Fecha_Fin != "") {
        params.fechainicio = this.filtro_Fecha_Inicio;

        params.fechafin = this.filtro_Fecha_Fin;
      }
      if (this.filtro_titulo != "") {
        params.titulo = this.filtro_titulo;
      }
      if (this.filtro_dependencia != "") {
        params.dependencia = this.filtro_dependencia;
      }
      if (this.filtro_Cargo != "") {
        params.cargo = this.filtro_Cargo;
      }
      if (this.filtro_departamento != "") {
        params.departamento = this.filtro_departamento;
      }
      if (this.filtro_municipio != "") {
        params.municipio = this.filtro_municipio;
      }
      if (this.filtro_estado != "") {
        params.estado = this.filtro_estado;
      }

      let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

      this.location.replaceState('/vacantes', queryString);

      this.Cargando = true;

      this.http.get( environment.base_url + 'php/vacantes/vacantes.php?'+queryString).subscribe((data: any) => {
        this.Cargando = false;
       /*  this.Lista_Vacantes = data.vacantes; */
        this.TotalItems = data.numReg;
      });
    } else {
      this.location.replaceState('/vacantes', '');

      this.page = 1;
      this.filtro_Fecha = '';
      this.filtro_Fecha_Inicio = '';
      this.filtro_Fecha_Fin = '';
      this.filtro_titulo = '';
      this.filtro_dependencia = '';
      this.filtro_Cargo = '';
      this.filtro_departamento = '';
      this.filtro_municipio = '';
      this.filtro_estado = '';

      this.Cargando = true;

      this.http.get( environment.base_url+ 'php/vacantes/vacantes.php').subscribe((data: any) => {
        this.Cargando = false;
/*         this.Lista_Vacantes = data.vacantes; */
        this.TotalItems = data.numReg;
      });
    }
  }

  AnularVacante(id){
    let datos = new FormData();
    datos.append("modulo", 'Vacante');
    datos.append("id", id);
    this.http.post( environment.base_url+ 'php/vacantes/vacante_anular.php', datos).subscribe((data: any) => {
    this.deleteSwal.show();
    this.ListarVacantes();
    });
  }

}
