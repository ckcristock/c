import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-salario',
  templateUrl: './salario.component.html',
  styleUrls: ['./salario.component.scss']
})
export class SalarioComponent implements OnInit {
  @ViewChild('modal') modal:any;
  @ViewChild('modalBonus') modalBonus:any;
  form: FormGroup;
  constructor( private fb:FormBuilder ) { }

  ngOnInit(): void {
    this.createForm();
  }

  openModal(){
    this.modal.show();
  }
  openModalBonus(){
    this.modalBonus.show();
  }

  createForm(){
    this.form = this.fb.group({
      type_contract: ['', Validators.required],
      salary: ['', Validators.required],
      date_of_admission: ['', Validators.required],
      retirement_date: ['', Validators.required],
      type_of_bonus: ['', Validators.required],
      bonus: ['', Validators.required],
      value: ['', Validators.required],
    }); 
  }

  get type_contract_valid(){
    return (
      this.form.get('type_contract') && this.form.get('type_contract').touched
    );
  }

  get salary_valid(){
    return (
      this.form.get('salary') && this.form.get('salary').touched
    );
  }
  get date_of_admission_valid(){
    return (
      this.form.get('date_of_admission') && this.form.get('date_of_admission').touched
    );
  }

  get retirement_date_valid(){
    return (
      this.form.get('retirement_date') && this.form.get('retirement_date').touched
    );
  }
/***************************** FORM SALARY ***********************/

/***************************** FORM BONUS ***********************/

  get type_of_bonus_valid(){
    return (
      this.form.get('type_of_bonus') && this.form.get('type_of_bonus').touched
    );
  }

  get bonus_valid(){
    return (
      this.form.get('bonus') && this.form.get('bonus').touched
    );
  }

  get value_valid(){
    return (
      this.form.get('value') && this.form.get('value').touched
    );
  }

}
