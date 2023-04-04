import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { EstimacionViaticosService } from './estimacion-viaticos.service';
import { MatAccordion } from '@angular/material/expansion';
import { consts } from 'src/app/core/utils/consts';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-estimacion-viaticos',
  templateUrl: './estimacion-viaticos.component.html',
  styleUrls: ['./estimacion-viaticos.component.scss']
})
export class EstimacionViaticosComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  title: any = 'Nueva Estimación Viáticos';
  estimations: any[] = [];
  estimation: any = {};
  estimation_view: any = {};
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtro: any = {
    description: ''
  }

  masksMoney = consts
  variables = [
    { label: 'Cantidad', var: 'amount' },
    { label: 'Valor unitario', var: 'unit_value' },
    { label: '# personas', var: 'people_number' },
    { label: '# días de desplazamiento', var: 'days_number_displacement' },
    { label: 'Horas desplamiento', var: 'hours_displacement' },
    { label: 'Valor hora dezplazamiento', var: 'hours_value_displacement' },
    { label: 'Valor total desplazamiento', var: 'total_value_displacement' },
    { label: '# días ordinarias', var: 'days_number_ordinary' },
    { label: 'Horas ordinarias', var: 'hours_ordinary' },
    { label: 'Valor hora ordinaria', var: 'hours_value_ordinary' },
    { label: 'Valor total ordinaria', var: 'total_value_ordinary' },
    { label: '# días festivos', var: 'days_number_festive' },
    { label: 'Horas festivas', var: 'hours_festive' },
    { label: 'Valor hora festiva', var: 'hours_value_festive' },
    { label: 'Valor total festiva', var: 'total_value_festive' }
  ]

  constructor(
    private fb: FormBuilder,
    private _estimations: EstimacionViaticosService,
    private _swal: SwalService,
    private modalService: NgbModal,
    private _validators: ValidatorsService,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
    this.createform();
    this.getEstimations();
  }

  destination_required: boolean;

  createform() {
    this.form = this.fb.group({
      id: [this.estimation.id],
      description: ['', this._validators.required],
      unit: ['', this._validators.required],
      displacement: [''],
      destination: [''],
      land_national_value: [{ value: 0, disabled: true }, Validators.required],
      land_international_value: [{ value: 0, disabled: true }, Validators.required],
      aerial_national_value: [{ value: 0, disabled: true }, Validators.required],
      aerial_international_value: [{ value: 0, disabled: true }, Validators.required],
      international_value: [{ value: 0, disabled: true }, Validators.required],
      national_value: [{ value: 0, disabled: true }, Validators.required],
      /* amount: [0], */
      unit_value: [0, this._validators.required],
      formula_amount: ['', this._validators.required],
      formula_total_value: ['', this._validators.required]
    })
    let displacement = this.form.get('displacement');
    let destination = this.form.get('destination');
    let unit_value = this.form.get('unit_value');
    let international_value = this.form.get('international_value');
    let national_value = this.form.get('national_value');
    let aerial_national_value = this.form.get('aerial_national_value');
    let aerial_international_value = this.form.get('aerial_international_value');
    let land_national_value = this.form.get('land_national_value');
    let land_international_value = this.form.get('land_international_value');
    displacement.valueChanges.subscribe(r => {
      console.log(r)
      if (r?.length > 0 || destination.value?.length > 0) {
        unit_value.disable();
        national_value.disable();
        international_value.disable();
        destination.setValidators(Validators.required);
        this.destination_required = true;
      } else {
        unit_value.enable();
        aerial_national_value.disable();
        aerial_international_value.disable();
        land_national_value.disable();
        land_international_value.disable();
        destination.clearValidators();
        this.destination_required = false;
      }
      if (r?.length == 0) {
        destination.clearValidators();
        this.destination_required = false;
      }
      if (r?.length == 0 && destination.value?.length > 0) {
        aerial_national_value.disable();
        aerial_international_value.disable();
        land_national_value.disable();
        land_international_value.disable();
        if (destination.value.some(x => x == 'national')) {
          national_value.enable()
        }
        if (destination.value.some(x => x == 'international')) {
          international_value.enable()
        }
      }
      if (r?.length > 0 && destination.value?.length > 0) {
        if (r.some(x => x == 'aerial') && destination.value.some(x => x == 'national')) {
          aerial_national_value.enable()
        } else {
          aerial_national_value.disable()
        }
        if (r.some(x => x == 'land') && destination.value.some(x => x == 'national')) {
          land_national_value.enable()
        } else {
          land_national_value.disable()
        }
        if (r.some(x => x == 'land') && destination.value.some(x => x == 'international')) {
          land_international_value.enable()
        } else {
          land_international_value.disable()
        }
        if (r.some(x => x == 'aerial') && destination.value.some(x => x == 'international')) {
          aerial_international_value.enable()
        } else {
          aerial_international_value.disable()
        }
      }
    })
    destination.valueChanges.subscribe(r => {
      console.log(r)
      if (displacement.value?.length == 0) {

      }
      if (r?.length > 0 || displacement.value?.length > 0) {
        unit_value.disable()
      } else {
        unit_value.enable()
      }
      if (r?.length == 0) {
        aerial_national_value.disable();
        aerial_international_value.disable();
        land_national_value.disable();
        land_international_value.disable();
      }
      if (r?.length > 0 && displacement.value?.length == 0) {
        if (r.some(x => x == 'national')) {
          national_value.enable()
        } else {
          national_value.disable()
        }
        if (r.some(x => x == 'international')) {
          international_value.enable()
        } else {
          international_value.disable()
        }
      } else {
        national_value.disable()
        international_value.disable()
      }
      if (r?.length > 0 && displacement.value?.length > 0) {
        if (r.some(x => x == 'national') && displacement.value.some(x => x == 'aerial')) {
          aerial_national_value.enable()
        } else {
          aerial_national_value.disable()
        }
        if (r.some(x => x == 'national') && displacement.value.some(x => x == 'land')) {
          land_national_value.enable()
        } else {
          land_national_value.disable()
        }
        if (r.some(x => x == 'international') && displacement.value.some(x => x == 'land')) {
          land_international_value.enable()
        } else {
          land_international_value.disable()
        }
        if (r.some(x => x == 'international') && displacement.value.some(x => x == 'aerial')) {
          aerial_international_value.enable()
        } else {
          aerial_international_value.disable()
        }
      }

    })
  }
  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();

  }

  openModal(content) {
    this._modal.open(content);
  }

  verForm() {
    console.log(this.form.value)
  }
  getEstimation(measure) {
    this.estimation = { ...measure };
    this.form.patchValue({
      id: this.estimation.id,
      unit: this.estimation.unit,
      displacement: this.estimation.displacement,
      destination: this.estimation.destination,
      land_national_value: this.estimation.land_national_value,
      land_international_value: this.estimation.land_international_value,
      aerial_national_value: this.estimation.aerial_national_value,
      aerial_international_value: this.estimation.aerial_international_value,
      international_value: this.estimation.international_value,
      national_value: this.estimation.national_value,
      unit_value: this.estimation.unit_value,
      description: this.estimation.description,
      formula_amount: this.estimation.formula_amount,
      formula_total_value: this.estimation.formula_total_value
      /* amount: this.estimation.amount, */
    })
  }

  getEstimations(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._estimations.getTravelExpensEstimations(params).subscribe((r: any) => {
      this.estimations = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  save() {
    this._estimations.save(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getEstimations();
      this._swal.show({
        icon: 'success',
        title: r.data,
        text: '',
        showCancel: false,
        timer: 1000,
      })
    })
  }

}
