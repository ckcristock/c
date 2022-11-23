import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PayRollPaymentsService } from './pay-roll-payments.service';

@Component({
  selector: 'app-historial-pagos',
  templateUrl: './historial-pagos.component.html',
  styleUrls: ['./historial-pagos.component.scss']
})
export class HistorialPagosComponent implements OnInit {
  historialPagos: any[] = []
  loading: boolean;
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filters: any = {
    date: ''
  }
  constructor(private _payrollPayments: PayRollPaymentsService) { }

  ngOnInit(): void {
    this.getHistorialPagos()
  }

  getHistorialPagos(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    let params = {
      ...this.pagination, ...this.filters
    }
    this._payrollPayments.getPayrollHistory(params).subscribe((r: any) => {
      this.historialPagos = r.data.data
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  redirectToNomina(periodoPago) {
    /*  this.$router.push({
       name: 'PagoNomina',
       params: {
         inicio: periodoPago.inicio_periodo,
         fin: periodoPago.fin_periodo,
       },
     }) */
  }

  formatFechas({ inicio_periodo, fin_periodo }) {
    const inicioPeriodo = moment(inicio_periodo).format('DD/MM/YYYY')
    const finPeriodo = moment(fin_periodo).format('DD/MM/YYYY')
    return `${inicioPeriodo} - ${finPeriodo}`
  }

}
