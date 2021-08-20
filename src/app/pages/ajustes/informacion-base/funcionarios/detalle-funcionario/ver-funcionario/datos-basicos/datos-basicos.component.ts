import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.component.html',
  styleUrls: ['./datos-basicos.component.scss']
})
export class DatosBasicosComponent implements OnInit {
  @ViewChild('modal') modal:any;

  form: FormGroup;
  constructor( private fb:FormBuilder ) { }

  ngOnInit(): void {
    this.createForm();
  }

  openModal(){
    this.modal.show();
  }

  createForm(){
    this.form = this.fb.group({
      image: ['', Validators.required],
      names: ['', Validators.required],
      subnames: ['', Validators.required],
      identifier: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      direction: ['', Validators.required],
      title: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      gener: ['', Validators.required],
      marital_status: ['', Validators.required],
      cell_phone: ['', Validators.required, Validators.minLength(5), Validators.maxLength(8)]
    }); 
  }

  get image_valid() {
    return (
      this.form.get('image').invalid && this.form.get('image').touched
    );
  }
  get identifier_valid() {
    return (
      this.form.get('identifier').invalid && this.form.get('identifier').touched
    );
  }
  get names_valid() {
    return (
      this.form.get('names').invalid && this.form.get('names').touched
    );
  }
  get subnames_valid() {
    return (
      this.form.get('subnames').invalid && this.form.get('subnames').touched
    );
  }
  get email_valid() {
    return this.form.get('email').invalid && this.form.get('email').touched;
  }
  get date_of_birth_valid() {
    return (
      this.form.get('date_of_birth').invalid &&
      this.form.get('date_of_birth').touched
    );
  }
  get direction_valid() {
    return (
      this.form.get('direction').invalid && this.form.get('direction').touched
    );
  }
  get gener_valid() {
    return this.form.get('gener').invalid && this.form.get('gener').touched;
  }
  get cell_phone_valid() {
    return (
      this.form.get('cell_phone').invalid && this.form.get('cell_phone').touched
    );
  }
  get marital_status_valid() {
    return (
      this.form.get('marital_status').invalid &&
      this.form.get('marital_status').touched
    );
  }
  get title_valid() {
    return this.form.get('title').invalid && this.form.get('title').touched;
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false;}
  }

}
