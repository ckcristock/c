import { Component, DoCheck, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { configEmpresa } from '../configuracion';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';

@Component({
  selector: 'app-datos-pago',
  templateUrl: './datos-pago.component.html',
  styleUrls: ['./datos-pago.component.scss']
})
export class DatosPagoComponent implements OnInit, DoCheck {
  @Output() update = new EventEmitter
  form: FormGroup;
  payment_method = configEmpresa.payment_method;
  account_types = configEmpresa.account_type;
  payment_frequencys = configEmpresa.payment_frequency;
  banks: any[] = [];
  payments: any = {};
  loading: boolean = true;
  bank: any;
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    private _modal: ModalService,
    private _swal: SwalService,
  ) {
   }
  ngDoCheck(): void {
    if (this.payments.id) {
      this.loading = false
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.getPaymentData();
    this.getBanks();
  }

  updateData() {
    this.update.emit()
  }

  openModal(modal) {
    this._modal.open(modal);
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.payments.id],
      payment_frequency: ['', Validators.required],
      payment_method: ['', Validators.required],
      account_number: ['', Validators.required],
      account_type: ['', Validators.required],
      bank_id: ['', Validators.required]
    });
  }

  getPaymentData() {
    // this._configuracionEmpresaService.getCompanyData()
    // .subscribe( (res:any) =>{
    // this.payments = res.data;
    // this.bank = res.data.bank.name;
    this.form.patchValue({
      id: this.payments.id,
      payment_frequency: this.payments.payment_frequency,
      payment_method: this.payments.payment_method,
      account_number: this.payments.account_number,
      account_type: this.payments.account_type,
      bank_id: this.payments.bank_id
      // });
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
        this._modal.close();
        this.updateData();
        this.getPaymentData();
        this._swal.show({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Datos actualizados correctamente',
          timer: 1000,
          showCancel: false
        })
      });
  }

}
