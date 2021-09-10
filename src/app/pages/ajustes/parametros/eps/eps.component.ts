import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { EpsService } from './eps.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-eps',
  templateUrl: './eps.component.html',
  styleUrls: ['./eps.component.scss']
})
export class EpsComponent implements OnInit {
  @ViewChild('modal') modal:any;
  epss: any = [];
  eps: any = {};
  filtros:any = {
    name: '',
    code: ''
  }
  selected:any;
  form:FormGroup;
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }
  status:any = 'Inactivo';
  loading:boolean = false;

  constructor( private epsService: EpsService, private fb: FormBuilder, private _validators:ValidatorsService ) { }

  ngOnInit(): void {
    this.getAllEps();
    this.createForm();
  }
  openModal(){
    this.modal.show();
    this.form.reset();
    this.selected = 'Nueva EPS'
  }

  getEps(eps){
    this.eps = {...eps};
    this.selected = 'Actualizar EPS'
    this.form.patchValue({
      id: this.eps.id,
      name: this.eps.name,
      code: this.eps.code,
      nit: this.eps.nit
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.eps.id],
      name: ['', this._validators.required],
      code: ['', this._validators.required],
      nit: ['', this._validators.required]
    });
  }

  getAllEps( page = 1 ){
    
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this.epsService.getAllEps(params)
    .subscribe( (res:any) => {
      this.loading = false;
      this.epss = res.data.data;
      this.pagination.collectionSize = res.data.total;
    });
  }

  anularOActivar(zone, status){
    let data:any = {
      id:zone.id,
      status
    }
      Swal.fire({
        title: '¿Estas seguro?',
        text: (status === 'Inactivo'? 'La EPS se Inactivará!' : 'La EPS se activará'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
      }).then((result) => {
        if (result.isConfirmed) {
          this.epsService.createNewEps(data)
          .subscribe( res =>{
            this.getAllEps();
            Swal.fire({
              title: (status === 'Inactivo' ? 'EPS Inhabilitada!' : 'EPS activada' ) ,
              text: (status === 'Inactivo' ? 'La EPS ha sido Inhabilitada con éxito.' : 'La EPS ha sido activada con éxito.'),
              icon: 'success'
            })
          } )
        }
      })
  }


  createNewEps(){
      this.form.markAllAsTouched();
      if (this.form.invalid) { return false;}
      this.epsService.createNewEps(this.form.value)
      .subscribe( (res:any) => {
        console.log(res);
          this.getAllEps();
          this.modal.hide();
          Swal.fire({
            title: res.data,
            icon: 'success',
            allowOutsideClick: false,
            allowEscapeKey: false
          }) 
      },
      err => {
        Swal.fire({
          title: 'Ooops!',
          html: err.error.errors.code + '<br>' + err.error.errors.nit,
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false
        })
      }
      );      
  }

  get name_eps_valid(){
    return (
      this.form.get('name').invalid && this.form.get('name').touched
    )
  }

  get code_eps_valid(){
    return (
      this.form.get('code').invalid && this.form.get('code').touched
    )
  }

  get nit_eps_valid(){
    return (
      this.form.get('nit').invalid && this.form.get('nit').touched
    )
  }
  

}
