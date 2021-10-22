import { Component, OnInit } from '@angular/core';

import { IMyDrpOptions } from 'mydaterangepicker';
import { JobService } from './job.service';
import Swal from 'sweetalert2';
import { MinicipalityService } from '../../../core/services/municipality.service';
import { DepartmentService } from '../../../core/services/department.service';

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html',
  styleUrls: ['./vacantes.component.scss']
})



export class VacantesComponent implements OnInit {

  pagination = {
    page: 1,
    pageSize: 15,
    collectionSize: 0,
  }
  loading = false;
  timeout: any;
  user: any;
  page = 1;
  filtros = {
    fecha: '',
    fecha_Inicio:'',
    fecha_Fin:'',
    titulo:'',
    dependencia:'',
    cargo:'',
    departamento: '',
    municipio: '',
    estado:'',
  }
  jobs:any = [];
  TotalItems:number;
  municipalities:any[] = [];
  department:any[] = [];
  dependencies:any[] = [];
  positions:any[] = [];
  myDateRangePickerOptions: IMyDrpOptions = {
    width:'100px',
    height: '21px',
    selectBeginDateTxt:'Inicio',
    selectEndDateTxt:'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  constructor( 
                private _job: JobService,
                private _municipatilies: MinicipalityService,
                private _department: DepartmentService
              ) {}
    
    ngOnInit() {
      this.getJobs();
      this.getMunicipalities();
      this.getDepartments();
      this.getDependencies();
      this.getPositions();
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    }, 100);
  }

  dateRangeChanged(event) {
    if (event.formatted != "") {
      this.filtros.fecha = event;
    } else {
      this.filtros.fecha = '';
    }
  }

  getMunicipalities(){
    this._municipatilies.getMinicipalities().subscribe((r:any) => {
      this.municipalities = r.data;
    })
  }

  getDepartments(){
    this._department.getDepartments().subscribe((r:any) => {
      this.department = r.data;
    })
  }

  getDependencies(){
    this._job.getDependencies().subscribe((r:any) => {
      this.dependencies = r.data;
    })
  }

  getPositions(){
    this._job.getPositions().subscribe((r:any) => {
      this.positions = r.data;
    })
  }

  getJobs(page = 1){
    this.loading = true;
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this._job.getJobs(params).subscribe((r:any)=>{
      this.jobs = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total
    })
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
       this.getJobs();
    });
  }
}
