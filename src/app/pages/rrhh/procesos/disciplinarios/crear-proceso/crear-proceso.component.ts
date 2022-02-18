import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ValidatorsService } from '../../../../ajustes/informacion-base/services/reactive-validation/validators.service';
import { DisciplinariosService } from '../disciplinarios.service';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { functionsUtils } from '../../../../../core/utils/functionsUtils';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-crear-proceso',
  templateUrl: './crear-proceso.component.html',
  styleUrls: ['./crear-proceso.component.scss']
})
export class CrearProcesoComponent implements OnInit {
  @ViewChild('modal') modal:any;
  @ViewChild('myInputFile') myInputFile:any;
  form: FormGroup;
  formInvolved: FormGroup;
  loading = false;
  process: any;
  people: any[] = [];
  person_selected: any;
  historyInfo: any[] = [];
  processs: any[] = [];
  fileString: any = '';
  file: any = '';
  filename:any = '';
  type: any = '';
  selected: any[] = [];
  collapsed:boolean[] = [];
  check:boolean = true;
  seleccionadas: any[] = [];

  constructor( 
              private fb:FormBuilder,
              private _reactiveValid: ValidatorsService,
              private disciplinarioService: DisciplinariosService,
              private _swal: SwalService,
              private router: Router
              ) { }

  ngOnInit(): void {
    this.getPeople();
    this.createForm();
    this.createFormInvolved();
  }

  openModal(){
    this.modal.show();
  }
  closeModal(){
    this.modal.hide();
    this.historyInfo = [];
    this.formInvolved.reset();
  }

  createForm() {
    this.form = this.fb.group({
      person: ['', this._reactiveValid.required],
      person_id: [''],
      date_of_admission: ['', Validators.required],
      process_description: ['', this._reactiveValid.required],
      type: [''],
      file: [''],
      involved: this.fb.array([])
    });
  }

  // this form is to fill out the first form of values involved
  createFormInvolved(){
    this.formInvolved = this.fb.group({
      person_id: [''],
      person: ['', this._reactiveValid.required],
      file: [''],
      filename:[''],
      observation:[''],
      // memorandums: this.fb.array([]),
    })
  }

  inputFormatBandListValue(value: any) {
    if (value.text)
      return value.text
    return value;
  }

  resultFormatBandListValue(value: any) {
    return value.text;
  }

  search: OperatorFunction<string, readonly { value, text }[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 3),
    map(term => this.people.filter(state => new RegExp(term, 'mi').test(state.text)).slice(0, 10))
  )

  onFileChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg']
      if (!types.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Error de archivo',
          text: 'El tipo de archivo no es válido'
        });
        return null
      }
      this.filename = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
      });

    }
  }

  getHistory() {
    this.disciplinarioService.getHistory(this.formInvolved.value.person.value)
      .subscribe((res: any) => {
        this.historyInfo = res.data;
        
      });
  }

  getProcess() {
    this.disciplinarioService.getProcessByPerson(this.form.value.person.value)
      .subscribe((res: any) => {
        this.processs = res.data;
      });
  }

  getPeople() {
    this.disciplinarioService.getPeople()
      .subscribe((res: any) => {
        this.people = res.data;
      });
  }

  InvolvedControl(data){
    let group = this.fb.group({
      person_id : [data.person_id],
      person: [data.person],
      file: [data.file],
      filename: [data.filename],
      observation: [data.observation],
      memorandums: this.fb.array([])
    })
    let memorandum = group.get('memorandums') as FormArray
    data.memorandums.forEach(el => {
      let group = this.fb.group({
        value: el.value,
        id: el.id,
        name: el.name,
        date: el.date
      })
      memorandum.push(group);
    });
    return group;
  }
  
  get involvedList(){
    return this.form.get('involved') as FormArray;
  }

  deletedInvolved(i){
  this.involvedList.removeAt(i);
  }

  newInvolved(){
    this.formInvolved.patchValue({file: this.file, filename: this.filename})
    this.formInvolved.addControl('memorandums', this.fb.control(this.seleccionadas))
    let forma = this.formInvolved.value;
    forma.memorandums = this.seleccionadas;
    this.involvedList.push(this.InvolvedControl(forma))
    this.modal.hide();
    this.formInvolved.reset();
    this.historyInfo = [];
    this.seleccionadas = []
  }

  validateInvolved(){
    let arr:Array<any> = this.form.get('involved').value;
    this.formInvolved.patchValue({person_id: this.formInvolved.value.person.value})
    let valid = arr.some(r => r.person_id == this.formInvolved.value.person_id)
    if (valid) {
      this._swal.show({
        icon: 'warning',
        title: '¡Ooops!',
        text: 'El funcionario que intenta ingresar ya se encuentra como involucrado en el proceso',
        showCancel: false
      })
    }
  }

  memorandumsGroup(event){
    let group = this.fb.group({ 
      value: event.target.value, 
      id: event.target.id, 
      name: event.target.name,
      date: event.target.date 
    });
    return group;
  }

  get memorandumsList(){
    return this.formInvolved.get('memorandums') as FormArray;
  }

  deletedMemorandum(i){
  this.memorandumsList.removeAt(i);
  }

  onSelectOption(event): void {
    let seleccionada = { value: event.target.value, id: event.target.id, name: event.target.name, date: event.target.date  }
    if (event.target.checked) {
      // Add the new value in the selected options
      this.seleccionadas.push((seleccionada));
    } else {
      // removes the unselected option
      this.seleccionadas = this.seleccionadas.filter((selected) =>
        selected.id !== event.target.id
      );
    }
  }

  save(){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se iniciará nuevo proceso disciplinario!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Guardar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.form.patchValue({
          file: this.file,
          type: this.type,
          person_id: this.form.value.person_id.value
        })
        this.disciplinarioService.createNewProcess(this.form.value)
        .subscribe((res: any) => {
          Swal.fire({
            icon: 'success',
            title: res.data,
            text: 'Proceso creado satisfactoriamente'
          });
          this.router.navigate(['/rrhh/procesos/disciplinarios']);
          this.form.reset();
        });
      }
    })
  }

  get person_valid() {
    return this.form.get('person_id').invalid && this.form.get('person_id').touched;
  }

  get person_id_valid() {
    return this.formInvolved.get('person').invalid && this.formInvolved.get('person').touched;
  }

  get date_of_admission_valid() {
    return (this.form.get('date_of_admission').invalid && this.form.get('date_of_admission').touched);
  }

  get date_end_valid() {
    return (this.form.get('date_end').invalid && this.form.get('date_end').touched);
  }

  get process_description_valid() {
    return this.form.get('process_description').invalid && this.form.get('process_description').touched;
  }

}