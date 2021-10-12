import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PayRollService } from './pay-roll.service';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss'],
})
export class NominaComponent implements OnInit {
  nomina: any = {
    frecuencia_pago:30,
  };
  constructor(private _payroll: PayRollService) {}
  
  funcionarios = [
    { 
      first_name:'Carlos',
      first_surname:'Cardona',
      valor_ingresos_salariales:1000000,
      valor_ingresos_no_salariales:20000,
      valor_deducciones:50000,
      salario_neto:100000,
      horasExtras:[
        {tipo:'Diurno',value:2}
      ],
      novedades:[
        {concepto:'Suspensión',dias:1}
      ]
     
    }
  ]
  ngOnInit(): void {}

  get inicioPeriodoPagoFormato() {
    return moment(this.nomina.inicio_periodo).format('DD/MM/YYYY');
  }

  cargarDatosFuncionarios(fechaInicio, fechaFin) {
    this._payroll.getPayRoll().subscribe((r: any) => {
      this.nomina = r.data;
    });
  }

  deletePagoNomina() {}

  showInterfaceForGlobo(modal) {}
  mostrarExtrasRecargos(fun) {}
  mostrarNovedades(fun) {}
  mostrarIngresosP(fun) {}
  mostrarIngresosNP(fun) {}
  mostrarDeducciones(fun) {}
  getColilla(fun) {}
}
