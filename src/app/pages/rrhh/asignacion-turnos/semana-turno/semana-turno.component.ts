import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-semana-turno',
  templateUrl: './semana-turno.component.html',
  styleUrls: ['./semana-turno.component.scss'],
})
export class SemanaTurnoComponent implements OnInit {
  @Input('turnosRotativos') turnosRotativos;
  @Input('diaInicial') diaInicial;
  @Input('diaFinal') diaFinal;
  @Input('people') people;

  diaInicialSemana: any;
  diasSemana: any[] = [];
  constructor() {}

  ngOnInit(): void {
    this.diaInicialSemana = this.diaInicial;
    this.fillDiasSemana();
  }
  asignarHorariosMasivo() {}
  fillDiasSemana() {
    while (this.diaInicialSemana < this.diaFinal) {
      this.diasSemana.push({
        dia: this.diaInicialSemana.format('dddd'),
        fecha: this.diaInicialSemana.format('YYYY-MM-DD'),
      });
      this.diaInicialSemana = moment(this.diaInicialSemana).add(1, 'd');
    }
  }
  formatFecha(fecha) {
    return moment(fecha).format('DD/MM/YYYY');
  }
}
