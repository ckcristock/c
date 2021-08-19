import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DepartamentosService } from './departamentos.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export class DepartamentosComponent implements OnInit {
  @ViewChild('modalM') modalM:any;
  @ViewChild('modalD') modalD:any;

  municipios:any = [];
  munic:any = [];
  municipality:any = {};

  departamentos:any = [];
  department:any = {};

  formD = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  formM = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    department_id: new FormControl('', [Validators.required]),
    codigo_dane: new FormControl('', [Validators.required])
  });

  paginationD = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }

  paginationM = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }

  filtroDeparmento:any = {
    name: ''
  }
  filtroMunicipio:any = {
    code: '',
    name: '',
    codigo_dane: ''
  }
  constructor( private depService:DepartamentosService ) { }

  ngOnInit(): void {
    this.getAllMunicipalities();
    this.getAllDepartment();
    this.getMunicipalities();
  }

  /********************* Municipalities ******************/

  getAllMunicipalities(page = 1){
    this.paginationM.page = page;
    let params = {
      ...this.paginationM, ...this.filtroMunicipio
    } 
    this.depService.getMunicipalityPaginate(params)
    .subscribe( (res:any) => {
      this.municipios = res.data.data;
      this.paginationM.collectionSize = res.data.total;
    });
  }
  /* Función para llevar los departamentos al select del formulario */
  getMunicipalities(){
    this.depService.getAllMunicipalities()
    .subscribe( (res:any) =>{
      this.munic = res.data;    
    });
  }
  /*********/
  openModalM(){
    this.municipality.name = '';
    this.municipality.code = '';
    this.municipality.department_id = '';
    this.municipality.codigo_dane = '';
    this.modalM.show();
  }
  
  createNewMunicipality(){
    if (this.formM.valid) {
      this.depService.createNewMunicipality(this.municipality)
      .subscribe( (res:any) => {
        
        if (res.code === 200) {
          
          this.getAllMunicipalities();
          this.modalM.hide();
          Swal.fire({
            title: 'Operación exitosa',
            text: 'Felicidades, se ha registrado el nuevo Municipio',
            icon: 'success',
            allowOutsideClick: false,
            allowEscapeKey: false
          })
          
        } else {
          
          Swal.fire({
            title: 'UPS',
            text: 'Algunos datos ya existen en la base de datos',
            icon: 'error',
            allowOutsideClick: false,
            allowEscapeKey: false
          })
          
        }
        
      });
    }
  }
  
  
  /* getMunicipality(municipality){
    this.municipio = {...municipality};
  } */
  
  /********************* Departments ******************/
  
  getAllDepartment( page = 1 ){
    this.paginationD.page = page;
    let params = {
      ...this.paginationD, ...this.filtroDeparmento
    } 
    this.depService.getDepartmentPaginate(params)
    .subscribe( (res:any) =>{
      this.paginationD.collectionSize = res.data.total;
      this.departamentos = res.data.data;
      console.log(this.paginationD.collectionSize);
    });
  }
  
  openModalD(){
    this.department.name = '';
    this.modalD.show();
  }

  getDepartment(department){
    this.department = department;
  }

  createNewDepartment(){
    if (this.formD.valid) {
      this.depService.createNewDepartment(this.department)
      .subscribe( (res:any) => {
        Swal.fire({
          title: 'Operación exitosa',
          text: 'Felicidades, se ha registrado el nuevo Departamento',
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false
        })
        this.getAllDepartment();
        this.modalD.hide();
      });
    } 
  }

}
