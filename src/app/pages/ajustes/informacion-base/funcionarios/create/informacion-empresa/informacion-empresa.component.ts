import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PersonDataService } from '../personData.service';
import { Subscription } from 'rxjs';
import { DependenciesService } from '../../../services/dependencies.service';
import { CompanyService } from '../../../services/company.service';
import { PositionService } from '../../../services/positions.service';
import { WorkContractTypesService } from '../../../services/workContractTypes.service';
import { consts } from '../../../../../../core/utils/consts';

@Component({
  selector: 'app-informacion-empresa',
  templateUrl: './informacion-empresa.component.html',
  styleUrls: ['./informacion-empresa.component.scss']
})
export class InformacionEmpresaComponent implements OnInit {
  @Output('siguiente') siguiente = new EventEmitter();
  dependencies: any[]
  companies: any[]
  positions: any[]
  workContractTypes: any[]
  $person: Subscription;
  formCompany: FormGroup

  turnos = consts.turnTypes

  constructor(
    private _person: PersonDataService,
    private fb: FormBuilder,
    private _dependecies: DependenciesService,
    private _company: CompanyService,
    private _positions: PositionService,
    private _workContractTypes: WorkContractTypesService
  ) { }

  ngOnInit(): void {
    this.crearForm()
    this.getCompanies()
    this.getworkContractTypes();
    this.$person = this._person.person.subscribe(r => {
      console.log(r);
      /*  this.person=r */
    })
  }


  getCompanies() {
    this._company.getCompanies().subscribe((d: any) => {
      this.companies = d.data
      this.formCompany.patchValue({ dependency_id: '' })
      d.data[0] ? this.formCompany.patchValue({ company_id: d.data[0].value }) : ''
      this.getDependencies(d.data[0].value)
    })
  }
  getDependencies(company_id) {
    this._dependecies.getDependencies({ company_id }).subscribe((d: any) => {
      this.dependencies = d.data
      this.dependencies.unshift({ text: 'Seleccione una', value: '' })
    })
  }

  getPositions(dependency_id) {
    if (dependency_id) {
      this._positions.getPositions({ dependency_id }).subscribe((d: any) => {
        this.positions = d.data
        this.positions.unshift({ text: 'Seleccione una', value: '' })
      })
    }
    this.formCompany.patchValue({ position_id: '' })
  }

  getworkContractTypes() {
    this._workContractTypes.getWorkContractTypes().subscribe((r: any) => {
      this.workContractTypes = r.data
      this.workContractTypes.unshift({ text: 'Seleccione uno', value: '' })
    })
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
      pensiones_id: ['', Validators.required],
    })
  }
  save() {
    console.log('0saving',this.formCompany.get('turn_type'));
/* 
    this.formCompany.markAllAsTouched()
    if (this.formCompany.valid) {

    }
    this._person.person.next(this.formCompany.value)
    this.siguiente.emit({}) */
  }

  get turnSelected(){
    console.log();
    
    return this.formCompany.get('turn_type').value
  }

}
