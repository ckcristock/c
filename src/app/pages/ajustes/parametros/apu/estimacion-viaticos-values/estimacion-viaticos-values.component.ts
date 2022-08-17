import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { EstimationValuesService } from './estimation-values.service';

@Component({
  selector: 'app-estimacion-viaticos-values',
  templateUrl: './estimacion-viaticos-values.component.html',
  styleUrls: ['./estimacion-viaticos-values.component.scss']
})
export class EstimacionViaticosValuesComponent implements OnInit {

  @ViewChild('modal') modal: any;
  form: FormGroup;
  loading: boolean = false;
  title: any = '';
  estimations: any[] = [];
  values: any[] = [];
  value: any = {};

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

  getEstimationValues() {
    this.loading = true;
    this._estimationValue.getEstimationValues().subscribe((r: any) => {
      this.values = r.data;
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
        title: 'Creado con éxito',
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
