import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FondoCesantiasService } from './fondo-cesantias.service';
import { ValidatorsService } from '../services/reactive-validation/validators.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fondo-cesantias',
  templateUrl: './fondo-cesantias.component.html',
  styleUrls: ['./fondo-cesantias.component.scss']
})
export class FondoCesantiasComponent implements OnInit {
  @ViewChild('modal') modal:any
  loading:boolean = false;
  selected:any;
  severances:any[] = [];
  severance:any = {};
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro:any = {
    name: ''
  }
  form: FormGroup;
  constructor( 
                private _fondoCensatiasService: FondoCesantiasService,
                private fb:FormBuilder,
                private _validators: ValidatorsService ) { }

  ngOnInit(): void {
    this.createForm();
    this.getSeveranceFunds();
  }

  openModal() {
    this.modal.show();
    this.form.reset();
    this.selected = 'Nuevo Fondo de Cesantias';
  }

  getSeverance(severance) {
    this.severance = {...severance}
    this.selected = 'Actualizar Fondo de Cesantias';
    this.form.patchValue({
      id: this.severance.id,
      name: this.severance.name,
      nit: this.severance.nit
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.severance.nit],
      name: ['', this._validators.required],
      nit: ['', this._validators.required]
    });
  }

  getSeveranceFunds( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._fondoCensatiasService.getSeveranceFunds(params)
    .subscribe( (res:any) =>{
      this.severances = res.data.data;
      this.pagination.collectionSize = res.data.total;
      this.loading = false;
    })
  }

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo'? 'El Fondo de Cesantia se inactivará!' : 'El Fondo de Cesantia se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
    }).then((result) => {
      if (result.isConfirmed) {
        this._fondoCensatiasService.createSeveranceFunds(data)
        .subscribe( res => {
          this.getSeveranceFunds();
          Swal.fire({
            title: (status === 'Inactivo' ? 'Fondo de Cesantia Inhabilitado!' : 'Fondo de Cesantia activado' ),
            text: (status === 'Inactivo' ? 'El Fondo de Cesantia ha sido Inhabilitado con éxito.' : 'El Fondo de Cesantia ha sido activado con éxito.'),
            icon: 'success'
          })
        } )
      }
    })
  }

  createSeveranceFunds() {
    this._fondoCensatiasService.createSeveranceFunds(this.form.value)
    .subscribe( (res:any) => {
      this.modal.hide();
      this.getSeveranceFunds();
      Swal.fire({
        icon: 'success',
        title: res.data
      })
    },
    err => {
      Swal.fire({
        icon: 'error',
        title: err.error.errors.nit
      })
    }
    );
  }


}
