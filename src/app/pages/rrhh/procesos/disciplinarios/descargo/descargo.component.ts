import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import Swal from 'sweetalert2';
import { DescargoService } from './descargo.service';
import { DisciplinariosService } from '../disciplinarios.service';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { PermissionService } from '../../../../../core/services/permission.service';
import { Permissions } from '../../../../../core/interfaces/permissions-interface';

@Component({
  selector: 'app-descargo',
  templateUrl: './descargo.component.html',
  styleUrls: ['./descargo.component.scss']
})
export class DescargoComponent implements OnInit {
  @ViewChild('modal') modal:any;
  @ViewChild('modalDocuments') modalDocuments:any;
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
  loading = false;

  processSelected: any;
  process: any;
  formSeguimiento: FormGroup;
  formfiles: FormGroup;
  anotaciones: any[] = [];
  fullNameSelected: string = '';
  file: any; // Para Evidencia
  fileD: any; // Para Doc

  fileAnotacion: any;
  fileString: any;
  filesString: any;
  type: any;
  typeDoc: any;
  historyInfo:any[] = [];
  people: any[] = [];
  anotacion: {
    description: string,
    disciplinary_process_id: any,
    date: any,
    id?: number,
    file?: any,
  }
  permission: Permissions = {
    menu: 'Disciplinarios',
    permissions: {
      close: false,
      open: false
    }
  };
  collapsed:boolean[] = [];
  date: Date = new Date();
  seleccionadas:any[] = [];
  files: File[] = [];  // Para Documentos legales
  fileArr:any[] = [];
  legalDocuments:any[] = [];


  constructor(
    private fb: FormBuilder,
    private _descargo: DescargoService,
    private rutaActiva: ActivatedRoute,
    private _swal: SwalService,
    private disciplinarioService: DisciplinariosService,
    private router: Router,
    private _permission: PermissionService
  ) { this.permission = this._permission.validatePermissions(this.permission) }

  ngOnInit(): void {
    this.filtros.code = this.rutaActiva.snapshot.params.id;
    this.getDisciplinaryProcess();
    this.getAnnotation();
    this.getPeople();
    this.createForm();
    this.getLegalDocument();
  }

  openModal(){
    this.modal.show();
  }
  closeModal(){
    this.modal.hide();
    this.historyInfo = [];
    this.formSeguimiento.reset();
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

  createFormSeguimiento() {
    this.formSeguimiento = this.fb.group({
      description: ['', Validators.required],
      disciplinary_process_id: [''],
      file: ['']
    });    
  }

  createForm(){
    this.formSeguimiento = this.fb.group({
      person_id: [''],
      person: ['', Validators.required],
      file: [''],
      filename:[''],
      observation:[''],
      disciplinary_process_id:['']
    })
  }

  fileControl(file, name, type){
    let group = {
      name: name,
      file: file,
      type: type,
      disciplinary_process_id: this.filtros.code
    }
    return group;
  }

  get fileList(){
    return this.formfiles.get('files') as FormArray
  }

  getHistory() {
    this.disciplinarioService.getHistory(this.formSeguimiento.value.person.value)
      .subscribe((res: any) => {
        this.historyInfo = res.data;
      });
  }

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

    this.pagination.page = page;
    this._descargo.getDisciplinaryProcess(params)
      .subscribe((res: any) => {
        this.process = res.data.data;
        this.pagination.collectionSize = res.data.total;
      }, () => { }, () => {
        this.processSelected = this.process[0];
        this.anotaciones = JSON.parse(this.processSelected.anotaciones ? this.processSelected.anotaciones : null) || [];
        this.file = this.processSelected.file;
        this.fullNameSelected = `${this.processSelected.person.first_name} ${this.processSelected.person.first_surname}`
      });
  }

  getLegalDocument(){
    this._descargo.getFilesToDownload(this.filtros.code).subscribe((file:any) => {
      this.legalDocuments = file.data;
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
        this.fileAnotacion = base64;
      });


    }
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
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

  agregarAnotacion() {
    this.formSeguimiento.patchValue({person_id: this.formSeguimiento.value.person.value})
    let valid = this.anotaciones.some(r => r.person_id == this.formSeguimiento.value.person_id)
    if (valid) {
      this._swal.show({
        icon: 'warning',
        title: '¡Ooops!',
        text: 'El funcionario que intenta ingresar ya se encuentra como involucrado en el proceso',
        showCancel: false
      })
      this.historyInfo = []
      this.seleccionadas = []
    } else {
      this._swal.show({
        title: '¿Estas seguro?',
        text: 'Se dispone a guardar la anotación',
        icon: 'question'
      }).then(r => {
        if (r.isConfirmed) {
          this.formSeguimiento.patchValue({
            disciplinary_process_id: this.filtros.code,
            file: this.fileAnotacion,
            person_id: this.formSeguimiento.value.person.value
          })
          this.formSeguimiento.addControl('memorandums', this.fb.control(this.seleccionadas))
          let forma = this.formSeguimiento.value;
          forma.memorandums = this.seleccionadas;          
          this._descargo.createAnotacion(forma).subscribe( (data:any) => {
            this.fileAnotacion = null;
            this.formSeguimiento.reset();
            this.getAnnotation();
            this.modal.hide();
            this.historyInfo = [];
            // this.seleccionadas = [];
            this._swal.show({
              icon: 'success',
              title: 'Guardado correctamente',
              text: 'La Anotación a sido agregada con éxito',
              showCancel: false
            })
          })
        }
      })
    }
  }

