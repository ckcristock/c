import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';

import * as moment from 'moment';
import { ReporteHorarioService } from './reporte-horario.service';
import { CompanyService } from '../../ajustes/informacion-base/services/company.service';
@Component({
  selector: 'app-reporte-horario',
  templateUrl: './reporte-horario.component.html',
  styleUrls: ['./reporte-horario.component.scss'],
})
export class ReporteHorarioComponent implements OnInit {
  loading = false;
  reporteHorarios: any[] = [];
  groupList: any[] = [];
  dependencyList: any[] = [];
  companies: any[] = [];
  forma: FormGroup;
  constructor(
    private _companies: CompanyService,
    private _grups: GroupService,
    private _dependencies: DependenciesService,
    private fb: FormBuilder,
    private _reporteHorario: ReporteHorarioService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getGroup();
    this.getCompanies();
    this.addElement();
    this.getDiaries();
  }

  getDiaries() {
    let d1 = this.forma.get('first_day').value;
    let d2 = this.forma.get('last_day').value;

    this.loading = true;
    this._reporteHorario.getFixedTurnsDiaries(d1, d2, this.forma.value).subscribe((r) => {
      this.reporteHorarios = r.data;
      this.loading = false;
    });
  }
  getGroup() {
    this._grups.getGroup().subscribe((r: any) => {
      this.groupList = r.data;
      this.groupList.unshift({ value: 0, text: 'Todos' });
    });
  }
  getDependencies(group_id) {
    this._dependencies.getDependencies({ group_id }).subscribe((r: any) => {
      this.dependencyList = r.data;
      this.addElement();
    });
  }
  getCompanies() {
    this._companies.getCompanies().subscribe((r: any) => {
      this.companies = r.data;
      this.companies.unshift({ value: 0, text: 'Todas' });
    });
  }

  createForm() {
    this.forma = this.fb.group({
      turn_type: ['Fijo'],
      first_day: [moment().format('YYYY-MM-DD')],
      last_day: [moment().format('YYYY-MM-DD')],
      group_id: [0],
      dependency_id: [0],
      company_id: [0],
    });

    this.forma.get('group_id').valueChanges.subscribe((valor) => {
      if (valor) {
        this.forma.get('dependency_id').enable();
        this.getDependencies(valor);
      } else {
        this.addElement();
        this.forma.patchValue({ dependency_id: 0 });
        this.forma.get('dependency_id').disable();
      }
    });
  }
  addElement() {
    this.dependencyList.unshift({ value: 0, text: 'Todas' });
  }
  
  get turn_type_value(){
    return this.forma.get('turn_type').value
  }
  
}
