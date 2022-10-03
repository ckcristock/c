import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FondoCesantiasService } from './fondo-cesantias.service';
import { ValidatorsService } from '../services/reactive-validation/validators.service';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-fondo-cesantias',
  templateUrl: './fondo-cesantias.component.html',
  styleUrls: ['./fondo-cesantias.component.scss']
})
export class FondoCesantiasComponent implements OnInit {
  @ViewChild('modal') modal: any
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
  severances: any[] = [];
  severance: any = {};
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
    private _fondoCensatiasService: FondoCesantiasService,
    private fb: FormBuilder,
    private _validators: ValidatorsService,
    private _swal: SwalService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.createForm();
    this.getSeveranceFunds();
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
  getSeverance(severance) {
    this.severance = { ...severance }
    this.form.patchValue({
      id: this.severance.id,
      name: this.severance.name,
      nit: this.severance.nit
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.severance.nit],
      name: ['', this._validators.required],
      nit: ['', this._validators.required]
    });
  }

  getSeveranceFunds(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._fondoCensatiasService.getSeveranceFunds(params)
      .subscribe((res: any) => {
        this.severances = res.data.data;
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
      text: (status === 'Inactivo' ? '¡El fondo de cesantías se inactivará!' : '¡El fondo de cesantías se activará!'),
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._fondoCensatiasService.createSeveranceFunds(data)
            .subscribe(res => {
              this.getSeveranceFunds();
              this._swal.show({
                icon: 'success',
                title: (status === 'Inactivo' ? '¡Fondo de cesantías inhabilitado!' : '¡Fondo de cesantías activado!'),
                text: (status === 'Inactivo' ? 'El fondo de cesantías ha sido nnhabilitado con éxito.' : 'El fondo de cesantías ha sido activado con éxito.'),
                timer: 1000,
                showCancel: false
              })
            })
        }
      })
  }

  createSeveranceFunds() {
    this._fondoCensatiasService.createSeveranceFunds(this.form.value)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        this.getSeveranceFunds();
        this._swal.show({
          icon: 'success',
          title: res.data,
          text: '',
          timer: 1000,
          showCancel: false
        })
      },
      err => {
        this._swal.show({
          title: 'ERROR',
          text: 'Aún no puedes editar un fondo de cesantías con el mismo NIT, estamos trabajando en esto.',
          icon: 'error',
          showCancel: false,
        })
      }
      );
  }


}
