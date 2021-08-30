import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SalarioService } from './salario.service';
import { consts } from 'src/app/core/utils/consts';
import Swal from 'sweetalert2';
import { DatosBasicosService } from '../datos-basicos/datos-basicos.service';

@Component({
  selector: 'app-salario',
  templateUrl: './salario.component.html',
  styleUrls: ['./salario.component.scss']
})
export class SalarioComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  data:any;
  id:any;
  contract_types = consts.contract_type;
  salary_info:any = {
    salary: '',
    contract_type: '',
    date_of_admission: '',
    date_end: ''
  };
  constructor( 
                private fb:FormBuilder, 
                private salaryService: SalarioService, 
                private activateRoute: ActivatedRoute,
                private basicDataService: DatosBasicosService ) { }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.getSalaryInfo();
    this.createForm();
  }

  openModal(){
    this.modal.show();
  }

  createForm(){
    this.form = this.fb.group({
      type_contract: ['', Validators.required],
      salary: ['', Validators.required],
      date_of_admission: ['', Validators.required],
      retirement_date: ['', Validators.required]
    }); 
  }
  
  get type_contract_valid(){
    return (
      this.form.get('type_contract').invalid && this.form.get('type_contract').touched
    );
  }
    
  get salary_valid(){
    return (
      this.form.get('salary').invalid && this.form.get('salary').touched
    );
  }
  
  get date_of_admission_valid(){
    return (
      this.form.get('date_of_admission').invalid && this.form.get('date_of_admission').touched
    );
  }

  get retirement_date_valid(){
    return (
      this.form.get('retirement_date').invalid && this.form.get('retirement_date').touched
    );
  }
      
  
  getSalaryInfo(){
      this.salaryService.getSalaryInfo(this.id)
      .subscribe( (res:any) => {
      this.salary_info = res.data;
    });
  }

  updateSalaryInfo(){
     /*  this.form.markAllAsTouched();
      if (this.form.invalid) { return false;} */

      this.salaryService.updateSalaryInfo(this.salary_info)
      .subscribe( res => {
      this.modal.hide();
      this.getSalaryInfo();
      Swal.fire({
        icon: 'success',
        title: 'Editado con éxito',
        text: 'Se han actualizado los cambios correctamente'
        })
      this.basicDataService.datos$.emit()
      });
    }

}
