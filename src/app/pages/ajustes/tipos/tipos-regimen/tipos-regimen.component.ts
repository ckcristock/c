import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposRegimenService } from './tipos-regimen.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tipos-regimen',
  templateUrl: './tipos-regimen.component.html',
  styleUrls: ['./tipos-regimen.component.scss']
})
export class TiposRegimenComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private _regimeType: TiposRegimenService,
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
  regimeTypes: any[] = [];
  regime: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }

  ngOnInit(): void {
    this.createForm();
    this.getRegimeTypes()
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
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm', scrollable: true }).result.then((result) => {
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
      id: [this.regime.id],
      name: ['', Validators.required],
    });
  }

  getRegimeTypes(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._regimeType.getRegimeType(this.pagination).subscribe((r: any) => {
      this.regimeTypes = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    });
  }

  getRegime(regime) {
    this.regime = { ...regime };
    this.form.patchValue({
      id: this.regime.id,
      name: this.regime.name,
    });
  }

  save() {
    this._regimeType.updateOrCreateRegimeType(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll(); 
      this.form.reset();
      this.getRegimeTypes();
      this._swal.show({
        icon: 'success',
        title: 'Proceso Satisfactio',
        text: 'El tipo de régimen ha sido creado con éxito.',
        showCancel: false
      });
    })
  }

  activateOrInactivate(regime, state) {
    let data = {
      id: regime.id,
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: (data.state == 'Inactivo' ? '¡El tipo de régimen de anulará!' : '¡El tipo de régimen de activará!')
    }).then((r) => {
      if (r.isConfirmed) {
        this._regimeType.updateOrCreateRegimeType(data).subscribe((r) => {
          this.getRegimeTypes();
          this._swal.show({
            icon: 'success',
            title: '¿Estás seguro(a)?',
            text: (data.state == 'Inactivo' ? 'El tipo de régimen ha sido anulado con éxito.' : 'El tipo de régimen ha sido activado con éxito.'),
            showCancel: false
          })
        })
      }
    });
  }
}
