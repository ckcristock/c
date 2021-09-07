import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { TiposDocumentoService } from './tipos-documento.service';

@Component({
  selector: 'app-tipos-documento',
  templateUrl: './tipos-documento.component.html',
  styleUrls: ['./tipos-documento.component.scss']
})
export class TiposDocumentoComponent implements OnInit {
  @ViewChild('modal') modal:any;
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro:any = {
    name: '',
    code: ''
  }
  documents:any[] = [];
  document:any = {}
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
  });
  constructor( 
              private fb:FormBuilder, 
              private _reactiveValid: ValidatorsService,
              private _typesDocumentService: TiposDocumentoService
     ) { }

  ngOnInit(): void {
    this.getDocumentTypes();
    /* this.createForm(); */
  }

  openModal() {
    this.modal.show();
    this.document.id = '';
    this.document.name = '';
    this.document.code = '';
  }

  /* createForm() {
    this.form = this.fb.group({
      name: ['', this._reactiveValid.required],
      code: ['', this._reactiveValid.required]
    })
  } */

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo'? 'El Documento se inactivará!' : 'El Documento se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
    }).then((result) => {
      if (result.isConfirmed) {
        this._typesDocumentService.createNewDocument( data )
        .subscribe( res => {
          this.getDocumentTypes();
          Swal.fire({
            title: (status === 'Inactivo' ? 'Documento Inhabilitado!' : 'Documento activado' ) ,
            text: (status === 'Inactivo' ? 'El Documento ha sido Inhabilitada con éxito.' : 'El Documento ha sido activada con éxito.'),
            icon: 'success'
          })
        } )
      }
    })
  }

  getData(data) {
    this.document = {...data};
  }

  getDocumentTypes(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this._typesDocumentService.getDocuments(params)
    .subscribe( (res:any) => {
      this.documents = res.data.data;
      console.log(this.documents);
      this.pagination.collectionSize = res.data.total;
    })
  }

  createNewDocument() {
    this._typesDocumentService.createNewDocument(this.document)
    .subscribe( (res:any) => {
      console.log(res);
      this.getDocumentTypes();
      this.modal.hide();
      Swal.fire({
        icon: 'success',
        title: res.data,
        text: 'Se ha agregado a los tipos de contrato con éxito.'
      })
    })
  }

  get name_invalid(){
    return (this.form.get('name').invalid && this.form.get('name').touched);
  }

  get code_invalid() {
    return this.form.get('code').invalid && this.form.get('code').touched;
  }

}
