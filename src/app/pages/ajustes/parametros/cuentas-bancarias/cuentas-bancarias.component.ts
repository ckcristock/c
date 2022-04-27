import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CuentasBancariasService } from './cuentas-bancarias.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import Swal from 'sweetalert2';
import { consts } from '../../../../core/utils/consts';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';

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
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    this.form.reset();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
        Swal.fire({
          icon: 'success',
          title: res.data
        })
      })
  }

  activateOrInactivate(novelty, status) {
    let data = {
      id: novelty.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo' ? 'La Cuenta Bancaria se inactivará!' : 'La Cuenta Bancaria se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: (status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar')
    }).then((result) => {
      if (result.isConfirmed) {
        this._bankAccountService.createBankAccounts(data)
          .subscribe(res => {
            this.getBankAccounts();
            Swal.fire({
              title: (status === 'Inactivo' ? 'La Cuenta Bancaria Inhabilitada!' : 'La Cuenta Bancaria activada'),
              text: (status === 'Inactivo' ? 'La Cuenta Bancaria ha sido Inhabilitada con éxito.' : 'La Cuenta Bancaria ha sido activada con éxito.'),
              icon: 'success'
            });
          });
      }
    });
  }

}
