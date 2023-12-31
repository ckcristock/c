import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DisabilityLeavesService } from '../disability-leaves.service';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
import { PayrollFactorService } from '../payroll-factor.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-crear-novedad',
  templateUrl: './crear-novedad.component.html',
  styleUrls: ['./crear-novedad.component.scss'],
})
export class CrearNovedadComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @Input('open') open: EventEmitter<any>;
  @Output('saving') saving = new EventEmitter();
  form: FormGroup;
  people: any[];
  disabilityLeaves: any[];
  vacationSelected: boolean;
  constructor(
    private fb: FormBuilder,
    private _disabilityLeaves: DisabilityLeavesService,
    private _people: PersonService,
    private _payrollFactor: PayrollFactorService,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getDisabilityLeaves();
    this.getPeople();
    this.open.subscribe((r) => {
      if (r?.data) {
        this.form.patchValue({
          id: r.data.id,
          person_id: r.data.person_id,
          disability_leave_id: r.data.disability_leave_id,
          disability_type: r.data.disability_type,
          date_start: moment.utc(r.data.date_start).format('YYYY-MM-DD'),
          date_end: moment.utc(r.data.date_end).format('YYYY-MM-DD'),
          modality: r.data.modality,
          number_days: r.data.number_days,
          observation: r.data.observation,
          payback_date: r.data.payback_date,
        });
      } else {
        this.createForm();
      }
      this.openConfirm(this.modal);
    });
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {

  }

  getPeople() {
    this._people.getPeopleIndex().subscribe((r: any) => {
      this.people = r.data;
      this.people.unshift({ text: 'Selecciona', value: '' });
    });
  }
  getDisabilityLeaves() {
    this._disabilityLeaves.getDisabilityLeaves().subscribe((r: any) => {
      this.disabilityLeaves = r.data;
    });
  }

  obtenerTipoNovedad(value) {
    let novedad = this.disabilityLeaves.find((novedad) => novedad.value === value);
    let tipo = novedad.text.split(' ')[0];
    tipo == 'Vacaciones' ? (this.vacationSelected = true) : (this.vacationSelected = false);
    this.form.patchValue({ disability_type: tipo });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return false;
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: ''
    }).then((result) => {
      if (result.value) {
        this.sendData();
      }
    });
  }
  sendData() {
    this.form.get('disability_type').enable();
    this._payrollFactor.savePayrollFactor(this.form.value).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal.show({
          icon: 'success',
          title: 'Operación exitosa',
          showCancel: false,
          text: 'Se han actualizado las novedades',
          timer: 1000
        })
        this.createForm();
        this.saving.next();
        this.modalService.dismissAll();
        //this.modal.hide();
      } else {
        this._swal.show({
          icon: 'error',
          title: 'Operación denegada',
          showCancel: false,
          text: r.err,
        })
      }
    });
  }
  createForm() {
    this.form = this.fb.group({
      id: [''],
      person_id: [null, Validators.required],
      disability_leave_id: [null, Validators.required],
      disability_type: [{ value: '', disabled: true }, Validators.required],
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      modality: ['Día', Validators.required],
      observation: ['', Validators.required],
      payback_date: ['', Validators.required],
      number_days: ['', Validators.required],
    });
    this.form.get('number_days').valueChanges.subscribe((r) => {
      const date_start = this.form.get('date_start');
      if (date_start.value) {
        const date_end = this.form.get('date_end');
        const payback_date = this.form.get('payback_date');
        const finalDate = moment(date_start.value).add(r - 1, 'days').format('YYYY-MM-DD');

        date_end.patchValue(finalDate);
        payback_date.patchValue(finalDate);
      }
    });
  }
  get person_id_invalid() {
    return (
      this.form.get('person_id').invalid && this.form.get('person_id').touched
    );
  }
  get disability_leave_id_invalid() {
    return (
      this.form.get('disability_leave_id').invalid &&
      this.form.get('disability_leave_id').touched
    );
  }
  get date_start_invalid() {
    return (
      this.form.get('date_start').invalid && this.form.get('date_start').touched
    );
  }
  get date_end_invalid() {
    return (
      this.form.get('date_end').invalid && this.form.get('date_end').touched
    );
  }
  get observation_invalid() {
    return (
      this.form.get('observation').invalid &&
      this.form.get('observation').touched
    );
  }
  get number_days_invalid() {
    return (
      this.form.get('number_days').invalid &&
      this.form.get('number_days').touched
    );
  }
}
