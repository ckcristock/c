import { Component, OnInit, ViewChild } from '@angular/core';
import { TiposSalarioService } from './tipos-salario.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-tipos-salario',
  templateUrl: './tipos-salario.component.html',
  styleUrls: ['./tipos-salario.component.scss']
})
export class TiposSalarioComponent implements OnInit {
  @ViewChild('modal') modal:any;
  lists:any;
  salaries:any[] = [];
  form:FormGroup;
  pagination:any = {
    page: 5,
    pageSize: 1,
    collectionSize: 0
  }
  filtro:any = {
    name: ''
  }
  constructor( 
                private _typesSalaryService:TiposSalarioService, 
                private fb: FormBuilder,
                private _reactiveValid: ValidatorsService  ) { }

  ngOnInit(): void {
    this.getSalaryTypes();
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

  getSalaryTypes() {
   /*  this._typesSalaryService.getSalaryTypes()
    .subscribe( (res:any) => {
      this.salaries = res.data.data;
      console.log(this.salaries);
    }); */
  }

  /* getSalaryTypesList() {
    this._typesSalaryService.getSalaryTypesList()
    .subscribe( (res:any) => {
      this.lists = res.data;
    })
  } */

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
   /*  this._typesSalaryService.createSalaryType( data )
    .subscribe( res => {
      this.getSalaryTypes();
    }); */
  }

  /* getTypeContract(type) {
  this.type = type;
  console.log(this.type.id);
  
  } */

  createSalaryType() {
   /*  this._typesSalaryService.createSalaryType( this.form.value )
    .subscribe( res => {
      console.log(res);
      this.getSalaryTypes();
      this.modal.hide();
    } ) */
  }

}
