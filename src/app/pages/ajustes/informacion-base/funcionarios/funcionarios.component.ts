import { Component, OnInit, ViewChild } from '@angular/core';

import { personsList } from './data';
import { PersonService } from '../persons/person.service'
import { Person } from 'src/app/core/models/person.model';
import { DependenciesService } from '../services/dependencies.service';
import { MatAccordion } from '@angular/material/expansion';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss']
})

export class FuncionariosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0,
  }
  loading = true;
  filtros = {
    pag: 1,
    status: 'Activo',
    name: '',
    dependency_id: ''
  }
  people: Person[] = [];
  form: FormGroup;
  selectedStatus: any[] = [1, 2, 3, 4]
  selectedDependencies: any[] = [];
  orderObj: any
  filtrosActivos: boolean = false
  paginacion: any
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
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
  }

  ngOnInit(): void {
    this.getDependencies();
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
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
      this.route.queryParamMap
        .subscribe((params) => {
          this.orderObj = { ...params.keys, ...params };
          for (let i in this.orderObj.params) {
            if (this.orderObj.params[i]) {
              if (Object.keys(this.orderObj).length > 2) {
                this.filtrosActivos = true
              }
              this.filtros[i] = this.orderObj.params[i]

            }
          }

          if (this.orderObj.params.pag) {
            this.getPeople(this.orderObj.params.pag);
          } else {
            this.getPeople()
          }
        }
        );
    })
  }

  resetFiltros() {
    for (let i in this.filtros) {
      this.filtros[i] = ''
    }
    this.filtrosActivos = false
    this.getPeople()
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize
    this.getPeople(event.pageIndex + 1)
  }

  SetFiltros(paginacion) {
    let params: any = {};

    this.filtros.pag = paginacion;
    for (let i in this.filtros) {
        if (this.filtros[i] != "") {
            params[i] = this.filtros[i];
        }
    }
    console.log(params)
    let queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
}

  getPeople(page = 1) {
    this.pagination.page = page;
    let params: any = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/ajustes/informacion-base/funcionarios', paramsurl);
    this._person.getPeople(params)
      .subscribe((res: any) => {
        this.loading = false;
        this.people = res.data.data
        this.paginacion = res.data
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
