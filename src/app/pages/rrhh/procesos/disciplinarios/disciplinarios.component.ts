import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperatorFunction, Observable } from 'rxjs';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { DisciplinariosService } from './disciplinarios.service';
import { consts } from '../../../../core/utils/consts';
import Swal from 'sweetalert2';
import { functionsUtils } from '../../../../core/utils/functionsUtils';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
type Person = { value: number, text: string };
@Component({
  selector: 'app-disciplinarios',
  templateUrl: './disciplinarios.component.html',
  styleUrls: ['./disciplinarios.component.scss']
})
export class DisciplinariosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild('modalseguimiento') modalseguimiento: any;
  permission: Permissions = {
    menu: 'Disciplinarios',
    permissions: {
      approve: false
    }
  };
  form: FormGroup;
  loading = false;
  process: any;
  status = consts.status;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros: any = {
    person: '',
    status: 'Todos',
    code: '',
    involved: ''
  }
  people: any[] = [];
  person_selected: any;
  historyInfo: any[] = [];
  processs: any[] = [];
  fileString: any = '';
  file: any = '';
  type: any = '';
  collapsed:boolean[] = [];


  constructor(
    private fb: FormBuilder,
    private _reactiveValid: ValidatorsService,
    private disciplinarioService: DisciplinariosService,
    private _swal: SwalService,
    private _permission: PermissionService
  ) { this.permission = this._permission.validatePermissions(this.permission) }

  ngOnInit(): void {
    this.createForm();
    this.getDisciplinaryProcess();
    this.getPeople();
  }

  open() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      person_id: ['', this._reactiveValid.required],
      date_of_admission: ['', Validators.required],
      date_end: [''],
      process_description: ['', this._reactiveValid.required],
      type: [''],
      file: ['']
    }, { validator: this._reactiveValid.checkDates("date_of_admission", "date_end") });
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

  getPeople() {
    this.disciplinarioService.getPeople()
      .subscribe((res: any) => {
        this.people = res.data;
      });
  }

  getDisciplinaryProcess(page = 1) {
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this.pagination.page = page;
    this.disciplinarioService.getDisciplinaryProcess(params)
      .subscribe((res: any) => {
        this.process = res.data.data;
        console.log(this.process);
        this.loading = false;
        this.pagination.collectionSize = res.data.total;
      });
  }

  getHistory() {
    this.disciplinarioService.getHistory(this.form.value.person_id.value)
      .subscribe((res: any) => {
        this.historyInfo = res.data;
      });
  }

  getProcess() {
    this.disciplinarioService.getProcessByPerson(this.form.value.person_id.value)
      .subscribe((res: any) => {
        this.processs = res.data;
      });
  }

  
  aprobar(id) {
    this._swal.show({
      title: '¿Estas Seguro?',
      text: "¡El Proceso será aprobado",
      icon: 'question',
      showCancel: true
    })
    .then((result) =>{
      if (result.isConfirmed) {
        this.disciplinarioService.approve({status: 'Aprobado'}, id).subscribe( (r:any) =>{
          this._swal.show({
            icon: 'success',
            title: 'El Proceso Ha sido Aprobado!',
            text: '¡Aprobado!',
            timer: 2500,
            showCancel: false
          })
          this.getDisciplinaryProcess();
        })
      }
    })
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

  downloadVer(id) {
    this.disciplinarioService.downloadPDF(id)
      .subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: "application/pdf" });
        let link = document.createElement("a");
        const filename = 'descargo-ver';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
        this.loading = false
      }),
      error => { console.log('Error downloading the file'); this.loading = false },
      () => { console.info('File downloaded successfully'); this.loading = false };
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

  createNewProcess() {
    let file = this.form.value.file;
    file = this.fileString;
    let type = this.type;
    let person_id = this.form.value.person_id.value;
    this.form.patchValue({
      person_id,
      file,
      type
    })
    this.disciplinarioService.createNewProcess(this.form.value)
      .subscribe((res: any) => {
        Swal.fire({
          icon: 'success',
          title: res.data,
          text: 'Proceso creado satisfactoriamente'
        });
        this.form.reset();
        this.getDisciplinaryProcess();
        this.modal.hide();
      });
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
