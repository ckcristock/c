import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { configEmpresa } from '../configuracion';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';

@Component({
  selector: 'app-datos-pago',
  templateUrl: './datos-pago.component.html',
  styleUrls: ['./datos-pago.component.scss']
})
export class DatosPagoComponent implements OnInit {
  @ViewChild('modal') modal: any;
  form: FormGroup;
  payment_method = configEmpresa.payment_method;
  account_types = configEmpresa.account_type;
  payment_frequencys = configEmpresa.payment_frequency;
  banks: any[] = [];
  payments: any = {};
  bank: any;
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _swal: SwalService,
    private _validators: ValidatorsService,
  ) { }

  ngOnInit(): void {
    this.getPaymentData();
    this.getBanks();
    this.createForm();
  }

  openModal() {
    this.modal.show();
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

  }

  createForm() {
    this.form = this.fb.group({
      id: [this.payments.id],
      payment_frequency: ['', this._validators.required],
      payment_method: ['', this._validators.required],
      account_number: ['', this._validators.required],
      account_type: ['', this._validators.required],
      bank_id: ['', this._validators.required]
    });
  }

  getPaymentData() {
    this._configuracionEmpresaService.getCompanyData()
      .subscribe((res: any) => {
        this.payments = res.data;
        this.bank = res.data.bank.name;
        this.form.patchValue({
          id: this.payments.id,
          payment_frequency: this.payments.payment_frequency,
          payment_method: this.payments.payment_method,
          account_number: this.payments.account_number,
          account_type: this.payments.account_type,
          bank_id: this.payments.bank_id
        });
      });
  }

  getBanks() {
    this._configuracionEmpresaService.getBanks()
      .subscribe((res: any) => {
        this.banks = res.data;
      })
  }

  savePaymentData() {
    this._configuracionEmpresaService.saveCompanyData(this.form.value)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        this.getPaymentData();
        this._swal.show({
          icon: 'success',
          title: 'Actualizado correctamente',
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
      );
  }

}
