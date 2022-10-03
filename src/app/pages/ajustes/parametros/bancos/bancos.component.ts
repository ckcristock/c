import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BancosService } from './bancos.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.scss']
})
export class BancosComponent implements OnInit {
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
  banks: any[] = [];
  bank: any = {};
  selected: any;
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
    private fb: FormBuilder,
    private _bancosService: BancosService,
    private _validators: ValidatorsService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getBanks();
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

  getBank(bank) {
    this.bank = { ...bank };
    this.form.patchValue({
      id: this.bank.id,
      name: this.bank.name,
      code: this.bank.code,
    })
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.bank.id],
      name: ['', this._validators.required],
      code: ['', this._validators.required]
    })
  }

  getBanks(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._bancosService.getBanks(params)
      .subscribe((res: any) => {
        this.banks = res.data.data;
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
      });
  }

  createBank() {
    this._bancosService.createBank(this.form.value)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        this.getBanks();
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
          text: 'Ocurrió un error, intenta más tarde.',
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
      text: (status === 'Inactivo' ? '¡El banco se inactivará!' : '¡El banco se activará!'),
      icon: 'question',
      showCancel: true
    })
    .then((result) => {
      if (result.isConfirmed) {
        this._bancosService.createBank(data)
          .subscribe(res => {
            this.getBanks();
            this._swal.show({
              icon: 'success',
              title: (status === 'Inactivo' ? '¡Banco inhabilitado!' : '¡Banco activado!'),
              text: (status === 'Inactivo' ? 'El banco ha sido inhabilitado con éxito.' : 'El banco ha sido activado con éxito.'),
              timer: 1000,
              showCancel: false
            })
          });
      }
    });
  }

}
