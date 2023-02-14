import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { NegociosComponent } from '../../negocios/negocios.component';
import { TercerosService } from '../terceros.service';
import { ChartData, ChartDataSets, ChartType } from 'chart.js';
import { PageEvent } from '@angular/material';
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

@Component({
  selector: 'app-view-third',
  templateUrl: './view-third.component.html',
  styleUrls: ['./view-third.component.scss']
})
export class ViewThirdComponent implements OnInit {
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = [];
  public barChartType: ChartType = 'bar';
  numberMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  paginacionPeople: any
  paginacionQuotation: any
  paginacionBudgets: any
  paginacionBusiness: any
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: [12, 19, 3, 5], label: 'Cotizaciones' },
    { data: [12, 19, 3, 5], label: 'Presupuestos' },
    { data: [12, 19, 3, 5], label: 'Negocios' }
  ];
  third_id;
  third_data;
  quotations: any[] = [];
  business: any[] = [];
  budgets: any[] = [];
  quotations_total: any[] = [];
  business_total: any[] = [];
  budgets_total: any[] = [];
  people: any[] = [];
  third_party_fields: any[] = [];
  loading: boolean;
  active: number = 1;
  pagination: any = {
    pageQuotation: 1,
    pageBusiness: 1,
    pageBudgets: 1,
    pagePeople: 1,
    pageSizeQuotation: 10,
    pageSizeBusiness: 10,
    pageSizeBudgets: 10,
    pageSizePeople: 10,
    collectionSizeQuotation: 0,
    collectionSizeBusiness: 0,
    collectionSizeBudgets: 0,
    collectionSizePeople: 0
  }

  constructor(
    private _tercero: TercerosService,
    private route: ActivatedRoute,
    private _modal: ModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.third_id = params.get('id');
      this.getThird();
    })
  }

  openModal(content) {
    this._modal.open(content)
  }
  monthValue = 4;
  getThird(page = 1) {
    this.loading = true;
    this._tercero.showThirdParty(this.third_id, this.pagination).subscribe((res: any) => {
      this.third_data = res.data.third_party_query;
      this.quotations = res.data.quotations.data
      this.budgets = res.data.budgets.data
      this.business = res.data.business.data
      this.quotations_total = res.data.quotations_total
      this.budgets_total = res.data.budgets_total
      this.business_total = res.data.business_total
      this.people = res.data.people.data
      this.third_party_fields = res.data.third_party_fields
      this.pagination.collectionSizeQuotation = res.data.quotations.total;
      this.pagination.collectionSizeBusiness = res.data.business.total;
      this.pagination.collectionSizeBudgets = res.data.budgets.total;
      this.pagination.collectionSizePeople = res.data.people.total;
      this.paginacionPeople = res.data.people
      this.paginacionBudgets = res.data.budgets
      this.paginacionQuotation = res.data.quotations
      this.paginacionBusiness = res.data.business
      this.loading = false;
      this.graficar()
    })
  }

  openNewTab(route, id = '') {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([route + '/' + id])
    );
    window.open(url, '_blank');
  }

  handlePageEvent(event: PageEvent, type) {
    type == 'people'
    ? this.pagination.pagePeople = event.pageIndex + 1
    : type == 'quotations'
    ? this.pagination.pageQuotation = event.pageIndex + 1
    : type == 'budgets'
    ? this.pagination.pageBudgets = event.pageIndex + 1
    : type == 'business'
    ? this.pagination.pageBusiness = event.pageIndex + 1
    : ''
    this.getThird()
  }

  graficar() {
    var last_n_months = []
    var now = new Date();
    var countQuotations = []
    var countBudgets = []
    var countBusiness = []
    for (var i = 0; i < this.monthValue; i++) {
      last_n_months[i] = monthNames[now.getMonth()] + ' - ' + now.getFullYear().toString()
      now.setMonth(now.getMonth() - 1)
      countQuotations[i] = 0
      countBudgets[i] = 0
      countBusiness[i] = 0
    }
    this.barChartLabels = last_n_months.reverse()

    this.quotations_total.forEach(quotation => {
      var date_quotation = new Date(quotation.created_at);
      var monthQuotation = monthNames[date_quotation.getMonth()] + ' - ' + date_quotation.getFullYear().toString()
      last_n_months.forEach(function (element, key) {
        if (element == monthQuotation) {
          countQuotations[key] = countQuotations[key] + 1
        }
      });
    });
    this.budgets_total.forEach(budget => {
      var date_budgets = new Date(budget.created_at);
      var monthBudget = monthNames[date_budgets.getMonth()] + ' - ' + date_budgets.getFullYear().toString()
      last_n_months.forEach(function (element, key) {
        if (element == monthBudget) {
          countBudgets[key] = countBudgets[key] + 1
        }
      });
    });
    this.business_total.forEach(business => {
      var date_business = new Date(business.created_at);
      var monthBusiness = monthNames[date_business.getMonth()] + ' - ' + date_business.getFullYear().toString()
      last_n_months.forEach(function (element, key) {
        if (element == monthBusiness) {
          countBusiness[key] = countBusiness[key] + 1
        }
      });
    });
    this.barChartData[0].data = countQuotations
    this.barChartData[1].data = countBudgets
    this.barChartData[2].data = countBusiness
  }

}
