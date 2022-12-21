import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ApusService } from './apus.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { DateAdapter } from 'saturn-datepicker';
@Component({
  selector: 'app-apus',
  templateUrl: './apus.component.html',
  styleUrls: ['./apus.component.scss']
})
export class ApusComponent implements OnInit {
  datePipe = new DatePipe('es-CO');
  checkTipo: boolean = true
  date: any;
  checkNombre: boolean = true
  checkCliente: boolean = true
  checkDestino: boolean = true
  checkLinea: boolean = true
  checkQuien: boolean = true
  checkFecha: boolean = true
  apus: any[] = [];
  loading: boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros: any = {
    code: '',
    date_one:'',
    date_two: '',
    name: '',
    city: '',
    client: '',
    line: '',
    type: '',
    description: ''
  }
  constructor(
    private _apus: ApusService,
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private location: Location,
    private dateAdapter: DateAdapter<any>
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.dateAdapter.setLocale('es');
  }
  orderObj: any
  filtrosActivos: boolean = false
  paginacion: any

  ngOnInit(): void {
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
        let date_one = new Date(this.filtros.date_one)
        let date_two = new Date(this.filtros.date_two)
        date_one.setDate(date_one.getDate() + 1)
        date_two.setDate(date_two.getDate() + 1)
        this.date = {begin: date_one, end: date_two}

        if (this.orderObj.params.pag) {
          this.getApus(this.orderObj.params.pag);
        } else {
          this.getApus()
        }

      }
      );
  }

  selectedDate(fecha) {
    if (fecha.value){
      this.filtros.date_one = this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd')
      this.filtros.date_two = this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd');
    } else {
      this.filtros.date_one = ''
      this.filtros.date_two = ''
    }
    this.getApus();
  }

  resetFiltros() {
    for (let i in this.filtros) {
      this.filtros[i] = ''
    }
    this.filtrosActivos = false
    this.getApus()
  }

  handlePageEvent(event: PageEvent) {
    console.log(event)
    this.getApus(event.pageIndex + 1)
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
  getApus(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/apus', paramsurl);
    this.loading = true;
    this._apus.getApus(params).subscribe((r: any) => {
      this.apus = r.data.data;
      this.paginacion = r.data
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

}
