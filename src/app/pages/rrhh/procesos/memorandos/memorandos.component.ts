import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OperatorFunction, Observable } from 'rxjs';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { MemorandosService } from './memorandos.service';
import Swal from 'sweetalert2';
type Person = {value: number, text: string};
@Component({
  selector: 'app-memorandos',
  templateUrl: './memorandos.component.html',
  styleUrls: ['./memorandos.component.scss']
})
export class MemorandosComponent implements OnInit {
  @ViewChild('modalMotivo') modalMotivo:any;
  @ViewChild('modalMemorando') modalMemorando:any;
  formMotivo:FormGroup;
  formMemorando:FormGroup;
  memorandums:any[] = [];
  person_selected:any;
  loading = false;
  types:any;
  typesLimitated:any;
  paginationMemorando = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }
  paginationMotivo = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }
  people:any[] = [];
  public model: Person;
  constructor( 
              private fb: FormBuilder,  
              private _reactiveValid: ValidatorsService,
              private memorandosService: MemorandosService
              ) { }

  ngOnInit(): void {
    this.createFormMotivo();
    this.createFormMemorando();
    this.getPeople();
    this.getTypeMemorandum();
    this.getMemorandumList();
    this.getList();
  }

  openMotivo(){
    this.modalMotivo.show();
  }
  
  createFormMotivo(){
    this.formMotivo = this.fb.group({
      name: ['', this._reactiveValid.required],
    }); 
  }

  saveReason() {
    this.memorandosService.createNewMemorandumType( this.formMotivo.value )
    .subscribe( (res:any) => {
       console.log(res);
       this.getTypeMemorandum();
       this.formMotivo.reset();
    });
  }

  activateOrCancel( type, status ) {
    let data:any = {
      id:type.value,
      status
    }
    this.memorandosService.createNewMemorandumType(data)
    .subscribe( res => {
      Swal.fire({
        title: '¿Estas Seguro?',
        text: (status === 'Inactivo' ? 'El Motivo se anulará' : 'El Motivo se Activará'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: (status === 'Inactivo' ? 'Si, Anular' : 'Si, Activar')
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: (status === 'Inactivo' ? 'Motivo Anulado!' : 'Motivo Activado' ) ,
            text: (status === 'Inactivo' ? 'El Motivo ha sido anulado con éxito.' : 'El Motivo ha sido activado con éxito.'),
            icon: 'success'
          })
          this.getTypeMemorandum();
          this.getList();
        }
      })
    })
  }

  getTypeMemorandum( page = 1 ) {
    this.paginationMotivo.page = page;
    this.memorandosService.getTypesOfMemorandum(this.paginationMotivo)
    .subscribe( (res:any) => {
      this.types = res.data.data;
      this.paginationMotivo.collectionSize = res.data.total;
    });
  }
  
  /* Memorando base */

  createFormMemorando(){
    this.formMemorando = this.fb.group({
      person_id: ['', this._reactiveValid.required],
      memorandum_type_id: ['', this._reactiveValid.required],
      details: ['', this._reactiveValid.required]
    }); 
  }

  openMemorando(){
    this.modalMemorando.show();
  }
  
  formatter = (state: Person) => state.text;
  search: OperatorFunction<string, readonly {value, text}[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 3),
    map(term => this.people.filter(state => new RegExp(term, 'mi').test(state.text)).slice(0, 10))
  )

  tipo(){
    let value = this.person_selected;
    if (typeof value == 'object') {
      this.formMemorando.patchValue({
        person_id:value.value
      }); 
    }
  }

  getPeople() {
    this.memorandosService.getPeople()
    .subscribe( (res:any) => {
      this.people = res.data;
    });
  }

  getList() {
    this.memorandosService.getMemorandumLimitated()
    .subscribe( (res:any) => {
      this.typesLimitated = res.data;
    });
  }

  getMemorandumList( page = 1 ) {
    this.loading = true;
    this.paginationMemorando.page = page;
    this.memorandosService.getMemorandumList( this.paginationMemorando )
    .subscribe( (res:any) => {
      this.memorandums = res.data.data;
      this.paginationMemorando.collectionSize = res.data.total;
      this.loading = false;
    })
  }

  saveMemorandum() {
    this.memorandosService.createNewMemorandum( this.formMemorando.value )
    .subscribe( (res:any) => {
      this.modalMemorando.hide();
      this.formMemorando.reset();
      this.person_selected = '';
      this.getMemorandumList();
        Swal.fire({
          icon: 'success',
          title: res.data,
          text: 'Felicidades, Creado Satisfactiamente'
        })
    });
  }

  get funcionario_invalid() {
    return this.formMemorando.get('person_id').invalid && this.formMemorando.get('person_id').touched;
  }

  get motivo_invalid() {
    return this.formMemorando.get('memorandum_type_id').invalid && this.formMemorando.get('memorandum_type_id').touched;
  }

  get detalles_invalid() {
    return this.formMemorando.get('details').invalid && this.formMemorando.get('details').touched;
  }

  get reason_invalid() {
    return this.formMotivo.get('name').invalid && this.formMotivo.get('name').touched;
  }

}
