import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { EstimationValuesService } from './estimation-values.service';

@Component({
  selector: 'app-estimacion-viaticos-values',
  templateUrl: './estimacion-viaticos-values.component.html',
  styleUrls: ['./estimacion-viaticos-values.component.scss']
})
export class EstimacionViaticosValuesComponent implements OnInit {

  @ViewChild('modal') modal:any;
  form: FormGroup;
  loading:boolean = false;
  title:any = '';
  estimations:any[] = [];
  values:any[] = [];
  value:any = {};

  constructor( 
                private fb: FormBuilder,
                private _estimationValue: EstimationValuesService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.createform();
    this.getEstimationValues();
    this.getTravelExpenseEstimation();
  }

  createform(){
    this.form = this.fb.group({
      id: [this.value.id],
      travel_expense_estimation_id: [],
      land_national_value: [0],
      land_international_value: [0],
      aerial_national_value: [0],
      aerial_international_value: [0]
    })
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevos Valores';
  }

  getTravelExpenseEstimation(){
    this._estimationValue.getTravelExpenseEstimation().subscribe((r:any) => {
      this.estimations = r.data;
    })
  }

  getEstimationValue( value ){
    this.value = {...value};
    this.title = 'Actualizar Valores';
    this.form.patchValue({
      id: this.value.id,
      travel_expense_estimation_id: this.value.travel_expense_estimation.description,
      land_national_value: this.value.land_national_value,
      land_international_value: this.value.land_international_value,
      aerial_national_value: this.value.aerial_national_value,
      aerial_international_value: this.value.aerial_international_value
    })
  }

  getEstimationValues(){
    this.loading = true;
    this._estimationValue.getEstimationValues().subscribe((r:any) => {
      this.values = r.data;
      this.loading = false;
    })
  }

  save(){
    this._estimationValue.save(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      this.form.reset();
      this.getEstimationValues();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
