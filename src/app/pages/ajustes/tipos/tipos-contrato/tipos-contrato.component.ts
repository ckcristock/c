import { Component, OnInit, ViewChild } from '@angular/core';
import { TiposContratoService } from './tipos-contrato.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-tipos-contrato',
  templateUrl: './tipos-contrato.component.html',
  styleUrls: ['./tipos-contrato.component.scss']
})
export class TiposContratoComponent implements OnInit {
  @ViewChild('modal') modal:any;
  pagination:any = {
    page: 5,
    pageSize: 1,
    collectionSize: 0
  }
  contracts:any[] = [];
  filtro:any = {
    name: ''
  }
  form: FormGroup;
  constructor( 
                private _tiposContratoService:TiposContratoService,
                private fb: FormBuilder,
                private _reactiveValid: ValidatorsService,  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', this._reactiveValid.required]
    })
  }

  getContractsType() {
    this._tiposContratoService.getContractsType(this.filtro)
    .subscribe( (res:any) => {
        this.contracts = res.data;
    });
  }

  get name_invalid() {
    return this.form.get('name').invalid && this.form.get('name').touched;
  }

}
