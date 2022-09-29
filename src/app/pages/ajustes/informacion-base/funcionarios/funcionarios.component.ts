import { Component, OnInit, ViewChild } from '@angular/core';

import { personsList } from './data';
import { PersonService } from '../persons/person.service'
import { Person } from 'src/app/core/models/person.model';
import { DependenciesService } from '../services/dependencies.service';
import { MatAccordion } from '@angular/material/expansion';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss']
})

export class FuncionariosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  pagination = {
    pageSize: 12,
    page: 1,
    collectionSize: 0,
  }
  loading = true;
  people: Person[] = [];
  form: FormGroup;
  selectedStatus: any[] = [1, 2, 3, 4]
  selectedDependencies: any[] = []
  status: any[] = [
    { id: 1, name: 'Activo', selected: true },
    { id: 2, name: 'Inactivo', selected: true },
    { id: 3, name: 'Liquidado', selected: true },
    { id: 4, name: 'PreLiquidado', selected: true },
  ];

  public dependencies: any[]

  constructor(
    private _person: PersonService,
    private _dependencies: DependenciesService,
    private fb: FormBuilder,
  ) {
    this.getDependencies();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      status: '',
      dependency_id: '',
      name: ''
    })
  }

  getDependencies() {
    this._dependencies.getDependencies().subscribe((r: any) => {
      this.dependencies = r.data
      for (let i in this.dependencies) {
        this.selectedDependencies.push(this.dependencies[i].value)
      }
      this.dependencies = this.dependencies.map(r => {
        r.selected = true;
        return r
      })
      this.getPeople();
    })
  }

  getPeople(page = 1) {
    this.pagination.page = page;
    let params: any = {
      ...this.pagination, ...this.form.value
    }
    this.loading = true;
    /* params.status = this.statusFilter();
    params.dependencies = this.dependenciesFilter();
    params.name = name ? name : '' */
    this._person.getPeople(params)
      .subscribe((res: any) => {
        this.loading = false;
        this.people = res.data.data
        this.pagination.collectionSize = res.data.total
      })
  }

  getData() {


  }

  statusFilter() {
    return this.status.
      reduce((acc: Array<any>, el) => el.selected == true ? acc.concat([el.name]) : acc
        , [])
  }
  dependenciesFilter() {
    return this.dependencies.
      reduce((acc: Array<any>, el) => el.selected == true ? acc.concat([el.value]) : acc
        , [])
  }
}
