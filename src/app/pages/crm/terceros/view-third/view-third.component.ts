import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { NegociosComponent } from '../../negocios/negocios.component';
import { TercerosService } from '../terceros.service';
import { ChartType } from 'chart.js';

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
  public barChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData = [
    { data: [12, 19, 3, 5], label: 'Ventas' }
  ];
  third_id;
  third_data;
  quotations: any[] = [];
  business: any[] = [];
  budgets: any[] = [];
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

  getThird(page = 1) {
    this.loading = true;
    this._tercero.showThirdParty(this.third_id, this.pagination).subscribe((res: any) => {
      this.third_data = res.data.third_party_query;
      this.quotations = res.data.quotations.data
      this.budgets = res.data.budgets.data
      this.business = res.data.business.data
      this.people = res.data.people.data
      this.third_party_fields = res.data.third_party_fields
      this.pagination.collectionSizeQuotation = res.data.quotations.total;
      this.pagination.collectionSizeBusiness = res.data.business.total;
      this.pagination.collectionSizeBudgets = res.data.budgets.total;
      this.pagination.collectionSizePeople = res.data.people.total;
      this.loading = false;
    })
  }

}
