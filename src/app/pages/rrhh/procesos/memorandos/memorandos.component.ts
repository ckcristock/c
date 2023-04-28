import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OperatorFunction, Observable } from 'rxjs';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { MemorandosService } from './memorandos.service';
import Swal from 'sweetalert2';
import { Permissions } from '../../../../core/interfaces/permissions-interface';
import { PermissionService } from '../../../../core/services/permission.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
type Person = { value: number, text: string };
@Component({
  selector: 'app-memorandos',
  templateUrl: './memorandos.component.html',
  styleUrls: ['./memorandos.component.scss']
})
export class MemorandosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  @ViewChild('modalMotivo') modalMotivo: any;
  @ViewChild('modalMemorando') modalMemorando: any;
  @ViewChild('modalLlamada') modalLlamada: any;
  formMotivo: FormGroup;
  formMemorando: FormGroup;
  formLlamada: FormGroup;
  memorandums: any[] = [];
  person_selected: any;
  loading = false;
  types: any;
  typesLimitated: any;
  call: any = {};
  filtros: any = {
    person: '',
    date: '',
    state: ''
  }
  paginationMemorando = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  paginationMotivo = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  permission: Permissions = {
    menu: 'Memorandos',
    permissions: {
      approve: true
    }
  };
  states: any = [
    { clave: 'Todos' },
    { clave: 'Pendiente' },
    { clave: 'Aprobado' },
    { clave: 'Legalizado' }
  ]

  fileString: any = '';
  type: any = '';
  file: any = '';
  fileLocalstorage: String = '' //Eliminar al introducir backend

  people: any[] = [];
  public model: Person;
  constructor(
    private fb: FormBuilder,
    private _reactiveValid: ValidatorsService,
    private memorandosService: MemorandosService,
    private _permission: PermissionService,
    private modalService: NgbModal,
    private _swal: SwalService
  ) {
    this.permission = this._permission.validatePermissions(this.permission)
  }

  ngOnInit(): void {
    this.createFormMotivo();
    this.createFormMemorando();
    this.createFormLLamada();
    this.getPeople();
    this.getTypeMemorandum();
    this.getMemorandumList();
    this.getList();
  }

  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.formLlamada.reset()

  }

  openMotivo() {
    this.modalMotivo.show();
  }

  createFormMotivo() {
    this.formMotivo = this.fb.group({
      name: ['', this._reactiveValid.required],
    });
  }

  saveReason() {
    this.memorandosService.createNewMemorandumType(this.formMotivo.value)
      .subscribe((res: any) => {
        this._swal.show({
          icon: 'success',
          title: 'Guardado',
          showCancel: false,
          text: '',
          timer: 1000
        })
        this.getTypeMemorandum();
        this.formMotivo.reset();
      });
  }

  activateOrCancel(type, status) {
    let data: any = {
      id: type.value,
      status
    }
    this.memorandosService.createNewMemorandumType(data)
      .subscribe(res => {
        this._swal.show({
          icon: 'question',
          title: '¿Estás seguro(a)?',
          showCancel: true,
          text: (status === 'Inactivo' ? 'El motivo se anulará' : 'El motivo se activará'),
        }).then((result) => {
          if (result.isConfirmed) {
            this._swal.show({
              icon: 'success',
              title: (status === 'Inactivo' ? '¡Motivo anulado!' : '¡Motivo activado!'),
              showCancel: false,
              timer: 1000,
              text: (status === 'Inactivo' ? 'El motivo ha sido anulado con éxito.' : 'El motivo ha sido activado con éxito.'),
            })
            this.getTypeMemorandum();
            this.getList();
          }
        })
      })
  }

  getTypeMemorandum(page = 1) {
    this.paginationMotivo.page = page;
    this.memorandosService.getTypesOfMemorandum(this.paginationMotivo)
      .subscribe((res: any) => {
        this.types = res.data.data;
        this.paginationMotivo.collectionSize = res.data.total;
      });
  }

  /* Memorando base */

  createFormMemorando() {
    this.formMemorando = this.fb.group({
      person_id: ['', this._reactiveValid.required],
      memorandum_type_id: ['', this._reactiveValid.required],
      details: ['', this._reactiveValid.required],
      file: [''],
      level: ['Seleccione', this._reactiveValid.required]
    });
  }

  openMemorando() {
    this.modalMemorando.show();
  }

  formatter = (state: Person) => state.text;
  search: OperatorFunction<string, readonly { value, text }[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 3),
    map(term => this.people.filter(state => new RegExp(term, 'mi').test(state.text)).slice(0, 10))
  )

  getPeople() {
    this.memorandosService.getPeople()
      .subscribe((res: any) => {
        this.people = res.data;
      });
  }

  getList() {
    this.memorandosService.getMemorandumLimitated()
      .subscribe((res: any) => {
        this.typesLimitated = res.data;
      });
  }

  getMemorandumList(page = 1) {
    this.loading = true;
    let params = {
      ...this.paginationMemorando, ...this.filtros
    }
    this.paginationMemorando.page = page;
    this.memorandosService.getMemorandumList(params)
      .subscribe((res: any) => {
        this.memorandums = res.data.data;
        this.paginationMemorando.collectionSize = res.data.total;
        this.loading = false;
      })
  }

  saveMemorandum() {
    let person_id = this.formMemorando.value.person_id.value;
    let file = this.formMemorando.value.file;
    file = this.fileString;
    this.fileLocalstorage = file;
    let type = this.type;
    this.formMemorando.patchValue({
      person_id,
      file,
      type
    });

    ///this.memorandosService.saveFile(file);
    this.memorandosService.createNewMemorandum(this.formMemorando.value)
      .subscribe((res: any) => {
        //this.modalMemorando.hide();
        this.modalService.dismissAll();
        this.formMemorando.reset();
        this.person_selected = '';
        this.getMemorandumList();
        this._swal.show({
          icon: 'success',
          title: 'Creado con éxito',
          showCancel: false,
          text: '',
          timer: 1000
        })
      });
  }

  /**
   *
   * ! Pendiente de Back
   * TODO
   */
  download(file) {
    this.memorandosService.download(file)
      .subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: "application/pdf" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = file;
        link.click();
        this.loading = false
      }),
      error => { this.loading = false },
      () => { this.loading = false };
  }

  aprobarMemorando(memorando, state) {
    let data = {
      id: memorando.id,
      state
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: "¡El memorando será aprobado!",
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.memorandosService.createNewMemorandum(data).subscribe((r: any) => {

            this._swal.show({
              icon: 'success',
              text: '¡El memorando ha sido aprobado!',
              title: '¡Aprobado!',
              timer: 1000,
              showCancel: false
            })
            this.getMemorandumList();
          })
        }
      })
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

  /******************** LLamada de Atención **********************/

  openModalLlamada() {
    this.modalLlamada.show();
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
        this.file = base64;
      });

    }
  }


  createFormLLamada() {
    this.formLlamada = this.fb.group({
      reason: ['', this._reactiveValid.required],
      number_call: ['', this._reactiveValid.required],
      person_id: ['', this._reactiveValid.required],
      user_id: ['']
    })
  }

  createNewAttentionCall() {
    let person_id = this.formLlamada.value.person_id.value;
    this.memorandosService.attentionCalls(person_id).subscribe((r: any) => {
      this.call = r;
      if (this.call?.person_id == person_id && this.call?.cantidad == 2) {
        this._swal.show({
          icon: 'warning',
          title: '¡ALERTA!',
          showCancel: true,
          text: 'Este es el tercer llamado de atención del funcionario, por normatividad de la empresa se procede a generarlo como un memorando leve. ¿Estás seguro(a) de realizar este cambio?',
        }).then((result) => {
          if (result.isConfirmed) {
            this.modalService.dismissAll();
            //this.modalLlamada.hide();
            let details = this.formLlamada.value.reason;
            let level = 'Leve';
            let memorandum_type_id = 2;
            let data = {
              person_id,
              details,
              level,
              memorandum_type_id
            }
            this.memorandosService.createNewMemorandum(data)
              .subscribe((r: any) => {
                this.formLlamada.reset();
                this.getMemorandumList();
              })
          }
        })
      } else {
        this.formLlamada.patchValue({
          person_id
        })
        this.memorandosService.createNewAttentionCall(this.formLlamada.value)
          .subscribe((res: any) => {
            //this.modalLlamada.hide();
            this.modalService.dismissAll();
            this.getMemorandumList();
            this.formLlamada.reset();
            this._swal.show({
              icon: 'success',
              title: res.data,
              showCancel: false,
              text: '¡Llamado de atención creado con éxito!',
              timer: 1000
            })
          })
      };
    })
  }

}
