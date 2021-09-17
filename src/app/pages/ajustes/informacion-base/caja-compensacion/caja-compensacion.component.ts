import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { CompensationFundsService } from '../services/compensationFunds.service';
import { CajaCompensacionService } from './caja-compensacion.service';
import { ValidatorsService } from '../services/reactive-validation/validators.service';

@Component({
  selector: 'app-caja-compensacion',
  templateUrl: './caja-compensacion.component.html',
  styleUrls: ['./caja-compensacion.component.scss']
})
export class CajaCompensacionComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  selected:any;
  compensations:any[] = [];
  compensation:any = {};
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro:any = {
    name: ''
  }
  form:FormGroup;
  constructor( 
                private _compensationService: CajaCompensacionService, 
                private fb:FormBuilder,
                private _validators: ValidatorsService ) { }

  ngOnInit(): void {
    this.getCompensationFunds();
    this.createForm();
  }

  openModal() {
    this.modal.show();
    this.form.reset();
    this.selected = 'Nueva Caja de Compensación';
  }

  getData(data) {
    this.compensation = {...data};
    this.selected = 'Actualizar Caja de Compensación';
    this.form.patchValue({
      id: this.compensation.id,
      name: this.compensation.name,
      code: this.compensation.code,
      nit: this.compensation.nit
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.compensation.id],
      name: ['', this._validators.required],
      code: ['', this._validators.required],
      nit: ['', this._validators.required]
    });
  }

  getCompensationFunds( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._compensationService.getCompensationFund(params)
    .subscribe( (res:any) => {
      this.compensations = res.data.data;
      this.pagination.collectionSize = res.data.total;
      this.loading = false
    })
  }

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo'? 'La Caja de Compensación se inactivará!' : 'La Caja de Compensación se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
    }).then((result) => {
      if (result.isConfirmed) {
        this._compensationService.createCompensationFund(data)
        .subscribe( res => {
          this.getCompensationFunds();
          this.modal.hide();
          Swal.fire({
            title: (status === 'Inactivo' ? 'Caja de Compensación Inhabilitada!' : 'Caja de Compensación activada' ),
            text: (status === 'Inactivo' ? 'La Caja de Compesación ha sido Inhabilitada con éxito.' : 'La Caja de Compensación ha sido activada con éxito.'),
            icon: 'success'
          })
        } )
      }
    })
  }

  createCompensationFund() {
    this._compensationService.createCompensationFund(this.form.value)
    .subscribe( (res:any) => {
        this.modal.hide();
        this.getCompensationFunds();
        Swal.fire({ 
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado con éxito.'
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
      })
  }

}
