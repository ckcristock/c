import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TiposEgresoService } from './tipos-egreso.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import Swal from 'sweetalert2';
import { consts } from '../../../../core/utils/consts';

@Component({
  selector: 'app-tipos-egreso',
  templateUrl: './tipos-egreso.component.html',
  styleUrls: ['./tipos-egreso.component.scss']
})
export class TiposEgresoComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  selected:any;
  egresss:any[] = [];
  egress:any = {};
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro:any = {
    name: ''
  }
  form: FormGroup;
  egressTypes = consts.Egresstypes;
  constructor( 
                private _egressTypeService: TiposEgresoService,
                private _validators: ValidatorsService,
                private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.getEgressType();
    this.createForm();
  }

  openModal() {
    this.modal.show();
    this.form.reset();
    this.selected = 'Nuevo Tipo de Egreso';
  }
  
    getEgress(  egress ) {
      this.egress = {...egress}
      this.selected = 'Actualizar Tipo de Egreso';
      this.form.patchValue({
        id: this.egress.id,
        name: this.egress.name,
        associated_account: this.egress.associated_account,
        type: this.egress.type
      });
    }

  createForm() {
    this.form = this.fb.group({
      id: [this.egress.id],
      name: ['', this._validators.required],
      associated_account: ['', this._validators.required],
      type: ['', this._validators.required]
    });
  }

  getEgressType( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._egressTypeService.getEgresstype(params)
    .subscribe( (res:any) =>{
      this.egresss = res.data.data;
      this.pagination.collectionSize = res.data.total;
      this.loading = false;
    });
  }

  createEgressType() {
    this._egressTypeService.createEgressType(this.form.value)
    .subscribe( (res:any) => {
      this.modal.hide();
      this.getEgressType();
      Swal.fire({
        icon: 'success',
        title: res.data
      })
    })
  }

  activateOrInactivate(novelty, status) {
    let data = {
      id: novelty.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo'? 'El Tipo Egreso se inactivará!' : 'El Tipo Egreso se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
    }).then((result) => {
      if (result.isConfirmed) {
        this._egressTypeService.createEgressType(data)
        .subscribe( res => {
          this.getEgressType();
          Swal.fire({
            title: (status === 'Inactivo' ? 'Tipo de Egreso Inhabilitado!' : 'Tipo de Egreso activado' ),
            text: (status === 'Inactivo' ? 'El Tipo de Egreso ha sido Inhabilitada con éxito.' : 'El tipo de Egreso ha sido activada con éxito.'),
            icon: 'success'
          });
        });
      }
    });
  }

}
