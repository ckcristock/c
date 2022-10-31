import { Component, OnInit, ViewChild } from '@angular/core';
import { TiposContratoService } from './tipos-contrato.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import swal from 'sweetalert2';
import { consts } from 'src/app/core/utils/consts';
import { ThemeService } from 'ng2-charts';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-tipos-contrato',
  templateUrl: './tipos-contrato.component.html',
  styleUrls: ['./tipos-contrato.component.scss']
})
export class TiposContratoComponent implements OnInit {
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
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  types = consts.contract_type;
  contracts: any[] = [];
  contrato: any = {};
  filtro: any = {
    name: '',
    description: ''
  }
  form: FormGroup;
  constructor(
    private _tiposContratoService: TiposContratoService,
    private fb: FormBuilder,
    private _reactiveValid: ValidatorsService,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }


  ngOnInit(): void {
    this.createForm();
    this.getContractsType();
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
    this.contrato = { ...data };
    this.form.patchValue({
      id: this.contrato.id,
      description: this.contrato.description,
      name: this.contrato.name
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.contrato.id],
      description: ['', this._reactiveValid.required],
      name: ['', this._reactiveValid.required]
    })
  }

  getContractsType(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._tiposContratoService.getContractsType(params)
      .subscribe((res: any) => {
        console.log(res.data.data)
        console.log(res.data.data[3].contract_terms[0].name)
        this.loading = false;
        this.contracts = res.data.data;
        this.pagination.collectionSize = res.data.total;
      });
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
      showCancel: true,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._tiposContratoService.createNewContract_type(data)
            .subscribe(res => {
              this.getContractsType();
              this._swal.show({
                title: (status === 'Inactivo' ? '¡Contrato inhabilitado!' : '¡Contrato activado!'),
                text: (status === 'Inactivo' ? 'El contrato ha sido inhabilitado con éxito.' : 'El contrato ha sido activado con éxito.'),
                icon: 'success',
                showCancel: false,
                timer: 1000
              })
            })
        }
      })
  }

  createContractType() {
    this._tiposContratoService.createNewContract_type(this.form.value)
      .subscribe((res: any) => {
        this._swal.show({
          title: res.data,
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false
        })
        this.getContractsType();
        this.modalService.dismissAll();
      },
        err => {
          this._swal.show({
            title: 'ERROR',
            text: 'Intenta de nuevo',
            icon: 'error',
            showCancel: false,
          })
        });
  }

  get name_invalid() {
    return this.form.get('name').invalid && this.form.get('name').touched;
  }

}
