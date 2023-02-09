import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HotelesService } from '../hoteles/hoteles.service';
import { TaxisService } from './taxis.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  styleUrls: ['./taxis.component.scss']
})
export class TaxisComponent implements OnInit {
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
  form: FormGroup;
  cities: any[] = [];
  taxis: any[] = [];
  taxi: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro = {
    tipo: ''
  }

  masksMoney = consts;
  constructor(
    private fb: FormBuilder,
    private _cities: HotelesService,
    private _taxi: TaxisService,
    private _swal: SwalService,
    private modalService: NgbModal,
    private _validators: ValidatorsService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getCities();
    this.getTaxis();
  }

  openModal() {
    this.modal.show();
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();

  }

  createForm() {
    this.form = this.fb.group({
      id: [this.taxi.id],
      route: ['', this._validators.required],
      type: ['', this._validators.required],
      city_id: [null, this._validators.required],
      value: ['', this._validators.required],
      taxi_id: [this.taxi.taxi_id]
    })
  }

  getCities() {
    this._cities.getCities().subscribe((r: any) => {
      this.cities = r.data;
    })
  }

  getTaxis(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._taxi.getTaxis(params).subscribe((r: any) => {
      this.taxis = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  getTaxi(taxi) {
    this.taxi = { ...taxi };
    this.form.patchValue({
      id: this.taxi.id,
      route: this.taxi.taxi.route,
      city_id: this.taxi.city_id,
      type: this.taxi.type,
      value: this.taxi.value,
      taxi_id: this.taxi.taxi_id
    });
  }

  save() {
    let id = this.form.value.id;
    if (id) {
      this._taxi.updateTaxi(this.form.value, id).
        subscribe((r: any) => {
          this.modalService.dismissAll();
          this.getTaxis();
          this.form.reset();
          this._swal.show({
            icon: 'success',
            title: '¡Acualizado!',
            text: 'El taxi ha sido actualizado satisfactoriamente.',
            showCancel: false,
            timer: 1000,
          })
        },
          err => {
            this._swal.show({
              title: 'ERROR',
              text: 'Intenta más tarde',
              icon: 'error',
              showCancel: false,
            })
          }
        )
    } else {
      this._taxi.createTaxi(this.form.value).subscribe((r: any) => {
        this.modalService.dismissAll();
        this.getTaxis();
        this.form.reset();
        this._swal.show({
          icon: 'success',
          title: '¡Creado!',
          text: 'El taxi ha sido creado satisfactoriamente',
          showCancel: false,
          timer: 1000,
        })
      }, err => {
        this._swal.show({
          title: 'ERROR',
          text: 'Intenta más tarde',
          icon: 'error',
          showCancel: false,
        })
      });
    }

  }

}
