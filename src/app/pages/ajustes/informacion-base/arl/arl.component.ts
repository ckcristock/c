import { Component, OnInit, ViewChild } from '@angular/core';
import { ArlService } from './arl.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../services/reactive-validation/validators.service';

@Component({
  selector: 'app-arl',
  templateUrl: './arl.component.html',
  styleUrls: ['./arl.component.scss']
})
export class ArlComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  selected:any;
  arls:any[] = [];
  private arl:any = {};
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
                private _arlService:ArlService, 
                private fb: FormBuilder,
                private _validators: ValidatorsService ) { }

  ngOnInit(): void {
    this.getArls();
    this.createForm();
  }

  openModal() {
    this.modal.show();
    this.form.reset();
    this.selected = 'Nueva ARL';
  }

  getData( data ) {
    this.arl = {...data}
    this.selected = 'Actualizar ARL'
    this.form.patchValue({
      id: this.arl.id,
      name: this.arl.name,
      accounting_account: this.arl.accounting_account,
      nit: this.arl.nit
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.arl.id],
      name: ['', this._validators.required],
      accounting_account: ['', this._validators.required],
      nit: ['', this._validators.required],
    });
  }

  getArls(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._arlService.getArls(params)
    .subscribe( (res:any) => {
        this.arls = res.data.data;
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
      text: (status === 'Inactivo'? 'El Contrato se inactivará!' : 'El Contrato se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
    }).then((result) => {
      if (result.isConfirmed) {
        this._arlService.createArl(data)
        .subscribe( res => {
          this.getArls();
          this.modal.hide();
          Swal.fire({
            title: (status === 'Inactivo' ? 'Contrato Inhabilitado!' : 'Contrato activado' ),
            text: (status === 'Inactivo' ? 'El Contrato ha sido Inhabilitada con éxito.' : 'El Contrato ha sido activada con éxito.'),
            icon: 'success'
          })
        } )
      }
    })
  }

  createArl() {
    this._arlService.createArl(this.form.value)
    .subscribe( (res:any) => {
        this.getArls();
        this.modal.hide();
        Swal.fire({ 
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado a las ARL con éxito.'
        });
    },
    err => {
      Swal.fire({
        title: 'Ooops!',
        html: err.error.errors.nit,
        icon: 'error',
        allowOutsideClick: false,
        allowEscapeKey: false
      })
    }
    );
  }

  get name_invalid() {
    return this.form.get('name').invalid && this.form.get('name').touched;
  }

  get accounting_account_invalid() {
    return this.form.get('accounting_account').invalid && this.form.get('accounting_account').touched;
  }

  get nit_invalid() {
    return this.form.get('nit').invalid && this.form.get('nit').touched;
  }

}
