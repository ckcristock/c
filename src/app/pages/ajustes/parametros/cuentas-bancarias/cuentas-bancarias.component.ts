import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CuentasBancariasService } from './cuentas-bancarias.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import Swal from 'sweetalert2';
import { consts } from '../../../../core/utils/consts';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-cuentas-bancarias',
  templateUrl: './cuentas-bancarias.component.html',
  styleUrls: ['./cuentas-bancarias.component.scss']
})
export class CuentasBancariasComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose(){
    if (this.matPanel == false){
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }    
  }
  loading: boolean = false;
  bankAccounts: any[] = [];
  bankAccount: any = {};
  types = consts.bankType;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro: any = {
    name: ''
  }
  form: FormGroup;
  selected: any;
  constructor(
    private fb: FormBuilder,
    private _bankAccountService: CuentasBancariasService,
    private _validators: ValidatorsService,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.getBankAccounts();
    this.createForm();
  }

  openModal() {
    this.modal.show();
    
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.selected = titulo
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();
    
  }

  getBankAccount(bankAccount) {
    this.bankAccount = { ...bankAccount };
    this.form.patchValue({
      id: this.bankAccount.id,
      type: this.bankAccount.type,
      name: this.bankAccount.name,
      account_number: this.bankAccount.account_number,
      associated_account: this.bankAccount.associated_account,
      balance: this.bankAccount.balance,
      description: this.bankAccount.description
    })
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.bankAccount.id],
      type: ['', this._validators.required],
      name: ['', this._validators.required],
      account_number: ['', this._validators.required],
      associated_account: ['', this._validators.required],
      balance: ['', this._validators.required],
      description: ['', this._validators.required]
    })
  }

  getBankAccounts(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._bankAccountService.getBankAccounts(params)
      .subscribe((res: any) => {
        this.bankAccounts = res.data.data;
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
      });
  }

  createBankAccount() {
    this._bankAccountService.createBankAccounts(this.form.value)
      .subscribe((res: any) => {
        this.modalService.dismissAll(); 
        this.getBankAccounts();
        this._swal.show({
          icon: 'success',
          title: res.data,
          text: '',
          timer: 1000,
          showCancel: false
        })
      }, err => {
        this._swal.show({
          title: 'ERROR',
          text: 'Intenta de nuevo',
          icon: 'error',
          showCancel: false,
        })
      }
      )
  }

  activateOrInactivate(novelty, status) {
    let data = {
      id: novelty.id,
      status
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (status === 'Inactivo' ? '¡La cuenta bancaria se inactivará!' : '¡La cuenta bancaria se activará!'),
      icon: 'question',
      showCancel: true
    })
    .then((result) => {
      if (result.isConfirmed) {
        this._bankAccountService.createBankAccounts(data)
          .subscribe(res => {
            this.getBankAccounts();
            this._swal.show({
              icon: 'success',
              title: (status === 'Inactivo' ? '¡Cuenta bancaria inhabilitada!' : '¡Cuenta bancaria activada!'),
              text: (status === 'Inactivo' ? 'La cuenta bancaria ha sido inhabilitada con éxito.' : 'La cuenta bancaria ha sido activada con éxito.'),
              timer: 1000,
              showCancel: false
            })
            
          });
      }
    });
  }

}
