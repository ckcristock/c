import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { TiposDocumentoService } from './tipos-documento.service';

@Component({
  selector: 'app-tipos-documento',
  templateUrl: './tipos-documento.component.html',
  styleUrls: ['./tipos-documento.component.scss']
})
export class TiposDocumentoComponent implements OnInit {
  @ViewChild('modal') modal: any;
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
  loading: boolean = false;
  selected: any;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro: any = {
    name: '',
    code: ''
  }
  documents: any[] = [];
  document: any = {}
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _reactiveValid: ValidatorsService,
    private _typesDocumentService: TiposDocumentoService,
    private _modal: ModalService,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.getDocumentTypes();
    this.createForm();
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.selected = titulo;
    this._modal.open(confirm);
    this.form.reset();
  }

  getData(data) {
    this.document = { ...data };
    this.selected = 'Actualizar tipo de documento';
    this.form.patchValue({
      id: this.document.id,
      name: this.document.name,
      code: this.document.code,
      dian_code: this.document.dian_code
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.document.id],
      name: ['', this._reactiveValid.required],
      code: ['', this._reactiveValid.required],
      dian_code: ['', this._reactiveValid.required],
    })
  }

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (status === 'Inactivo' ? '¡El documento se inactivará!' : '¡El documento se activará!'),
      icon: 'question',
      showCancel: true,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._typesDocumentService.createNewDocument(data)
            .subscribe(res => {
              this.getDocumentTypes();
              this._swal.show({
                title: (status === 'Inactivo' ? '¡Documento inhabilitado!' : '¡Documento activado!'),
                text: (status === 'Inactivo' ? 'El documento ha sido inhabilitado con éxito.' : 'El documento ha sido activado con éxito.'),
                icon: 'success',
                showCancel: false,
                timer: 1000
              })
            })
        }
      })
  }


  getDocumentTypes(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._typesDocumentService.getDocuments(params)
      .subscribe((res: any) => {
        this.documents = res.data.data;
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
      })
  }

  createNewDocument() {
    this._typesDocumentService.createNewDocument(this.form.value)
      .subscribe((res: any) => {
        this.getDocumentTypes();
        this._modal.close();
        this._swal.show({
          title: res.data,
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false
        })
      }, err => {
        this._swal.show({
          title: 'ERROR',
          text: 'Intenta nuevamente',
          icon: 'error',
          showCancel: false,
        })
      }
      )
  }

  get name_invalid() {
    return (this.form.get('name').invalid && this.form.get('name').touched);
  }

  get code_invalid() {
    return this.form.get('code').invalid && this.form.get('code').touched;
  }

  get dian_code_invalid() {
    return this.form.get('dian_code').invalid && this.form.get('dian_code').touched;
  }

}
