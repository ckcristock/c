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
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-descargo',
  templateUrl: './descargo.component.html',
  styleUrls: ['./descargo.component.scss']
})
export class DescargoComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild('modalDocuments') modalDocuments: any;
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
  historyInfo: any[] = [];
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
  collapsed: boolean[] = [];
  date: Date = new Date();
  seleccionadas: any[] = [];
  files: File[] = [];  // Para Documentos legales
  fileArr: any[] = [];
  legalDocuments: any[] = [];
  fileType: any;
  filename: any;
  closeResult = '';
  constructor(
    private fb: FormBuilder,
    private _descargo: DescargoService,
    private rutaActiva: ActivatedRoute,
    private _swal: SwalService,
    private disciplinarioService: DisciplinariosService,
    private router: Router,
    private _permission: PermissionService,
    private modalService: NgbModal,
  ) { this.permission = this._permission.validatePermissions(this.permission) }

  ngOnInit(): void {
    this.filtros.code = this.rutaActiva.snapshot.params.id;
    this.getDisciplinaryProcess();
    this.getAnnotation();
    this.getPeople();
    this.createForm();
    this.getLegalDocument();
  }

  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    this.hideModalDocuments()
    this.historyInfo = [];
    this.formSeguimiento.reset();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openModal() {
    this.modal.show();
  }
 /*  closeModal() {
    this.modal.hide();
    this.historyInfo = [];
    this.formSeguimiento.reset();
  } */

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
      file: [''],
      filename: [''],
      type: ['']
    });
  }

  createForm() {
    this.formSeguimiento = this.fb.group({
      person_id: [''],
      person: ['', Validators.required],
      file: [''],
      filename: [''],
      type: [''],
      observation: [''],
      disciplinary_process_id: ['']
    })
  }

  fileControl(file, name, type) {
    let group = {
      name: name,
      file: file,
      type: type,
      disciplinary_process_id: this.filtros.code
    }
    return group;
  }

  get fileList() {
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
        this.fileType = this.processSelected.fileType;
        this.fullNameSelected = `${this.processSelected.person.first_name} ${this.processSelected.person.first_surname}`
      });
  }

  getLegalDocument() {
    this._descargo.getFilesToDownload(this.filtros.code).subscribe((file: any) => {
      this.legalDocuments = file.data;
    })
  }


  onFileChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg']
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
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

  memorandumsGroup(event) {
    let group = this.fb.group({
      value: event.target.value,
      id: event.target.id,
      name: event.target.name,
      date: event.target.date
    });
    return group;
  }

  agregarAnotacion() {
    this.formSeguimiento.patchValue({ person_id: this.formSeguimiento.value.person.value })
    let valid = this.anotaciones.some(r => r.person_id == this.formSeguimiento.value.person_id)
    if (valid) {
      this._swal.show({
        icon: 'warning',
        title: '¡Ooops!',
        text: 'El funcionario que intentas ingresar ya se encuentra involucrado en el proceso',
        showCancel: false
      })
      this.historyInfo = []
      this.seleccionadas = []
    } else {
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: 'Guardar anotación',
        icon: 'question'
      }).then(r => {
        if (r.isConfirmed) {
          this.formSeguimiento.patchValue({
            disciplinary_process_id: this.filtros.code,
            file: this.fileAnotacion,
            type: this.type,
            filename: this.filename,
            person_id: this.formSeguimiento.value.person.value
          })
          this.formSeguimiento.addControl('memorandums', this.fb.control(this.seleccionadas))
          let forma = this.formSeguimiento.value;
          forma.memorandums = this.seleccionadas;
          this._descargo.createAnotacion(forma).subscribe((data: any) => {
            this.fileAnotacion = null;
            this.formSeguimiento.reset();
            this.getAnnotation();
            this.modalService.dismissAll(); 
            this.historyInfo = [];
            // this.seleccionadas = [];
            this._swal.show({
              icon: 'success',
              title: 'Guardado correctamente',
              text: 'La anotación ha sido agregada con éxito',
              showCancel: false,
              timer: 1000
            })
          })
        }
      })
    }
  }

  hideModalDocuments() {
    this.files = [];
    this.fileArr = [];
  }

  saveDocuments() {
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
      this._descargo.saveFiles(this.fileArr).subscribe((r: any) => {
        this.modalService.dismissAll(); 
        this.getLegalDocument();
        this.files = [];
        this.fileArr = [];
        this._swal.show({
          icon: 'success',
          title: 'Guardado correctamente',
          text: 'Los documentos han sido guardados correctamente',
          showCancel: false,
          timer: 1000
        })
      })
    }, 100);
  }

  deleteDocument(file) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: "Se eliminará el documento del proceso",
    }).then((result) => {
      if (result.isConfirmed) {
        this._descargo.deleteDocuments({ state: 'Inactivo' }, file.id)
          .subscribe((r: any) => {
            this._swal.show({
              icon: 'success',
              title: '¡Documento eliminado!',
              showCancel: false,
              text: 'Documento eliminado del proceso satisfactoriamente',
              timer: 1000
            })
            this.getLegalDocument()
          })
      }
    })
  }

  onSelectOption(event): void {
    let seleccionada = { value: event.target.value, id: event.target.id, name: event.target.name, date: event.target.date }
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

  closeProccess() {
    Swal.fire({
      title: 'Cerrar proceso',
      text: 'Descripción del cierre de proceso',
      icon: 'question',
      showCancelButton: true,
      input: 'text',
      confirmButtonColor: '#A3BD30',
      confirmButtonText: 'Continuar',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        let date = moment().format('YYYY-MM-DD');
        let data = {
          status: 'Cerrado',
          close_description: result.value,
          date_end: date
        }
        this._descargo.closeOrOpenProccess(this.filtros.code, data).subscribe((data: any) => {
          this.router.navigate(['/rrhh/procesos/disciplinarios'])
          this._swal.show({
            icon: 'success',
            title: 'Cerrado con éxito',
            showCancel: false,
            text: '',
            timer: 1000
          })
        })
      }
    });
  }

  openProccess() {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: '¡El proceso será abierto nuevamente!',
    }).then((result) => {
      if (result.value) {
        this._descargo.closeOrOpenProccess(this.filtros.code, { status: 'Abierto' }).subscribe((data: any) => {
          this.router.navigate(['/rrhh/procesos/disciplinarios'])
          this._swal.show({
            icon: 'success',
            title: 'Operación exitosa',
            showCancel: false,
            text: 'Abierto con éxito',
            timer: 1000
          })
        })
      }
    });
  }

  getAnnotation() {
    this.loading = true;
    this._descargo.getAnnotations(this.filtros.code).subscribe((data: any) => {
      this.anotaciones = data.data
      this.loading = false;
    })
  }

  cancelAnnotation(id) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: '¡La anotación será anulada del proceso!',
    }).then((result) => {
      if (result.value) {
        this._descargo.cancelAnnotation(id, { state: 'Inactivo' }).subscribe((data: any) => {
          this._swal.show({
            icon: 'success',
            title: 'Operación exitosa',
            showCancel: false,
            text: 'Anulado con éxito',
            timer: 1000
          })
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

  download(file, fileType) {
    this._descargo.download(file, fileType)
      .subscribe((response: BlobPart) => {
        let type = ''
        fileType == 'jpge' || fileType == 'jpg' || fileType == 'png' ? type = `image/${fileType}` : `application/${fileType}`
        let blob = new Blob([response], { type: type });
        let link = document.createElement("a");
        const filename = `evidencia.${fileType}`;
        link.href = window.URL.createObjectURL(blob);
        link.download = `${file}.${fileType}`;
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
