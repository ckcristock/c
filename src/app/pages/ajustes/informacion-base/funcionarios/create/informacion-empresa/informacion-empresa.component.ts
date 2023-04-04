import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PersonDataService } from '../personData.service';
import { Subscription } from 'rxjs';
import { DependenciesService } from '../../../services/dependencies.service';
import { CompanyService } from '../../../services/company.service';
import { PositionService } from '../../../services/positions.service';
import { WorkContractTypesService } from '../../../services/workContractTypes.service';
import { consts } from '../../../../../../core/utils/consts';
import { GroupService } from '../../../services/group.service';
import { FixedTurnService } from '../../../turnos/turno-fijo/turno-fijo.service';
import { map } from 'rxjs/operators';

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
  workContractTypes: any[] = [];
  contractTerms: any[] = [];
  fixedTurns: any[];
  groups: any[];
  reload: boolean;


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
    private _fixedTurns: FixedTurnService,
    private _group: GroupService,

  ) { }

  person: any;
  ngOnInit(): void {
    this.crearForm();
    this.reloadData()
  }

  async reloadData() {
    this.getCompanies();
    this.reload = true;
    this.getworkContractTypes();
    this.getRotatingTurns();
    this.$person = this._person.person.subscribe((r) => {
      this.person = r
    });
    await this.getGroups();
    this.reload = false
  }

  async getGroups() {
    await this._group.getGroup().toPromise().then((r: any) => {
      this.groups = r.data
    })
  }
  getCompanies() {
    this._company.getCompanies().subscribe((d: any) => {
      this.companies = d.data;
      console.log(this.companies)
      d.data[0]
        ? this.formCompany.patchValue({ company_id: d.data[0].value })
        : '';
    });
  }
  getDependencies(group_id) {
    this._dependecies.getDependencies({ group_id }).subscribe((d: any) => {
      this.dependencies = d.data;
    });
  }

  getPositions(dependency_id) {
    if (dependency_id) {
      this._positions.getPositions({ dependency_id }).subscribe((d: any) => {
        this.positions = d.data;
      });
    }
  }

  getworkContractTypes() {
    this._workContractTypes.getWorkContractTypes().subscribe((r: any) => {
      this.workContractTypes = r.data;
    });
  }

  getContractTerms(value) {
    this._workContractTypes.getContractTerms().subscribe((r: any) => {
      this.contractTerms = []
      r.data.forEach(
        (contract_term:any) => contract_term.work_contract_types.forEach(
          (work_contract_type: any) => {
            if (work_contract_type.id == value) {
              this.contractTerms.push(contract_term)
            }
          }))
    });

  }

  getRotatingTurns() {
    this._fixedTurns.comboFixedTurns().subscribe((r: any) => {
      this.fixedTurns = r.data
    });
  }
  crearForm() {
    this.formCompany = this.fb.group({
      company_id: ['', Validators.required],
      group_id: ['', Validators.required],
      dependency_id: ['', Validators.required],
      position_id: ['', Validators.required],
      salary: ['', Validators.required],
      date_of_admission: ['', Validators.required],
      work_contract_type_id: ['', Validators.required],
      contract_term_id: ['', Validators.required],
      turn_type: ['Fijo', Validators.required],
      fixed_turn_id: ['', Validators.required],
      date_end: ['', Validators.required],
      transport_assistance: ['']
    });
    /* this.formCompany.get('fixed_turn_id').disable(); */
    this.formCompany.get('date_end').disable();
  }

  turnChanged(turno) {
    if (turno == 'Fijo') {
      console.log('llegando')
      this.formCompany.get('fixed_turn_id').enable();
      this.formCompany.get('fixed_turn_id').setValidators(Validators.required);
    } else {
      this.formCompany.get('fixed_turn_id').disable();
      this.formCompany.get('fixed_turn_id').clearValidators();
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
    //this.formCompany.markAllAsTouched()
    if (this.formCompany.invalid) { return false; }
    this.person.workContract = { ...this.formCompany.value };
    this._person.person.next(this.person)
    this.siguiente.emit({})
  }

  get turnSelected() {
    return this.formCompany.get('turn_type').value;
  }

  ngOnDestroy(): void {
    this.$person.unsubscribe();
  }

  previus() {
    this.anterior.emit()
  }
}
