import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponsabilidadesFiscalesService } from './responsabilidades-fiscales.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-responsabilidades-fiscales',
  templateUrl: './responsabilidades-fiscales.component.html',
  styleUrls: ['./responsabilidades-fiscales.component.scss']
})
export class ResponsabilidadesFiscalesComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private _responsabilidades: ResponsabilidadesFiscalesService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  form: FormGroup;
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
  fiscalR: any[] = [];
  fiscal: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }

  filters:any = {
    name:'',
    state:'',
  };

  ngOnInit(): void {
    this.createForm();
    this.getFiscalResponsibility()
  }

  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  closeResult = '';

  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any) {
    this.form.reset();

  }

  createForm() {
    this.form = this.fb.group({
      id: [this.fiscal.id],
      code: [this.fiscal.code],
      name: ['', Validators.required],
    });
  }

  getFiscalResponsibility(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    let params = {
      ...this.pagination, ...this.filters
    }
    this._responsabilidades.getFiscalResponsibility(params).subscribe((r: any) => {
      this.fiscalR = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    });
  }

  getFiscal(fiscald) {
    this.fiscal = { ...fiscald };
    this.form.patchValue({
      id: this.fiscal.id,
      code: this.fiscal.code,
      name: this.fiscal.name,
    });
  }

  save() {
    this._responsabilidades.updateOrCreategetFiscalResponsibility(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getFiscalResponsibility();
      this._swal.show({
        icon: 'success',
        title: r.data,
        text: '',
        showCancel: false,
        timer: 1000
      });
    })
  }

  activateOrInactivate(fiscal, state) {
    let data = {
      id: fiscal.id,
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: (data.state == 'Inactivo' ? '¡La responsabilidad fiscal se anulará!' : '¡La responsabilidad fiscal se activará!')
    }).then((r) => {
      if (r.isConfirmed) {
        this._responsabilidades.updateOrCreategetFiscalResponsibility(data).subscribe((r) => {
          this.getFiscalResponsibility();
          this._swal.show({
            icon: 'success',
            title: (data.state === 'Inactivo' ? '¡Responsabilidad fiscal inhabilitada!' : '¡Responsabilidad fiscal activada!'),
            text: (data.state == 'Inactivo' ? 'La responsabilidad fiscal ha sido anulada con éxito.' : 'La responsabilidad fiscal ha sido activada con éxito.'),
            showCancel: false,
            timer: 1000
          })
        })
      }
    });
  }
}
