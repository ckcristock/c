import { Component, OnInit, ViewChild, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DisabilityLeavesService } from '../disability-leaves.service';
import { Observable } from 'rxjs';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
import { PayrollFactorService } from '../payroll-factor.service';

@Component({
  selector: 'app-crear-novedad',
  templateUrl: './crear-novedad.component.html',
  styleUrls: ['./crear-novedad.component.scss']
})
export class CrearNovedadComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @Input('open') open: EventEmitter<any>
  form: FormGroup;
  people: any[]
  disabilityLeaves: any[]

  constructor(
    private fb: FormBuilder,
    private _disabilityLeaves: DisabilityLeavesService,
    private _people: PersonService,
    private _payrollFactor: PayrollFactorService
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.getDisabilityLeaves()
    this.getPeople()

    this.open.subscribe(r => {
      this.modal.show();
    })
  }

  getPeople() {
    this._people.getPeopleIndex().subscribe((r: any) => {
      this.people = r.data
      this.people.unshift({ text: 'Seleccione', value: '' })

    })
  }
  getDisabilityLeaves() {
    this._disabilityLeaves.getDisabilityLeaves().subscribe((r: any) => {
      this.disabilityLeaves = r.data
      this.disabilityLeaves.unshift({ text: 'Seleccione', value: '' })
    })
  }

  obtenerTipoNovedad(value) {
    let novedad = this.disabilityLeaves
      .find(novedad => novedad.value === value);
    let tipo = novedad.text.split(" ")[0];
    this.form.patchValue({ disability_type: tipo })
  }

  createForm() {
    this.form = this.fb.group({
      person_id: ['', Validators.required],
      disability_leave_id: ['', Validators.required,],
      disability_type: [{ value: '', disabled: true }, Validators.required],
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      modality: ['Día', Validators.required],
      observation: ['', Validators.required],
    })
  }
  get person_id_invalid() {
    return this.form.get('person_id').invalid && this.form.get('person_id').touched;
  }
  get disability_leave_id_invalid() {
    return this.form.get('disability_leave_id').invalid && this.form.get('disability_leave_id').touched;
  }
  get date_start_invalid() {
    return this.form.get('date_start').invalid && this.form.get('date_start').touched;
  }
  get date_end_invalid() {
    return this.form.get('date_end').invalid && this.form.get('date_end').touched;
  }
  get observation_invalid() {
    return this.form.get('observation').invalid && this.form.get('observation').touched;
  }

  save() {
    this.form.markAllAsTouched()
    if (this.form.invalid) { return false }
    this.form.get('disability_type').enable()
    this._payrollFactor.
      savePayrollFactor(this.form.value)
      .subscribe((r: any) => {
        console.log(r);
        this.createForm()
      })
  }

}
