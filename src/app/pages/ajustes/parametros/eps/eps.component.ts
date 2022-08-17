import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { EpsService } from './eps.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-eps',
  templateUrl: './eps.component.html',
  styleUrls: ['./eps.component.scss']
})
export class EpsComponent implements OnInit {
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
  epss: any = [];
  eps: any = {};
  filtros: any = {
    name: '',
    code: ''
  }
  selected: any;
  form: FormGroup;
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }
  status: any = 'Inactivo';
  loading: boolean = false;

  constructor(
    private epsService: EpsService,
    private fb: FormBuilder,
    private _validators: ValidatorsService,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.getAllEps();
    this.createForm();
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

  openModal() {
    this.modal.show();


  }

  getEps(eps) {
    this.eps = { ...eps };
    this.form.patchValue({
      id: this.eps.id,
      name: this.eps.name,
      code: this.eps.code,
      nit: this.eps.nit
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.eps.id],
      name: ['', this._validators.required],
      code: ['', this._validators.required],
      nit: ['', this._validators.required]
    });
  }

  getAllEps(page = 1) {

    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this.epsService.getAllEps(params)
      .subscribe((res: any) => {
        this.loading = false;
        this.epss = res.data.data;
        this.pagination.collectionSize = res.data.total;
      });
  }

  anularOActivar(zone, status) {
    let data: any = {
      id: zone.id,
      status
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (status === 'Inactivo' ? '¡La EPS se inactivará!' : '¡La EPS se activará!'),
      icon: 'question',
      showCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.epsService.createNewEps(data)
          .subscribe(res => {
            this.getAllEps();
            this._swal.show({
              title: (status === 'Inactivo' ? '¡EPS inhabilitada!' : '¡EPS activada!'),
              text: (status === 'Inactivo' ? 'La EPS ha sido inhabilitada con éxito.' : 'La EPS ha sido activada con éxito.'),
              icon: 'success',
              showCancel: false,
              timer: 1000
            })            
          })
      }
    })
  }


  createNewEps() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false; }
    this.epsService.createNewEps(this.form.value)
      .subscribe((res: any) => {
        console.log(res)
        this.getAllEps();
        this.modalService.dismissAll();
        this._swal.show({
          title: res.data,
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false
        })
      },
        err => {
          this._swal.show({
            title: 'ERROR',
            text: 'El NIT o el código ya existen',
            icon: 'error',
            showCancel: false,
          })
        }

      );
  }

  get name_eps_valid() {
    return (
      this.form.get('name').invalid && this.form.get('name').touched
    )
  }

  get code_eps_valid() {
    return (
      this.form.get('code').invalid && this.form.get('code').touched
    )
  }

  get nit_eps_valid() {
    return (
      this.form.get('nit').invalid && this.form.get('nit').touched
    )
  }


}
