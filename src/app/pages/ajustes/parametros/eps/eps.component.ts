import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EpsService } from './eps.service';

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
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    nit: new FormControl('', [Validators.required])
  });
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }
  status:any = 'Inactivo';
  loading:boolean = false;

  constructor( private epsService: EpsService ) { }

  ngOnInit(): void {
    this.getAllEps();
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


  registerNull(eps){
    this.eps = eps;

  }

  openModal(){
    this.eps.id = '';
    this.eps.name = '';
    this.eps.code = '';
    this.eps.nit = '';
    this.modal.show();
    this.form.reset();
  }

  getEps(eps){
    /* this.eps = Object.assign({},eps) ; */
    this.eps = {...eps} ;
  }

  createNewEps(){
      this.form.markAllAsTouched();
      if (this.form.invalid) { return false;}
      this.epsService.createNewEps(this.eps)
      .subscribe( (res:any) => {

        if (res.code === 200) {

          this.getAllEps();
          this.modal.hide();
          Swal.fire({
            title: 'Operación exitosa',
            text: 'Felicidades, se han actualizado las EPS.',
            icon: 'success',
            allowOutsideClick: false,
            allowEscapeKey: false
          })
        } else {

          Swal.fire({
            title: 'Ooops!',
            text: 'Algunos datos ya existen en la base de datos.',
            icon: 'error',
            allowOutsideClick: false,
            allowEscapeKey: false
          })

        }
      });      
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
