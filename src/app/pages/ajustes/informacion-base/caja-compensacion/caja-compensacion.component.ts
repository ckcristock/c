import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { CompensationFundsService } from '../services/compensationFunds.service';
import { CajaCompensacionService } from './caja-compensacion.service';
import { ValidatorsService } from '../services/reactive-validation/validators.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-caja-compensacion',
  templateUrl: './caja-compensacion.component.html',
  styleUrls: ['./caja-compensacion.component.scss']
})
export class CajaCompensacionComponent implements OnInit {
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
  boolNuevaCaja: boolean;
  selected: any;
  compensations: any[] = [];
  compensation: any = {};
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro: any = {
    name: ''
  }
  form: FormGroup;
  constructor(
    private _compensationService: CajaCompensacionService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private _validators: ValidatorsService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.getCompensationFunds();
    this.createForm();
  }

  openModal() {
    this.modal.show();
    this.form.reset();
  }
  closeResult = '';
  public openConfirm(confirm, titulo, nuevaCaja) {
    this.boolNuevaCaja = nuevaCaja
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
    this.compensation = { ...data };
    this.form.patchValue({
      id: this.compensation.id,
      name: this.compensation.name,
      code: this.compensation.code,
      nit: this.compensation.nit
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.compensation.id],
      name: ['', this._validators.required],
      code: ['', this._validators.required],
      nit: ['', this._validators.required]
    });
  }

  getCompensationFunds(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._compensationService.getCompensationFund(params)
      .subscribe((res: any) => {
        this.compensations = res.data.data;
        this.pagination.collectionSize = res.data.total;
        this.loading = false
      })
  }

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (status === 'Inactivo' ? '¡La caja de compensación se inactivará!' : '¡La caja de compensación se activará!'),
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._compensationService.createCompensationFund(data)
            .subscribe(res => {
              this.getCompensationFunds();
              this.modalService.dismissAll();
              this._swal.show({
                icon: 'success',
                title: (status === 'Inactivo' ? 'Caja de compensación inhabilitada!' : 'Caja de compensación activada'),
                text: (status === 'Inactivo' ? 'La caja de compesación ha sido inhabilitada con éxito.' : 'La caja de compensación ha sido activada con éxito.'),
                timer: 1000,
                showCancel: false
              })
            })
        }
      })
  }

  createCompensationFund() {
    let data = {};
    if(this.boolNuevaCaja){
      data = this.form.value
    } else {
      data = {
        id: this.form.get("id").value,
        name: this.form.get("name").value
      }
    }
    this._compensationService.createCompensationFund(data)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        this.getCompensationFunds();
        this._swal.show({
          icon: 'success',
          title: res.data,
          text: '',
          timer: 1000,
          showCancel: false
        })
      },
        err => {
          const nit = err?.error.errors.hasOwnProperty('nit') ? err?.error.errors.nit[0] : ' ';
          const code = err?.error.errors.hasOwnProperty('code') ? err?.error.errors.code[0] : ' ';
          const texto = nit +' \n '+code
          this._swal.show({
            title: 'ERROR',
            text: texto,
            icon: 'error',
            showCancel: false,
          })
        }

      );
  }

}
