import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { EstimacionViaticosService } from './estimacion-viaticos.service';

@Component({
  selector: 'app-estimacion-viaticos',
  templateUrl: './estimacion-viaticos.component.html',
  styleUrls: ['./estimacion-viaticos.component.scss']
})
export class EstimacionViaticosComponent implements OnInit {

  @ViewChild('modal') modal: any;
  form: FormGroup;
  loading: boolean = false;
  title: any = 'Nueva Estimación Viáticos';
  estimations: any[] = [];
  estimation: any = {};
  variables = [
    { label: 'Cantidad', var: 'amount' },
    { label: 'Valor unitario', var: 'unit_value' },
    { label: 'N. Personas', var: 'people_number' },
    { label: 'N. Días Desplazamiento', var: 'days_number_displacement' },
    { label: 'Horas desplamiento', var: 'hours_displacement' },
    { label: 'Valor Hora dezplazamiento', var: 'hours_value_displacement' },
    { label: 'Valor Total desplazamiento', var: 'total_value_displacement' },
    { label: 'N. Días Ordinarias', var: 'days_number_ordinary' },
    { label: 'Horas Ordinarias', var: 'hours_ordinary' },
    { label: 'Valor Hora Ordinarias', var: 'hours_value_ordinary' },
    { label: 'Valor total Ordinarias', var: 'total_value_ordinary' },
    { label: 'N. Días Festivas', var: 'days_number_festive' },
    { label: 'Horas Festivas', var: 'hours_festive' },
    { label: 'Valor Hora Festiva', var: 'hours_value_festive' },
    { label: 'Valor Total festiva', var: 'total_value_festive' }
  ]

  constructor(
    private fb: FormBuilder,
    private _estimations: EstimacionViaticosService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createform();
    this.getEstimations();
  }

  createform() {
    this.form = this.fb.group({
      id: [this.estimation.id],
      description: [''],
      unit: [''],
      amount: [0],
      unit_value: [0],
      formula_amount: [''],
      formula_total_value: ['']
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
  private getDismissReason(reason: any): string {
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

  getEstimation(measure) {
    this.estimation = { ...measure };
    this.form.patchValue({
      id: this.estimation.id,
      unit: this.estimation.unit,
      amount: this.estimation.amount,
      unit_value: this.estimation.unit_value,
      description: this.estimation.description,
      formula_amount: this.estimation.formula_amount,
      formula_total_value: this.estimation.formula_total_value
    })
  }

  getEstimations() {
    this.loading = true;
    this._estimations.getTravelExpensEstimations().subscribe((r: any) => {
      this.estimations = r.data;
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
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
