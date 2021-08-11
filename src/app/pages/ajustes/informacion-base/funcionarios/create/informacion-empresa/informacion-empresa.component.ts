import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PersonDataService } from '../personData.service';
import { Subscription } from 'rxjs';
import { DependenciesService } from '../../../services/dependencies.service';
import { CompanyService } from '../../../services/company.service';
import { PositionService } from '../../../services/positions.service';
import { WorkContractTypesService } from '../../../services/workContractTypes.service';
import { consts } from '../../../../../../core/utils/consts';
import { RotatingTurnsService } from '../../../services/rotating-turns.service';

@Component({
  selector: 'app-informacion-empresa',
  templateUrl: './informacion-empresa.component.html',
  styleUrls: ['./informacion-empresa.component.scss'],
})
export class InformacionEmpresaComponent implements OnInit {
  @Output('siguiente') siguiente = new EventEmitter();
  @Output('anterior') anterior = new EventEmitter();
  dependencies: any[];
  companies: any[];
  positions: any[];
  workContractTypes: any[];
  rotatingTurns: any[];
  $person: Subscription;
  formCompany: FormGroup;

  turnos = consts.turnTypes;

  constructor(
    private _person: PersonDataService,
    private fb: FormBuilder,
    private _dependecies: DependenciesService,
    private _company: CompanyService,
    private _positions: PositionService,
    private _workContractTypes: WorkContractTypesService,
    private _rotatingTurns: RotatingTurnsService
  ) { }

  person: any;
  ngOnInit(): void {
    this.crearForm();
    this.getCompanies();
    this.getworkContractTypes();
    this.getRotatingTurns();
    this.$person = this._person.person.subscribe((r) => {
      this.person = r
    });
  }

  getCompanies() {
    this._company.getCompanies().subscribe((d: any) => {
      this.companies = d.data;
      d.data[0]
        ? this.formCompany.patchValue({ company_id: d.data[0].value })
        : '';
      this.getDependencies(d.data[0].value);
    });
  }
  getDependencies(company_id) {
    this._dependecies.getDependencies({ company_id }).subscribe((d: any) => {
      this.dependencies = d.data;
      this.dependencies.unshift({ text: 'Seleccione una', value: '' });
    });
  }

  getPositions(dependency_id) {
    if (dependency_id) {
      this._positions.getPositions({ dependency_id }).subscribe((d: any) => {
        this.positions = d.data;
        this.positions.unshift({ text: 'Seleccione una', value: '' });
      });
    }
  }

  getworkContractTypes() {
    this._workContractTypes.getWorkContractTypes().subscribe((r: any) => {
      this.workContractTypes = r.data;
      this.workContractTypes.unshift({ text: 'Seleccione uno', value: '' });
    });
  }
  getRotatingTurns() {
    this._rotatingTurns.getRotatingTurns().subscribe((r: any) => {
      this.rotatingTurns = r.data;
      this.rotatingTurns.unshift({ text: 'Seleccione una', value: '' });
    });
  }
  crearForm() {
    this.formCompany = this.fb.group({
      company_id: ['', Validators.required],
      dependency_id: ['', Validators.required],
      position_id: ['', Validators.required],
      salary: ['', Validators.required],
      date_of_admission: ['', Validators.required],
      work_contract_type_id: ['', Validators.required],
      turn_type: ['Fijo', Validators.required],
      rotating_turn_id: ['', Validators.required],
      date_end: ['', Validators.required],
    });
    this.formCompany.get('rotating_turn_id').disable();
    this.formCompany.get('date_end').disable();
  }

  turnChanged(turno) {
    if (turno == 'Rotativo') {
      this.formCompany.get('rotating_turn_id').enable();
    } else {
      this.formCompany.get('rotating_turn_id').disable();
    }
  }
  conludeContract = false;
  workContractTypesChanged(conclude) {
    if (conclude) {
      this.formCompany.get('date_end').enable();
      this.conludeContract = true;
    } else {
      this.formCompany.get('date_end').disable();
      this.conludeContract = false;
    }
  }
  save() {
    console.log('0saving', this.formCompany.value, this.formCompany);
    this.formCompany.markAllAsTouched()
    if (this.formCompany.valid) {

    }

    this.person.worContract = { ...this.formCompany.value };
    this._person.person.next(this.person)
    this.siguiente.emit({})
  }

  get turnSelected() {
    return this.formCompany.get('turn_type').value;
  }
  get company_id_invalid() {
    return (
      this.formCompany.get('company_id').invalid && this.formCompany.get('company_id').touched
    );
  }
  get dependency_id_invalid() {
    return (
      this.formCompany.get('dependency_id').invalid && this.formCompany.get('dependency_id').touched
    );
  }
  get position_id_invalid() {
    return (
      this.formCompany.get('position_id').invalid && this.formCompany.get('position_id').touched
    );
  }
  get salary_invalid() {
    return (
      this.formCompany.get('salary').invalid && this.formCompany.get('salary').touched
    );
  }
  get date_of_admission_invalid() {
    return (
      this.formCompany.get('date_of_admission').invalid && this.formCompany.get('date_of_admission').touched
    );
  }
  get work_contract_type_id_invalid() {
    return (
      this.formCompany.get('work_contract_type_id').invalid && this.formCompany.get('work_contract_type_id').touched
    );
  }
  get turn_type_invalid() {
    return (
      this.formCompany.get('turn_type').invalid && this.formCompany.get('turn_type').touched
    );
  }
  get rotating_turn_id_invalid() {
    return (
      this.formCompany.get('rotating_turn_id').invalid && this.formCompany.get('rotating_turn_id').touched
    );
  }
  get date_end_invalid() {
    return (
      this.formCompany.get('date_end').invalid && this.formCompany.get('date_end').touched
    );
  }
  ngOnDestroy(): void {
    this.$person.unsubscribe();
  }

  previus(){
    this.anterior.emit()
  }
}
