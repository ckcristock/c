import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { BudgetService } from './budget.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.scss']
})
export class PresupuestosComponent implements OnInit {
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.firstAccordion.openAll();
      this.matPanel = true;
    } else {
      this.firstAccordion.closeAll();
      this.matPanel = false;
    }
  }
  matPanel2 = false;
  openClose2() {
    if (this.matPanel2 == false) {
      this.secondAccordion.openAll();
      this.matPanel2 = true;
    } else {
      this.secondAccordion.closeAll();
      this.matPanel2 = false;
    }
  }
  checkItem: boolean = true
  checkFecha: boolean = true
  checkCliente: boolean = true
  checkDestino: boolean = true
  checkLinea: boolean = true
  checkQuien: boolean = true
  checkTCop: boolean = true
  checkTUsd: boolean = true
  loading = false
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros: any = {
    item: '',
    date: '',
    customer: '',
    municipality_id: '',
    line: '',
    person_id: ''
  }
  orderObj: any
  filtrosActivos: boolean = false
  paginacion: any
  budgets: any[] = []
  constructor(
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private location: Location,
    private _budget: BudgetService,
    private _person: PersonService
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
  }

  ngOnInit(): void {
    this.getPeople();
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
          this.getBudgets(this.orderObj.params.pag);
        } else {
          this.getBudgets()
        }

      }
      );
  }

  people: any[] = []

  getPeople() {
    this._person.getPeopleIndex().subscribe((res:any) => {
      this.people = res.data
      this.people.unshift({ text: 'Todos ', value: '' });
    })
  }

  resetFiltros() {
    for (let i in this.filtros) {
      this.filtros[i] = ''
    }
    this.filtrosActivos = false
    this.getBudgets()
  }

  handlePageEvent(event: PageEvent) {
    this.getBudgets(event.pageIndex + 1)
  }

  SetFiltros(paginacion) {
    let params: any = {};

    params.pag = paginacion;
    for (let i in this.filtros) {
      if (this.filtros[i] != "") {
        params[i] = this.filtros[i];
      }
    }
    let queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
  }
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }

  getBudgets(page = 1): void {
    this.loading = true;

    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/presupuesto', paramsurl);
    this._budget.getAllPaginate(params).subscribe((r: any) => {
      this.budgets = r.data.data
      this.pagination.collectionSize = r.data.total;
      this.paginacion = r.data
      this.loading = false;

    })
  }

  getData(page = 1) {


    this.loading = true;
    /*  this._apuParts.apuPartPaginate(params).subscribe((r:any) => {
       this.apuParts = r.data.data;
       this.pagination.collectionSize = r.data.total;
       this.loading = false;
     }) */
  }

}
