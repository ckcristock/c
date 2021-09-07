import { Component, OnInit, ViewChild } from '@angular/core';
import { ArlService } from './arl.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-arl',
  templateUrl: './arl.component.html',
  styleUrls: ['./arl.component.scss']
})
export class ArlComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  arls:any[] = [];
  arl:any = {};
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
    accounting_account: new FormControl('', [Validators.required]),
    nit: new FormControl('', [Validators.required])
  })
  constructor( private _arlService:ArlService ) { }

  ngOnInit(): void {
    this.getArls();
  }

  openModal() {
    this.modal.show();
    this.arl.id = '';
    this.arl.name = '';
    this.arl.accounting_account = '';
    this.arl.nit = '';
  }

  getData( data ) {
    this.arl = {...data}
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
    this._arlService.createArl(this.arl)
    .subscribe( (res:any) => {
      if (res.code == 200) {

        this.getArls();
        this.modal.hide();
        Swal.fire({ 
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado a los paises con éxito.'
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
    })
  }

}
