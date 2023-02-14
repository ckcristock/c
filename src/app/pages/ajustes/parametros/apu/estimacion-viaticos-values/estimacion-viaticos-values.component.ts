import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { EstimationValuesService } from './estimation-values.service';
import { MatAccordion } from '@angular/material/expansion';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-estimacion-viaticos-values',
  templateUrl: './estimacion-viaticos-values.component.html',
  styleUrls: ['./estimacion-viaticos-values.component.scss']
})
export class EstimacionViaticosValuesComponent implements OnInit {

  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  form: FormGroup;
  loading: boolean = false;
  title: any = '';
  estimations: any[] = [];
  values: any[] = [];
  value: any = {};
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtro: any = {
    description: ''
  }

  masksMoney = consts

  openClose(){
    if (this.matPanel == false){
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }

  constructor(
    private fb: FormBuilder,
    private _estimationValue: EstimationValuesService,
    private _swal: SwalService,
    private modalService: NgbModal,
    private _validators: ValidatorsService,
  ) { }

  ngOnInit(): void {
    this.createform();
    this.getEstimationValues();
    this.getTravelExpenseEstimation();
  }

  createform() {
    this.form = this.fb.group({
      id: [this.value.id],
      travel_expense_estimation_id: ['', this._validators.required],
      land_national_value: [0],
      land_international_value: [0],
      aerial_national_value: [0],
      aerial_international_value: [0]
    })
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

  openModal() {
    this.modal.show();

  }

  getTravelExpenseEstimation() {
    this._estimationValue.getTravelExpenseEstimation().subscribe((r: any) => {
      this.estimations = r.data;
    })
  }

  getEstimationValue(value) {
    this.value = { ...value };
    this.form.patchValue({
      id: this.value.id,
      travel_expense_estimation_id: this.value.travel_expense_estimation.id,
      land_national_value: this.value.land_national_value,
      land_international_value: this.value.land_international_value,
      aerial_national_value: this.value.aerial_national_value,
      aerial_international_value: this.value.aerial_international_value
    })
  }

  getEstimationValues(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._estimationValue.getEstimationValues(params).subscribe((r: any) => {
      this.values = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  save() {
    this._estimationValue.save(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getEstimationValues();
      this._swal.show({
        icon: 'success',
        title: r.data,
        text: '',
        showCancel: false,
        timer: 1000
      })
    }, err => {
      this._swal.show({
        title: 'ERROR',
        text: 'Ocurrió un error, intente de nuevo',
        icon: 'error',
        showCancel: false,
      })
    }
    );
  }

}
