import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TiposRiesgoService } from './tipos-riesgo.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import Swal from 'sweetalert2';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-tipos-riesgo',
  templateUrl: './tipos-riesgo.component.html',
  styleUrls: ['./tipos-riesgo.component.scss']
})
export class TiposRiesgoComponent implements OnInit {
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
  form: FormGroup;
  risks: any[] = [];
  private risk: any = {};
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros: any = {
    risk_type: '',
    accounting_account: ''
  }
  constructor(
    private _tiposRiegoService: TiposRiesgoService,
    private fb: FormBuilder,
    private _validatorsService: ValidatorsService,
    private modalService: NgbModal,
    private _swal: SwalService,

  ) { }

  ngOnInit(): void {
    this.getRiskType();
    this.createForm();
  }

  openModal() {
    this.modal.show();


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

  getData(data) {
    this.risk = { ...data };
    this.form.patchValue({
      id: this.risk.id,
      risk_type: this.risk.risk_type,
      accounting_account: this.risk.accounting_account
    })

  }

  createForm() {
    this.form = this.fb.group({
      id: [this.risk.id],
      risk_type: ['', this._validatorsService.required],
      accounting_account: ['', this._validatorsService.required]
    });
  }

  getRiskType(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._tiposRiegoService.getRiskType(params)
      .subscribe((res: any) => {
        this.risks = res.data.data;
        this.loading = false;
        this.pagination.collectionSize = res.data.total;
      });
  }

  createRisk() {
    this._tiposRiegoService.createRisk(this.form.value)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        this.getRiskType();
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
      })
  }

  activateOrInactivate(novelty, status) {
    let data = {
      id: novelty.id,
      status
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (status === 'Inactivo' ? '¡El riesgo se inactivará!' : '¡El riesgo se activará!'),
      icon: 'question',
      showCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this._tiposRiegoService.createRisk(data)
          .subscribe(res => {
            this.getRiskType();
            this._swal.show({
              title: (status === 'Inactivo' ? '¡Riesgo inhabilitado!' : '¡Riesgo activado!'),
              text: (status === 'Inactivo' ? 'El riesgo ha sido inhabilitado con éxito.' : 'El riesgo ha sido activado con éxito.'),
              icon: 'success',
              showCancel: false,
              timer: 1000
            })
          });
      }
    });
  }

}
