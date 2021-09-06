import { Component, OnInit, ViewChild } from '@angular/core';
import { TiposContratoService } from './tipos-contrato.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import swal from 'sweetalert2';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-tipos-contrato',
  templateUrl: './tipos-contrato.component.html',
  styleUrls: ['./tipos-contrato.component.scss']
})
export class TiposContratoComponent implements OnInit {
  @ViewChild('modal') modal:any;
  pagination:any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  types = consts.contract_type;
  contracts:any[] = [];
  type:any = {};
  filtro:any = {
    name: '',
    description: ''
  }
  form: FormGroup;
  constructor( 
                private _tiposContratoService:TiposContratoService,
                private fb: FormBuilder,
                private _reactiveValid: ValidatorsService,  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getContractsType();
  }

  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', this._reactiveValid.required]
    })
  }

  getContractsType( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this._tiposContratoService.getContractsType(params)
    .subscribe( (res:any) => {
        this.contracts = res.data.data;
        this.pagination.collectionSize = res.data.total
        this.form.patchValue({
          id: this.type.id
        })
    });
  }

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
    this._tiposContratoService.createNewContract_type( data )
    .subscribe( res => {
      this.getContractsType();
    });
  }

  getTypeContract(type) {
  this.type = type;
  console.log(this.type.id);
  
  }

  createContractType() {
    this._tiposContratoService.createNewContract_type( this.form.value )
    .subscribe( res => {
      swal.fire({
        icon: 'success',
        title: 'Tipo de contrato creado',
        text: 'Tipo de contrato ha sido creado con éxito'
      });
      this.getContractsType();
      this.modal.hide();
    });
  }

  get name_invalid() {
    return this.form.get('name').invalid && this.form.get('name').touched;
  }

}
