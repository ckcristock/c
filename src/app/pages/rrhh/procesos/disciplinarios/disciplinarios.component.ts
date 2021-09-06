import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperatorFunction, Observable } from 'rxjs';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { DisciplinariosService } from './disciplinarios.service';
import { consts } from '../../../../core/utils/consts';
import Swal from 'sweetalert2';
type Person = {value: number, text: string};
@Component({
  selector: 'app-disciplinarios',
  templateUrl: './disciplinarios.component.html',
  styleUrls: ['./disciplinarios.component.scss']
})
export class DisciplinariosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form:FormGroup;
  loading = false;
  process:any;
  status = consts.status;
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }
  filtros:any = {
    person: '',
    status: '',
    code: ''
  }
  people:any[] = [];
  person_selected:any;
  historyInfo:any[] = [];
  processs:any[] = [];
  constructor( 
                private fb:FormBuilder, 
                private _reactiveValid: ValidatorsService,
                private disciplinarioService: DisciplinariosService ) { }

  ngOnInit(): void {
    this.createForm();
    this.getDisciplinaryProcess();
    this.getPeople();
  }

  open(){
    this.modal.show();
  }

  createForm(){
    this.form = this.fb.group({
      person_id: ['', this._reactiveValid.required],
      date_of_admission: ['', Validators.required],
      date_end: ['', Validators.required],
      process_description: ['', this._reactiveValid.required],
    }); 
  }


  formatter = (state: Person) => state.text;
  search: OperatorFunction<string, readonly {value, text}[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 3),
    map(term => this.people.filter(state => new RegExp(term, 'mi').test(state.text)).slice(0, 10))
  )

  getPeople() {
    this.disciplinarioService.getPeople()
    .subscribe( (res:any) => {
      this.people = res.data;
    });
  }

  getDisciplinaryProcess( page = 1 ) {
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this.pagination.page = page;
    this.disciplinarioService.getDisciplinaryProcess(params)
    .subscribe( (res:any) => {
      this.process = res.data.data;
      this.loading = false;
      this.pagination.collectionSize = res.data.total;
    });
  }

  getHistory() {
    this.disciplinarioService.getHistory( this.person_selected.value )
    .subscribe( (res:any) =>{
      this.historyInfo = res.data;
    });
  }

  getProcess() {
    this.disciplinarioService.getProcessByPerson( this.person_selected.value )
    .subscribe( (res:any) =>{
      this.processs = res.data;
    });
  }

  createNewProcess() {
    this.disciplinarioService.createNewProcess( this.form.value )
    .subscribe( (res:any) => {
      Swal.fire({
        icon: 'success',
        title: res.data,
        text: 'Proceso creado satisfactoriamente'
      });
      this.getDisciplinaryProcess();
      this.modal.hide();
    });
  }

  tipo(){
    let value = this.person_selected;
    if (typeof value == 'object') {
      this.form.patchValue({
        person_id:value.value
      });
    }
  }

  get person_id_valid(){
    return this.form.get('person_id').invalid && this.form.get('person_id').touched;
  }

  get date_of_admission_valid(){
    return (this.form.get('date_of_admission').invalid && this.form.get('date_of_admission').touched);
  }

  get date_end_valid(){
    return (this.form.get('date_end').invalid && this.form.get('date_end').touched);
  }

  get process_description_valid(){
    return this.form.get('process_description').invalid && this.form.get('process_description').touched;
  }

}
