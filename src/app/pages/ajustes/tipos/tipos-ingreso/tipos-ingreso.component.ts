import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { consts } from '../../../../core/utils/consts';
import { TiposIngresoService } from './tipos-ingreso.service';

@Component({
  selector: 'app-tipos-ingreso',
  templateUrl: './tipos-ingreso.component.html',
  styleUrls: ['./tipos-ingreso.component.scss']
})
export class TiposIngresoComponent implements OnInit {

  @ViewChild('modal') modal:any;
  loading:boolean = false;
  selected:any;
  ingresss:any[] = [];
  ingress:any = {};
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro:any = {
    name: ''
  }
  form: FormGroup;
  ingressTypes = consts.Ingresstypes;
  constructor( 
                private _ingressTypeService: TiposIngresoService,
                private _validators: ValidatorsService,
                private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.getIngressType();
    this.createForm();
  }

  openModal() {
    this.modal.show();
    this.form.reset();
    this.selected = 'Nuevo Tipo de Ingreso';
  }
  
    getIngress(  egress ) {
      this.ingress = {...egress}
      this.selected = 'Actualizar Tipo de Ingreso'
      this.form.patchValue({
        id: this.ingress.id,
        name: this.ingress.name,
        associated_account: this.ingress.associated_account,
        type: this.ingress.type
      });
    }

  createForm() {
    this.form = this.fb.group({
      id: [this.ingress.id],
      name: ['', this._validators.required],
      associated_account: ['', this._validators.required],
      type: ['', this._validators.required]
    });
  }

  getIngressType( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._ingressTypeService.getIngressType(params)
    .subscribe( (res:any) =>{
      this.ingresss = res.data.data;
      this.pagination.collectionSize = res.data.total;
      this.loading = false;
    });
  }

  createIngressType() {
    this._ingressTypeService.createIngressType(this.form.value)
    .subscribe( (res:any) => {
      this.modal.hide();
      this.getIngressType();
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
      text: (status === 'Inactivo'? 'El Tipo Ingreso se inactivará!' : 'El Tipo Ingreso se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
    }).then((result) => {
      if (result.isConfirmed) {
        this._ingressTypeService.createIngressType(data)
        .subscribe( res => {
          this.getIngressType();
          Swal.fire({
            title: (status === 'Inactivo' ? 'Tipo de Ingreso Inhabilitado!' : 'Tipo de Ingreso activado' ),
            text: (status === 'Inactivo' ? 'El Tipo de Ingreso ha sido Inhabilitada con éxito.' : 'El tipo de Ingreso ha sido activada con éxito.'),
            icon: 'success'
          });
        });
      }
    });
  }

}
