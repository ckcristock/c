import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AfiliacionesService } from './afiliaciones.service';

@Component({
  selector: 'app-afiliaciones',
  templateUrl: './afiliaciones.component.html',
  styleUrls: ['./afiliaciones.component.scss']
})
export class AfiliacionesComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  data:any;
  eps:any;
  afiliations:any = {
    eps_name: ''
  };
  id:any;
  constructor( 
              private fb:FormBuilder, 
              private afiliationService: AfiliacionesService,
              private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getAfiliationInfo();
    this.getEpss();
    this.createForm();
  }

  openModal(){
    this.modal.show();
  }

  createForm(){
    this.form = this.fb.group({
      eps_id: ['', Validators.required],
      pension_found: ['', Validators.required],
      severance_found: ['', Validators.required],
      compensation: ['', Validators.required]
    }); 
  }

  getAfiliationInfo(){
    this.afiliationService.getAfiliationInfo(this.id)
    .subscribe( (res:any) => {
      this.afiliations = res.data;
      console.log(this.afiliations);
      this.form.patchValue({
        eps_id: this.afiliations.eps_id
      })
    });
  }

  updateAfiliation(){
    this.afiliationService.updateAfiliation(this.form.value, this.id)
    .subscribe( res => {
      this.getAfiliationInfo();
      this.modal.hide();
      Swal.fire({
        icon: 'success',
        title: 'Editado con éxito',
        text: 'Se han actualizado los cambios correctamente'
      })
    });
  }

  getEpss(){
    this.afiliationService.getEpss()
    .subscribe( (res:any) => {
      this.eps = res.data;
    });
  }

  get eps_valid(){
    return (
      this.form.get('eps_id').invalid && this.form.get('eps_id').touched
    );
  }

  get pension_found_valid(){
    return (
      this.form.get('pension_found').invalid && this.form.get('pension_found').touched
    );
  }

  get severance_found_valid(){
    return (
      this.form.get('severance_found').invalid && this.form.get('severance_found').touched
    );
  }

  get compensation_valid(){
    return (
      this.form.get('compensation').invalid && this.form.get('compensation').touched
    );
  }


}
