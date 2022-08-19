import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { consts } from '../../../../core/utils/consts';
import { TiposIngresoService } from './tipos-ingreso.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-tipos-ingreso',
  templateUrl: './tipos-ingreso.component.html',
  styleUrls: ['./tipos-ingreso.component.scss']
})
export class TiposIngresoComponent implements OnInit {

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
  ingresss: any[] = [];
  ingress: any = {};
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro: any = {
    name: ''
  }
  form: FormGroup;
  ingressTypes = consts.Ingresstypes;
  constructor(
    private _ingressTypeService: TiposIngresoService,
    private _validators: ValidatorsService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.getIngressType();
    this.createForm();
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
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  openModal() {
    this.modal.show();


  }

  getIngress(egress) {
    this.ingress = { ...egress }
    this.form.patchValue({
      id: this.ingress.id,
      name: this.ingress.name,
      associated_account: this.ingress.associated_account,
      type: this.ingress.type
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.ingress.id],
      name: ['', this._validators.required],
      associated_account: ['', this._validators.required],
      type: ['', this._validators.required]
    });
  }

  getIngressType(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._ingressTypeService.getIngressType(params)
      .subscribe((res: any) => {
        this.ingresss = res.data.data;
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
      });
  }

  createIngressType() {
    this._ingressTypeService.createIngressType(this.form.value)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        this.getIngressType();
        this._swal.show({
          title: res.data,
          icon: 'success',
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
      )
  }

  activateOrInactivate(novelty, status) {
    let data = {
      id: novelty.id,
      status
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (status === 'Inactivo' ? '¡El tipo de ingreso se inactivará!' : '¡El tipo de ingreso se activará!'),
      icon: 'question',
      showCancel: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        this._ingressTypeService.createIngressType(data)
          .subscribe(res => {
            this.getIngressType();
            this._swal.show({
              title: (status === 'Inactivo' ? '¡Tipo de ingreso inhabilitado!' : '¡Tipo de ingreso activado!'),
              text: (status === 'Inactivo' ? 'El tipo de ingreso ha sido inhabilitado con éxito.' : 'El tipo de ingreso ha sido activado con éxito.'),
              icon: 'success',
              showCancel: false,
              timer: 1000
            })   
            
          });
      }
    });
  }

}
