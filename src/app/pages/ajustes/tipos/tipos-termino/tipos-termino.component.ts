import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { TiposTerminosService } from './tipos-terminos.service';

@Component({
  selector: 'app-tipos-termino',
  templateUrl: './tipos-termino.component.html',
  styleUrls: ['./tipos-termino.component.scss']
})
export class TiposTerminoComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }

  loading: boolean = false;
  selected: any;
  lists: any;
  terms: any[] = [];
  form: FormGroup;
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtro: any = {
    name: ''
  }
  term: any = {};

  constructor(
    private _typesTermsService: TiposTerminosService,
    private fb: FormBuilder,
    private _reactiveValid: ValidatorsService,
    private modalService: NgbModal,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.getTermsTypes();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.term.id],
      name: ['', this._reactiveValid.required]
    })
  }

  getTermsTypes(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._typesTermsService.getTermsTypes(params)
      .subscribe((res: any) => {
        this.loading = false;
        this.terms = res.data.data;
        this.pagination.collectionSize = res.data.total;
      });
  }

  openModal(){
    this.modal.show();
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.selected = titulo;
    this.modalService.open(confirm, {ariaLabelledBy: 'modal-basic-title', size: 'sm', scrollable: true})
  }

  private getDismissReason (reason: any){
    this.form.reset();
  }

  getData(data) {
    this.term = { ...data };
    this.form.patchValue({
      id: this.term.id,
      name: this.term.name
    });
  }

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      name: contract.name,
      status
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (status === 'inactivo' ? '¡El salario se inactivará!' : '¡El salario se activará!'),
      icon: 'question',
      showCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this._typesTermsService.createTermType(data)
          .subscribe(res => {
            this.getTermsTypes();
            this._swal.show({
              title: (status === 'inactivo' ? '¡Salario inhabilitado!' : '¡Salario activado!'),
              text: (status === 'inactivo' ? 'El salario ha sido inhabilitado con éxito.' : 'El salario ha sido activado con éxito.'),
              icon: 'success',
              showCancel: false,
              timer: 1000
            })
          })
      }
    })
  }

  createSalaryType() {
    this._typesTermsService.createTermType(this.form.value)
      .subscribe((res: any) => {
        this.getTermsTypes();
        this.modalService.dismissAll();
        this._swal.show({
          title: res.data.name,
          icon: 'success',
          text: 'Término creado exitosamente',
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

}
