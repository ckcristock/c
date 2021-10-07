import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { configEmpresa } from '../configuracion';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';

@Component({
  selector: 'app-datos-pago',
  templateUrl: './datos-pago.component.html',
  styleUrls: ['./datos-pago.component.scss']
})
export class DatosPagoComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  payment_method = configEmpresa.payment_method;
  account_types = configEmpresa.account_type;
  payment_frequencys = configEmpresa.payment_frequency;
  banks:any[] = [];
  payments:any = {};
  bank:any;
  constructor( 
                private _configuracionEmpresaService: ConfiguracionEmpresaService,
                private fb: FormBuilder
              ) { }

  ngOnInit(): void {
    this.getPaymentData();
    this.getBanks();
    this.createForm();
  }

  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.payments.id],
      payment_frequency: [''],
      payment_method: [''],
      account_number: [''],
      account_type: [''],
      bank_id: ['']
    });
  }

  getPaymentData() {
    this._configuracionEmpresaService.getCompanyData()
    .subscribe( (res:any) =>{
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
    .subscribe( (res:any) =>{
      this.banks = res.data;
    })
  }

  savePaymentData() {
    this._configuracionEmpresaService.saveCompanyData(this.form.value)
    .subscribe( (res:any) =>{
      this.modal.hide();
      this.getPaymentData();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado Correctamente'
        });
    });
  }

}
