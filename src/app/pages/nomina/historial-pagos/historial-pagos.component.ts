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
  renderizar = false
  constructor(private _payrollPayments: PayRollPaymentsService) { }

  ngOnInit(): void {
    this.getHistorialPagos()
  }
  getHistorialPagos() {
  
    this._payrollPayments.getPayrollHistory().subscribe((r: any) => {
      console.log(r);
      
      this.historialPagos = r.data
      this.renderizar = true
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
