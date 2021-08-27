import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-memorandos',
  templateUrl: './memorandos.component.html',
  styleUrls: ['./memorandos.component.scss']
})
export class MemorandosComponent implements OnInit {
  @ViewChild('modalMotivo') modalMotivo:any;
  @ViewChild('modalMemorando') modalMemorando:any;
  formMotivo:FormGroup;
  formMemorando:FormGroup;
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 5
  }
  constructor( private fb: FormBuilder,  private _reactiveValid: ValidatorsService ) { }

  ngOnInit(): void {
    this.createFormMotivo();
    this.createFormMemorando();
  }

  openMotivo(){
    this.modalMotivo.show();
  }

  openMemorando(){
    this.modalMemorando.show();
  }

  createFormMotivo(){
    this.formMotivo = this.fb.group({
      person: ['', this._reactiveValid.required],
    }); 
  }
  createFormMemorando(){
    this.formMemorando = this.fb.group({
      person: ['', this._reactiveValid.required],
    }); 
  }

}
