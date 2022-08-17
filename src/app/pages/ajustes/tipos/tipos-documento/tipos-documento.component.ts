import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
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
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getDocumentTypes();
    this.createForm();
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.selected = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();
    
  }

  openModal() {
    this.modal.show();


  }

  getData(data) {
    this.document = { ...data };
    this.form.patchValue({
      id: this.document.id,
      name: this.document.name,
      code: this.document.code,
      abbreviation: this.document.abbreviation
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.document.id],
      name: ['', this._reactiveValid.required],
      code: ['', this._reactiveValid.required],
      abbreviation: ['', this._reactiveValid.required]
    })
  }

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo' ? 'El Documento se inactivará!' : 'El Documento se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: (status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar')
    }).then((result) => {
      if (result.isConfirmed) {
        this._typesDocumentService.createNewDocument(data)
          .subscribe(res => {
            this.getDocumentTypes();
            Swal.fire({
              title: (status === 'Inactivo' ? 'Documento Inhabilitado!' : 'Documento activado'),
              text: (status === 'Inactivo' ? 'El Documento ha sido Inhabilitada con éxito.' : 'El Documento ha sido activada con éxito.'),
              icon: 'success'
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
        console.log(this.documents)
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
      })
  }

  createNewDocument() {
    this._typesDocumentService.createNewDocument(this.form.value)
      .subscribe((res: any) => {
        this.getDocumentTypes();
        this.modalService.dismissAll(); 
        Swal.fire({
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado a los tipos de contrato con éxito.'
        })
      })
  }

  get name_invalid() {
    return (this.form.get('name').invalid && this.form.get('name').touched);
  }

  get code_invalid() {
    return this.form.get('code').invalid && this.form.get('code').touched;
  }

  get abbreviation_invalid() {
    return this.form.get('abbreviation').invalid && this.form.get('abbreviation').touched;
  }

}
