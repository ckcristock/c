import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {  HttpClient } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { IMyDrpOptions } from 'mydaterangepicker';
import { environment } from 'src/environments/environment';
import { JobService } from './job.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html',
  styleUrls: ['./vacantes.component.scss']
})



export class VacantesComponent implements OnInit {

  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  }
  loading = false;

  timeout: any;
  user: any;
  page = 1;
  filtro_Fecha: any='';
  filtro_Fecha_Inicio: string='';
  filtro_Fecha_Fin: string='';
  filtro_titulo: string='';
  filtro_dependencia: string='';
  filtro_Cargo: string='';
  filtro_departamento: any='';
  filtro_municipio: any='';
  filtro_estado: string='';
  Cargando: boolean=false;
  jobs:any = [];
  maxSize = 15;
  TotalItems:number;
  myDateRangePickerOptions: IMyDrpOptions = {
    width:'100px',
    height: '21px',
    selectBeginDateTxt:'Inicio',
    selectEndDateTxt:'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  constructor( 
    private http: HttpClient, 
    private location: Location,
    private route: ActivatedRoute,
    private _job: JobService
    ) {
    this.getJobs(1);
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

    

  }

  getJobs(page){
    this.loading = true;
    this.pagination.page = page;
    this._job.getJobs().subscribe((r:any)=>{
      this.jobs = r.data.data
      this.loading = false;
      this.pagination.collectionSize = r.data.total
    })
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

  cancelar(id){
    Swal.fire({
      title: '¿Seguro?',
      text: 'Se va a CANCELAR una nueva vacante',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Si, Hazlo!'
    }).then(result => {
      if (result.value) {
        this.sendData(id);
      }
    });
   
  }

  sendData(id){
    this._job.setState(id,{ state:'Cancelada' }).subscribe((r: any) => {

      if( r.code == 200 ){
        Swal.fire({
            title: 'Creación exitosa',
            text: 'Felicidades, se ha actualizado la vacante',
            icon: 'success',
           
          })
    }
       this.getJobs(1);
    });
  }
}
