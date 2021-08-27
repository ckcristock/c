import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-disciplinarios',
  templateUrl: './disciplinarios.component.html',
  styleUrls: ['./disciplinarios.component.scss']
})
export class DisciplinariosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form:FormGroup;
  /* loading = false; */
  process:any;
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }
  constructor( private fb:FormBuilder, private _reactiveValid: ValidatorsService ) { }

  ngOnInit(): void {
    this.createForm();
  }

  open(){
    this.modal.show();
  }

  createForm(){
    this.form = this.fb.group({
      person: ['', this._reactiveValid.required],
      initial_date: ['', Validators.required],
      end_date: ['', Validators.required],
      description: ['', this._reactiveValid.required],
    }); 
  }

  get person_valid(){
    return this.form.get('person').invalid && this.form.get('person').touched
  }

  /* get initial_date_valid(){
    return (this.form.get('initial_date').invalid && this.form.get('initial_date').touched)
  }
  get end_date_valid(){
    return (this.form.get('end_date').invalid && this.form.get('end_date').touched)
  } */
  get description_valid(){
    return this.form.get('description').invalid && this.form.get('description').touched
  }

}
