import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-afiliaciones',
  templateUrl: './afiliaciones.component.html',
  styleUrls: ['./afiliaciones.component.scss']
})
export class AfiliacionesComponent implements OnInit {
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
      eps: ['', Validators.required],
      pension_found: ['', Validators.required],
      severance_found: ['', Validators.required],
      compensation: ['', Validators.required]
    }); 
  }

  get eps_valid(){
    return (
      this.form.get('eps') && this.form.get('eps').touched
    );
  }

  get pension_found_valid(){
    return (
      this.form.get('pension_found') && this.form.get('pension_found').touched
    );
  }

  get severance_found_valid(){
    return (
      this.form.get('severance_found') && this.form.get('severance_found').touched
    );
  }

  get compensation_valid(){
    return (
      this.form.get('compensation') && this.form.get('compensation').touched
    );
  }


}
