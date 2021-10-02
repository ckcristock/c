import { Component, OnInit, ViewChild } from '@angular/core';
import { AlmuerzosService } from './almuerzos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { ValidatorsService } from '../../ajustes/informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-almuerzos',
  templateUrl: './almuerzos.component.html',
  styleUrls: ['./almuerzos.component.scss']
})
export class AlmuerzosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  @ViewChild('modalVer') modalVer:any;
  loading:boolean = false;
  form: FormGroup;
  people:any[] = [];
  lunches:any[] = [];
  lunch:any = {};
  lunch_id:any;
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

  openModalVer() {
    this.modalVer.show();
  }

  createForm(){
    this.form = this.fb.group({
      person_id: ['', Validators.required],
      value: ['', Validators.required]
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
        this.loading = false;
    })
  }
  
  getLunchId(id){
    this.lunch_id = id;
  }

  getLunch(){
    this._almuerzo.getLunch(this.lunch_id).subscribe((r:any) => {
      this.lunch = r.data;
      console.log(this.lunch);
    });
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

  activateOrInactivate(lunch, state){
    let data = {
      id: lunch.id,
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? 'El Almuerzo será anulado' : 'El Almuerzo será activado')
    }).then((r) => {
      if (r.isConfirmed) {
        this._almuerzo.activateOrInactivate(data).subscribe( (r:any) => {
          this.getLunches();
          this._swal.show({
            icon: 'success',
            title: 'Proceso Satisfactorio',
            text: (data.state == 'Inactivo' ? 'Almuerzo Anulado Correctamente' : 'Almuerzo Activado Correctamente'),
            showCancel: false
          })
        });
      }
    })
  }

  get person_valid() {
    return this.form.get('person_id').invalid && this.form.get('person_id').touched;
  }

  get value_valid() {
    return this.form.get('value').invalid && this.form.get('value').touched;
  }

}
