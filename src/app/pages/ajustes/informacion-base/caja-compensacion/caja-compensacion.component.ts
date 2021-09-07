import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CompensationFundsService } from '../services/compensationFunds.service';
import { CajaCompensacionService } from './caja-compensacion.service';

@Component({
  selector: 'app-caja-compensacion',
  templateUrl: './caja-compensacion.component.html',
  styleUrls: ['./caja-compensacion.component.scss']
})
export class CajaCompensacionComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
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
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    nit: new FormControl('', [Validators.required])
  })
  constructor( private _compensationService: CajaCompensacionService ) { }

  ngOnInit(): void {
    this.getCompensationFunds();
  }

  openModal() {
    this.modal.show();
    this.compensation.id = '';
    this.compensation.name = '';
    this.compensation.code = '';
    this.compensation.nit = '';
  }

  getData(data) {
    this.compensation = {...data};
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
    this._compensationService.createCompensationFund(this.compensation)
    .subscribe( (res:any) => {
      console.log(res);
      if (res.code == 200) {
        this.modal.hide();
        this.getCompensationFunds();
        Swal.fire({ 
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado con éxito.'
        })
      } else {
        Swal.fire({
          title: 'Ooops!',
          text: res.err,
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false
        })
      }
    })
  }

}
