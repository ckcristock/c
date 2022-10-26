import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { FondoPensionService } from './fondo-pension.service';
import { ValidatorsService } from '../services/reactive-validation/validators.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-fondo-pension',
  templateUrl: './fondo-pension.component.html',
  styleUrls: ['./fondo-pension.component.scss']
})
export class FondoPensionComponent implements OnInit {
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
  pensions: any[] = [];
  pension: any = {};
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
    private _fondoPensionService: FondoPensionService,
    private _validators: ValidatorsService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.getPensionFunds();
    this.createForm();
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
    this.pension = { ...data }
    this.selected = 'Actualizar Fondo de Pensión';
    this.form.patchValue({
      id: this.pension.id,
      name: this.pension.name,
      code: this.pension.code,
      nit: this.pension.nit
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.pension.id],
      name: ['', this._validators.required],
      code: ['', this._validators.required],
      nit: ['', this._validators.required]
    });
  }

  getPensionFunds(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._fondoPensionService.getPensionFunds(params)
      .subscribe((res: any) => {
        this.pensions = res.data.data;
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
      text: (status === 'Inactivo' ? '¡El fondo de pensión se inactivará!' : '¡El fondo de pensión se activará!'),
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._fondoPensionService.createPensionFund(data)
            .subscribe(res => {
              this.getPensionFunds();
              this.modalService.dismissAll();
              this._swal.show({
                icon: 'success',
                title: (status === 'Inactivo' ? '¡Fondo de pensión inhabilitado!' : '¡Fondo de pensión activado!'),
                text: (status === 'Inactivo' ? 'El fondo de pensión ha sido inhabilitado con éxito.' : 'El fondo de pensión ha sido activado con éxito.'),
                timer: 1000,
                showCancel: false
              })
            })
        }
      })
  }

  createPensionFund() {
    this._fondoPensionService.createPensionFund(this.form.value)
      .subscribe((res: any) => {
        this.getPensionFunds();
        this.modalService.dismissAll();
        this._swal.show({
          icon: 'success',
          title: res.data,
          text: '',
          timer: 1000,
          showCancel: false
        })
      },
        err => {
          console.log(err)
          this._swal.show({
            title: 'ERROR',
            text: 'Aún no puedes editar un fondo de pensión con el mismo código o NIT, estamos trabajando en esto.',
            icon: 'error',
            showCancel: false,
          })
        }
      )

  }

}
