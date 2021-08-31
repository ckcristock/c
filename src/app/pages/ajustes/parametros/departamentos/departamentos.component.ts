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
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  departamentos:any = [];
  department:any = {};
  form = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0
  }

  filtro:any = {
    name: ''
  }
  constructor( private depService:DepartamentosService ) { }

  ngOnInit(): void {
    this.getAllDepartment();
  }
  
  getAllDepartment( page = 1 ){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    } 
    this.loading = true;
    this.depService.getDepartmentPaginate(params)
    .subscribe( (res:any) =>{
      this.loading = false;
      this.pagination.collectionSize = res.data.total;
      this.departamentos = res.data.data;
    });
  }
  
  openModal(){
    this.department.name = '';
    this.modal.show();
    this.form.reset();
  }

  getDepartment(department){
    this.department = department;
  }

  createNewDepartment(){
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false;}
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
        this.modal.hide();
      });
  }

  get name_department(){
    return (
      this.form.get('name').invalid && this.form.get('name').touched
    )
  }

  

}
