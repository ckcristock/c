import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FondoPensionService } from './fondo-pension.service';

@Component({
  selector: 'app-fondo-pension',
  templateUrl: './fondo-pension.component.html',
  styleUrls: ['./fondo-pension.component.scss']
})
export class FondoPensionComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  pensions:any[] = [];
  pension:any = {};
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
  constructor( private _fondoPensionService: FondoPensionService ) { }

  ngOnInit(): void {
    this.getPensionFunds();
  }

  openModal() {
    this.modal.show();
    this.pension.id = '';
    this.pension.name = '';
    this.pension.code = '';
    this.pension.nit = '';
  }

  getData(data) {
    this.pension = {...data}
  }

  getPensionFunds( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._fondoPensionService.getPensionFunds(params)
    .subscribe( (res:any) => {
      this.pensions = res.data.data;
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
      text: (status === 'Inactivo'? 'El Fondo de pensión se inactivará!' : 'El Fondo de pensión se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
    }).then((result) => {
      if (result.isConfirmed) {
        this._fondoPensionService.createPensionFund(data)
        .subscribe( res => {
          this.getPensionFunds();
          this.modal.hide();
          Swal.fire({
            title: (status === 'Inactivo' ? 'Fondo de Pensión Inhabilitado!' : 'Fondo de Pensión activado' ),
            text: (status === 'Inactivo' ? 'El Fondo de Pensión ha sido Inhabilitada con éxito.' : 'El Fondo de Pensión ha sido activada con éxito.'),
            icon: 'success'
          })
        } )
      }
    })
  }

  createPensionFund() {
    this._fondoPensionService.createPensionFund(this.pension)
    .subscribe( (res:any) => {
      if (res.code == 200) {
        this.getPensionFunds();
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
