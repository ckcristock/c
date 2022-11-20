import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';
import { QuotationService } from './quotation.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})
export class CotizacionComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  quotations: any;
  loading: boolean;
  filters = {
    date: '',
    city: '',
    code: '',
    client: '',
    description: '',
    status: '',
  }
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  constructor(
    private _quotations: QuotationService
  ) { }

  ngOnInit(): void {
    this.getQuotation();
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
  count_pendiente = 0;
  count_aprobada = 0;
  count_no_aprobada = 0;
  count_anulada = 0;
  getQuotation( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filters
    }
    this.loading = true;
    this._quotations.getQuotations(params)
      .subscribe((res:any) => {
        this.quotations = res.data.data;
        this.pagination.collectionSize = res.data.total;
        this.quotations.forEach(element => {
          if(element.status == 'Pendiente') {
            this.count_pendiente ++;
          } else if (element.status == 'Aprobada') {
            this.count_aprobada ++
          } else if (element.status == 'No aprobada') {
            this.count_no_aprobada ++
          } else if (element.status == 'Anulada') {
            this.count_anulada ++
          }
        });
        this.loading = false;
      })
  }

}