  hideModalDocuments(){
    this.modalDocuments.hide();
    this.files = [];
    this.fileArr = [];
  }

  saveDocuments(){
    this.files.forEach(elem => {
      let file = elem;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.filesString = (<FileReader>event.target).result;
        const type = { ext: this.filesString };
        this.typeDoc = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.fileD = base64;
        this.fileArr.push(this.fileControl(this.filesString, file.name, this.typeDoc));
      });
    });
    setTimeout(() => {
      this._descargo.saveFiles(this.fileArr).subscribe((r:any) => {
        this.modalDocuments.hide();
        this.getLegalDocument();
        this.files = [];
        this.fileArr = [];
        this._swal.show({
          icon: 'success',
          title: 'Guardado correctamente',
          text: 'Los documentos han sido guardados correctamente',
          showCancel: false
        })
      })
    }, 100);
  }

  deleteDocument(file){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se eliminará el documento del proceso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._descargo.deleteDocuments({state: 'Inactivo'}, file.id)
        .subscribe((r:any) => {
          Swal.fire({
            icon: 'success',
            title: '¡Documento eliminado!',
            text: 'Documento eliminado del proceso satisfactoriamente'
          });
          this.getLegalDocument()
        })
      }
    })
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

  closeProccess(){
    Swal.fire({
      title: 'Cerrar Proceso',
      text: 'Descripción del cierre de proceso',
      icon: 'warning',
      showCancelButton: true,
      input: 'text',
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        let date = moment().format('YYYY-MM-DD');
        let data = {
          status: 'Cerrado',
          close_description: result.value,
          date_end: date
        }
        this._descargo.closeOrOpenProccess(this.filtros.code, data).subscribe((data:any) => {
          this.router.navigate(['/rrhh/procesos/disciplinarios'])
          Swal.fire('Success', 'Cerrado con éxito', 'success')
        })
      }
    });
  }

  openProccess(){
    Swal.fire({
      title: 'Abrir Proceso',
      text: '¡El proceso será abierto nuevamente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Abrir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this._descargo.closeOrOpenProccess(this.filtros.code, {status: 'Abierto'}).subscribe((data:any) => {
          this.router.navigate(['/rrhh/procesos/disciplinarios'])
          Swal.fire('Success', 'Abierto con éxito', 'success')
        })
      }
    });
  }

  getAnnotation(){
    this.loading = true;
    this._descargo.getAnnotations(this.filtros.code).subscribe((data:any) => {
      this.anotaciones = data.data
      console.log(this.anotaciones);
      this.loading = false;
    })
  }

  cancelAnnotation(id){
    Swal.fire({
      title: '¿Anular Anotacion?',
      text: '¡La anotación  será anulada del proceso!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this._descargo.cancelAnnotation(id, {state: 'Inactivo'}).subscribe((data:any) => {
          Swal.fire('Success', 'Anulado con éxito', 'success')
          this.getAnnotation();
        })
      }
    });
  }


  modifyProcess() {

    this.processSelected.anotaciones = JSON.stringify(this.anotaciones)
    // this.descargoService.modifyProcess(this.processSelected)

  }

  get person_id_valid() {
    return this.formSeguimiento.get('person').invalid && this.formSeguimiento.get('person').touched;
  }

  download(file) {
    this._descargo.download(file)
      .subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: "application/pdf" });
        let link = document.createElement("a");
        const filename = 'Evidencia';
        link.href = window.URL.createObjectURL(blob);
        link.download = file;
        link.click();
        this.loading = false
      }),
      error => { console.log('Error downloading the file'); this.loading = false },
      () => { console.info('File downloaded successfully'); this.loading = false };
  }

  downloadDocument(file) {
    this._descargo.download(file.file, file.type)
      .subscribe((response: BlobPart) => {
        let type = ''
        file.type == 'jpge' || file.type == 'jpg' || file.type == 'png' ? type = `image/${file.type}` : `application/${file.type}`
        let blob = new Blob([response], { type: type });
        let link = document.createElement("a");
        const filename = file.name;
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        this.loading = false
      }),
      error => { console.log('Error downloading the file'); this.loading = false },
      () => { console.info('File downloaded successfully'); this.loading = false };
  }

}
