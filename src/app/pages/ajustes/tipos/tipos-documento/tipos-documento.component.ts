import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-tipos-documento',
  templateUrl: './tipos-documento.component.html',
  styleUrls: ['./tipos-documento.component.scss']
})
export class TiposDocumentoComponent implements OnInit {
  @ViewChild('modal') modal:any;
  pagination:any = {
    page: 5,
    pageSize: 1,
    collectionSize: 0
  }
  form:FormGroup;
  filtro:any = {
    name: '',
    code: ''
  }
  constructor( 
              private fb:FormBuilder, 
              private _reactiveValid: ValidatorsService,
     ) { }

  ngOnInit(): void {
    this.createForm();
  }

  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', this._reactiveValid.required],
      code: ['', this._reactiveValid.required]
    })
  }

  get name_invalid(){
    return (this.form.get('name').invalid && this.form.get('name').touched);
  }

  get code_invalid() {
    return this.form.get('code').invalid && this.form.get('code').touched;
  }

}
