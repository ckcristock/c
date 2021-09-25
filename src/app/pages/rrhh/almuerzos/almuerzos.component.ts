import { Component, OnInit, ViewChild } from '@angular/core';
import { AlmuerzosService } from './almuerzos.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { ValidatorsService } from '../../ajustes/informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-almuerzos',
  templateUrl: './almuerzos.component.html',
  styleUrls: ['./almuerzos.component.scss']
})
export class AlmuerzosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  people:any[] = [];
  lunches:any[] = [];
  constructor( 
                private _almuerzo: AlmuerzosService,
                private fb: FormBuilder,
                private _swal: SwalService,
                private _validator: ValidatorsService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getPeople();
    this.getLunches();
  }

  openModal(){
    this.modal.show();
  }

  createForm(){
    this.form = this.fb.group({
      person_id: ['', this._validator.required],
      value: ['', this._validator.required]
    });
  }

  getPeople(){
    this._almuerzo.getPeople().subscribe((r:any) =>{
      this.people = r.data;
    })
  }

  getLunches(){
    this.loading = true;
    this._almuerzo.getLunches().subscribe((r:any) =>{
        this.lunches = r.data;
        console.log(this.lunches);
        this.loading = false;
    })
  }

  createLunch(){
    this._almuerzo.createLunch(this.form.value)
    .subscribe( (r) =>{
      this.modal.hide();
      this.form.reset();
      this.getLunches();
      this._swal.show({
        icon: 'success',
        title: 'Operación exitosa',
        timer: 2000,
        text: 'Almuerzo creado con éxito'
      });
    });
  }

  get person_valid() {
    return this.form.get('person_id').invalid && this.form.get('person_id').touched;
  }

  get value_valid() {
    return this.form.get('value').invalid && this.form.get('value').touched;
  }

}
