import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CentroCostosService } from './centro-costos.service';
import { consts } from '../../../core/utils/consts';
import { ValidatorsService } from '../../ajustes/informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-centro-costos',
  templateUrl: './centro-costos.component.html',
  styleUrls: ['./centro-costos.component.scss']
})
export class CentroCostosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  costs:any;
  title:any;
  options = consts.options;
  form:FormGroup;
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros:any = {
    code: '',
    name: ''
  }
  constructor( 
                private fb:FormBuilder,
                private _centroCostosService: CentroCostosService,
                private _validators: ValidatorsService  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  openModal() {
    this.modal.show();
    this.title = 'Nuevo Centro de Costo'
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', this._validators.required],
      code: ['', this._validators.required],
      parent_center_id: ['', this._validators.required],
      center_type_id: ['', this._validators.required],
      center_type_value: ['', this._validators.required],
      status: ['', this._validators.required],
      movement: ['', this._validators.required]
    });
  }

  getCostCenter() {
    this._centroCostosService.getCostCenter()
    .subscribe( (res:any) =>{
      this.costs = res.data.data;
    });
  }

  createCostCenter() {
    this._centroCostosService.createCostCenter( this.form.value )
    .subscribe( (res:any) =>{
    });
  }

}
