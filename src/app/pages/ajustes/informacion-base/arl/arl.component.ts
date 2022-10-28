import { Component, OnInit, ViewChild } from '@angular/core';
import { ArlService } from './arl.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../services/reactive-validation/validators.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-arl',
  templateUrl: './arl.component.html',
  styleUrls: ['./arl.component.scss']
})
export class ArlComponent implements OnInit {
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
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  boolNuevaArl: boolean;
  selected: any;
  arls: any[] = [];
  private arl: any = {};
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
    private _arlService: ArlService,
    private fb: FormBuilder,
    private _validators: ValidatorsService,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.getArls();
    this.createForm();
  }
  closeResult = '';
  public openConfirm(confirm, titulo, nuevaArl) {
    this.boolNuevaArl = nuevaArl;
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

  openModal() {
    this.modal.show();
    this.form.reset();
  }

  getData(data) {
    this.arl = { ...data }
    this.form.patchValue({
      id: this.arl.id,
      name: this.arl.name,
      accounting_account: this.arl.accounting_account,
      nit: this.arl.nit
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.arl.id],
      name: ['', this._validators.required],
      accounting_account: ['', this._validators.required],
      nit: ['', this._validators.required],
    });
  }

  getArls(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._arlService.getArls(params)
      .subscribe((res: any) => {
        this.arls = res.data.data;
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
      })
  }

  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (status === 'Inactivo' ? '¡El contrato se inactivará!' : '¡El contrato se activará!'),
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._arlService.createArl(data)
            .subscribe(res => {
              this.getArls();
              this.modalService.dismissAll();
              this._swal.show({
                icon: 'success',
                title: (status === 'Inactivo' ? 'Contrato inhabilitado!' : 'Contrato activado'),
                text: (status === 'Inactivo' ? 'El contrato ha sido inhabilitadao con éxito.' : 'El contrato ha sido activado con éxito.'),
                timer: 1000,
                showCancel: false
              })
            })
        }
      })
  }

  createArl() {
    let data = {};
    if(this.boolNuevaArl){
      data = this.form.value
    } else {
      data = {
        id: this.form.get("id").value,
        name: this.form.get("name").value
      }
    }
    this._arlService.createArl(data)
      .subscribe((res: any) => {
        this.getArls();
        this.modalService.dismissAll();
        this._swal.show({
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado a la ARL con éxito.',
          timer: 1000,
          showCancel: false
        })
      }, err => {
        this._swal.show({
          title: 'ERROR',
          text: err?.error.errors.nit[0],
          icon: 'error',
          showCancel: false,
        })
      }
      );
  }

  get name_invalid() {
    return this.form.get('name').invalid && this.form.get('name').touched;
  }

  get accounting_account_invalid() {
    return this.form.get('accounting_account').invalid && this.form.get('accounting_account').touched;
  }

  get nit_invalid() {
    return this.form.get('nit').invalid && this.form.get('nit').touched;
  }

}
