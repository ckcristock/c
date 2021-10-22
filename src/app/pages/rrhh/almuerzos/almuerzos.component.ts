import { Component, OnInit, ViewChild } from '@angular/core';
import { AlmuerzosService } from './almuerzos.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { ValidatorsService } from '../../ajustes/informacion-base/services/reactive-validation/validators.service';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

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
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtro = {
    date: '',
    person: ''
  }

  values:any = '';
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

  inputFormatBandListValue(value: any) {
    if (value.text)
      return value.text
    return value;
  }

  resultFormatBandListValue(value: any) {
    return value.text;
  }

/* formatter = (x: { code }) => x.code; */
  search: OperatorFunction<string, readonly { text }[]> = (
  text$: Observable<string>
  ) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter((term) => term.length >= 3),
    map((term) =>
      this.people
        .filter((state) => new RegExp(term, 'mi').test(state.text))
        .slice(0, 10)
    )
  );

  createForm(){
    this.form = this.fb.group({
      fill_person: ['', Validators.required],
      value: ['', Validators.required],
      persons: this.fb.array([])
    });
  }

  personControl(){
    let group = this.fb.group({
      name: [''],
      person_id: ['']
    });
    let value = this.form.get('fill_person').value;
    let name = value.text;
    let id = value.value;
    group.patchValue({
      name: name,
      person_id: id
    })
    return group;
  }

  get personList(){
    return this.form.get('persons') as FormArray;
  }

  createPerson(){
    let person = this.personList;
    person.push(this.personControl());
  }

  deletePerson(i){
    let person = this.personList;
    person.removeAt(i);
  }

  getPeople(){
    this._almuerzo.getPeople().subscribe((r:any) =>{
      this.people = r.data;
    })
  }

  getLunches( page = 1 ){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._almuerzo.getLunches(params).subscribe((r:any) =>{
        this.lunches = r.data.data;
        console.log(this.lunches);
        this.pagination.collectionSize = r.data.total;
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
        timer: 2500,
        text: 'Almuerzo creado con éxito',
        showCancel: false
      });
    });
  }

  activateOrInactivate(id, state){
    let data = {
      id,
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? 'El funcionario será anulado del almuerzo' : 'El Almuerzo será activado al funcionario')
    }).then((r) => {
      if (r.isConfirmed) {
        this._almuerzo.activateOrInactivate(data).subscribe( (r:any) => {
          this.getLunches();
          this._swal.show({
            icon: 'success',
            title: 'Proceso Satisfactorio',
            text: (data.state == 'Inactivo' ? 'Funcionario Anulado del almuerzo Correctamente' : 'Se le ha activado el almuerzo al funcionario correctamente'),
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
