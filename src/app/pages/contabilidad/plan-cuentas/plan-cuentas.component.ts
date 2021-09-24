import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { consts } from '../../../core/utils/consts';
import { contabilidad } from "../contabilidad";
import { ValidatorsService } from '../../ajustes/informacion-base/services/reactive-validation/validators.service';
import { PlanCuentasService } from './plan-cuentas.service';

@Component({
  selector: 'app-plan-cuentas',
  templateUrl: './plan-cuentas.component.html',
  styleUrls: ['./plan-cuentas.component.scss']
})
export class PlanCuentasComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form:FormGroup;
  accounts:any[] = [];
  account:any = {};
  title:any;
  banks:any[] = [];
  bankSelected:boolean;
  options = consts.options;
  type_p = contabilidad.type_pn;
  accountTypes = contabilidad.accountType;
  cuenta = contabilidad.account;
  status = contabilidad.statusAccounts;
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros:any = {
    code: '',
    name: '',
    niif_code: '',
    niff_name: '',
    status: ''
  }
  constructor( 
                private fb: FormBuilder,
                private _validators: ValidatorsService,
                private _planAccountService: PlanCuentasService ) { }

  ngOnInit(): void {
    this.createForm();
    this.getAccount_plan();
  }

  openModal() {
    this.modal.show();
    this.title = 'Nueva Cuenta';
  }

  closeModal() {
    this.modal.hide();
    this.form.reset();
  }

  createForm(){
    this.form = this.fb.group({
      id: [this.account.id],
      type_p: ['',this._validators.required],
      type_niif: ['',this._validators.required],
      code: ['',this._validators.required],
      name: ['',this._validators.required],
      niif_code: ['',this._validators.required],
      niif_name: ['',this._validators.required],
      accounting_adjustment: [''],
      close_third: [''],
      movement: [0],
      document: [''],
      base: [''],
      value: [''],
      percent: [''],
      center_cost: [''],
      depreciation: [''],
      amortization: [''],
      exogenous: [''],
      nature: ['',this._validators.required],
      close_nit: [''],
      bank: [''],
      bank_id: [''],
      nit: [''],
      report: [''],
      class_account: [''],
      niif: ['',this._validators.required],
      annual_voucher: [''],
      status: ['', this._validators.required],
      account_number: ['', this._validators.required],
    });
  }

  getAccount_plan( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._planAccountService.getAccount_plan(params)
    .subscribe( (res:any) => {
      this.accounts = res.data.data;
      this.pagination.collectionSize = res.data.total;
      this.loading = false;
    })
  }
  
  getAccount(account) {
    this.account = {...account};
    
    this.title = 'Actualizar Cuenta'
    this.form.patchValue({
      id: this.account.id,
      type_p: this.account.type_p,
      type_niif: this.account.type_niif,
      code: this.account.code,
      name: this.account.name,
      niif_code: this.account.niif_code,
      niif_name: this.account.niif_name,
      accounting_adjustment: this.account.accounting_adjustment,
      close_third: this.account.close_third,
      movement: this.account.movement,
      document: this.account.document,
      base: this.account.base,
      value: this.account.value,
      percent: this.account.percent,
      center_cost: this.account.center_cost,
      depreciation: this.account.depreciation,
      amortization: this.account.amortization,
      exogenous: this.account.exogenous,
      nature: this.account.nature,
      close_nit: this.account.close_nit,
      bank: this.account.bank,
      bank_id: this.account.bank_id,
      nit: this.account.nit,
      report: this.account.report,
      class_account: this.account.class_account,
      niif: this.account.niif,
      annual_voucher: this.account.annual_voucher,
      status: this.account.status,
      account_number: this.account.account_number,
    });
  }

  enableFields(fild) {
    if (fild == 1) {
      this.form.get('base').disable();
      this.form.get('value').disable();
      this.form.get('percent').disable();
      this.form.get('accounting_adjustment').disable();
      this.form.get('annual_voucher').disable();
      this.form.get('close_third').disable();
      this.form.get('close_nit').disable();
      this.form.get('bank').disable();
      this.form.get('bank_id').disable();
      this.form.get('nit').disable();
      this.form.get('class_account').disable();
      this.form.get('document').disable();
      this.form.get('account_number').disable();
      this.form.get('report').disable();
      this.form.get('exogenous').disable();
      this.form.get('center_cost').disable();
    } else {
      this.form.get('base').enable();
      this.form.get('value').enable();
      this.form.get('percent').enable();
      this.form.get('accounting_adjustment').enable();
      this.form.get('annual_voucher').enable();
      this.form.get('close_third').enable();
      this.form.get('close_nit').enable();
      this.form.get('bank').enable();
      this.form.get('bank_id').enable();
      this.form.get('nit').enable();
      this.form.get('class_account').enable();
      this.form.get('document').enable();
      this.form.get('status').enable();
      this.form.get('account_number').enable();
      this.form.get('report').enable();
      this.form.get('exogenous').enable();
      this.form.get('center_cost').enable();
    }
  }

  createAccount_plan() {
    /* this.form.markAllAsTouched()
        if (this.form.invalid) { return false } */
    this._planAccountService.createAccount_plan(this.form.value)
    .subscribe( (res:any) => {
        this.modal.hide();
        this.getAccount_plan();
        this.form.reset();
        Swal.fire({
          icon: 'success',
          title: res.data
        });
    })
  }

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo'? 'La Cuenta se inactivará!' : 'La Cuenta se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
    }).then((result) => {
      if (result.isConfirmed) {
        this._planAccountService.createAccount_plan(data)
          .subscribe( res => {
          this.getAccount_plan();
          this.modal.hide();
          Swal.fire({
            title: (status === 'Inactivo' ? 'Cuenta Inhabilitada!' : 'Cuenta activada' ),
            text: (status === 'Inactivo' ? 'La Cuenta ha sido Inhabilitada con éxito.' : 'La Cuenta ha sido activada con éxito.'),
            icon: 'success'
          })
        } )
      }
    })
  }

  getBanks(r) {
    if (r == 0) {
      this.form.get('bank_id').enable();
      this.bankSelected = true;
      this._planAccountService.getBanks()
      .subscribe( (res:any) => {
        this.banks = res.data;
      })
    } else {
      this.bankSelected = false;
    }
  }

  get movement_invalid() {
    return this.form.get('movement').invalid && this.form.get('movement').touched;
  }

  get code_invalid() {
    return this.form.get('code').invalid && this.form.get('code').touched;
  }

  get type_p_invalid() {
    return this.form.get('type_p').invalid && this.form.get('type_p').touched;
  }

  get type_niif_invalid() {
    return this.form.get('type_niif').invalid && this.form.get('type_niif').touched;
  }

  get name_invalid() {
    return this.form.get('name').invalid && this.form.get('name').touched;
  }

  get niif_code_invalid() {
    return this.form.get('niif_code').invalid && this.form.get('niif_code').touched;
  }

  get niif_name_invalid() {
    return this.form.get('niif_name').invalid && this.form.get('niif_name').touched;
  }

  get niif_invalid() {
    return this.form.get('niif').invalid && this.form.get('niif').touched;
  }

  get account_number_invalid() {
    return this.form.get('account_number').invalid && this.form.get('account_number').touched;
  }

  get status_invalid() {
    return this.form.get('status').invalid && this.form.get('status').touched;
  }

  get nature_invalid() {
    return this.form.get('nature').invalid && this.form.get('nature').touched;
  }

}
