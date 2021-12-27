import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { title } from 'process';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import Swal from 'sweetalert2';
import { DisciplinariosService } from '../disciplinarios.service';
import { CerrarProcesoService } from './cerrar-proceso.service';

@Component({
  selector: 'app-cerrar-proceso',
  templateUrl: './cerrar-proceso.component.html',
  styleUrls: ['./cerrar-proceso.component.scss']
})
export class CerrarProcesoComponent implements OnInit {
  @ViewChild('modal') modal: any;

  form: FormGroup
  formSelect: FormGroup

  historyInfo: any[];
  processsByPerson: any[];
  people: any[];
  fileString: any;
  type: any;
  file: any;
  loadingHistory: any;

  proceso: {
    id: any,
    responsables: {
      personId: any,
      memorandos: any[],
    }[]
  }

  loading: any;
  process: any;
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros: any = {
    person: '',
    status: '',
    code: ''
  }

  funcionarios: any[] = [];
  seleccionadas: any[] = [];
  payload: any = {};


  constructor(
    private disciplinarioService: DisciplinariosService,
    private fb: FormBuilder,
    private _reactiveValid: ValidatorsService,
    private _swal: SwalService,
    private rutaActiva: ActivatedRoute,
    private ruta: Router,
    private _proceso: CerrarProcesoService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.getDisciplinaryProcess();
    this.getPeople();

    this.proceso = {
      id: '',
      responsables: []
    }
  }


  createForm() {

    this.form = this.fb.group({
      person_id: ['', this._reactiveValid.required],
      type: [''],
      file: ['']
    });
  }

  getPeople() {
    this.disciplinarioService.getPeople()
      .subscribe((res: any) => {
        this.people = res.data;
      });
  }

  open() {
    this.modal.show();
  }

  resultFormatBandListValue(value: any) {
    return value.text;
  }

  inputFormatBandListValue(value: any) {
    if (value.text)
      return value.text
    return value;
  }


  onSelectOption(event): void {
    let seleccionada = { value: event.target.value, id: event.target.id, name: event.target.name }
    if (event.target.checked) {
      // Add the new value in the selected options
      this.seleccionadas.push((seleccionada));
    }
    /* unselected */
    else {

      // removes the unselected option
      this.seleccionadas = this.seleccionadas.filter((selected) =>
        selected.id !== event.target.id
      );
    }
  }

  
  download(file) {
    this.disciplinarioService.download(file)
      .subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: "application/pdf" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = file;
        link.click();
        this.loading = false
      }),
      error => { console.log('Error downloading the file'); this.loading = false },
      () => { console.info('File downloaded successfully'); this.loading = false };
  }

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

  getDisciplinaryProcess(page = 1) {
    this.filtros.code = this.rutaActiva.snapshot.params.id;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this.pagination.page = page;
    this.disciplinarioService.getDisciplinaryProcess(params)
      .subscribe((res: any) => {
        this.process = res.data.data[0];
        this.loading = false;
        this.pagination.collectionSize = res.data.total;
      }, () => { }, () => {
        this.file = this.process.file
      });

  }

  search: OperatorFunction<string, readonly { value, text }[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 3),
    map(term => this.people.filter(state => new RegExp(term, 'mi').test(state.text)).slice(0, 10))
  )

  getHistory() {
    this.loadingHistory = true;
    this.disciplinarioService.getHistory(this.form.value.person_id.value)
      .subscribe((res: any) => {
        this.historyInfo = res.data[0] ? res.data : undefined;
      }, () => -{}, () => {
        this.loadingHistory = false;
        console.log(this.historyInfo);
      });
  }


  guardarFuncionario(persona) {

    let resp: { personId: any, memorandos: any[] } = { personId: { id: persona.value, name: persona.text }, memorandos: this.seleccionadas }
    let i = this.funcionarios.findIndex(funcionar => funcionar.personId.id === persona.value)
    i < 0 ? this.funcionarios.push(resp) : this.funcionarios[i] = resp;
    this.proceso.responsables = this.funcionarios;
    this.seleccionadas = [];
  }

  cerrarDescargo() {
    this._swal.show({
      title: '¿Estás seguro?',
      text: 'Si cierras el proceso se cambiará el estado a Cerrado y no se permitirán más cambios',
      icon: 'question'
    }).then((r) => {
      if (r.isConfirmed) {

        this.payload.id = this.process.id;
        this.payload.persons = this.proceso.responsables.map((r) => r.personId.id)

        this.payload.memorandums = this.proceso.responsables.map(responsable => {
          return responsable.memorandos.map(memorando => memorando.id)
        }).reduce((memorandos, memo) => memorandos.concat(memo), [])

        this.payload.status = "Cerrado"
        this.payload.file = this.file;
        this.process.status = "Cerrado"
        console.log(this.payload);

        this._proceso.cerrarProceso(this.process.id, this.process).subscribe((r)=>{
          this.ruta.navigate(['/rrhh/procesos/disciplinarios'])
          Swal.fire('Success', 'Cerrado con éxito', 'success')
        });
      }
    })
  }

  get person_id_valid() {
    return this.form.get('person_id').invalid && this.form.get('person_id').touched;
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
