import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ExtraHoursService } from './extra-hours.service';

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.scss'],
})
export class HorasExtrasComponent implements OnInit {
  primerDiaSemana = moment().startOf('week').format('YYYY-MM-DD');
  ultimoDiaSemana = moment().endOf('week').format('YYYY-MM-DD');
  semana = moment().format(moment.HTML5_FMT.WEEK);
  horasExtras: any[] = [];
  diasSemanaActual: any[] = [];
  turnType = 'rotativo';
  loading = false;
  constructor(private _extraHours: ExtraHoursService) {}

  ngOnInit(): void {
    this.getPeople();
  }

  get primerDiaSemanaFormato() {
    return moment(this.primerDiaSemana, 'YYYY-MM-DD').format('DD/MM/YYYY');
  }
  get ultimoDiaSemanaFormato() {
    return moment(this.ultimoDiaSemana, 'YYYY-MM-DD').format('DD/MM/YYYY');
  }
  changeTipoTurno(turn) {
  }

  cambiarSemana() {
    let año = this.semana.split('-')[0];
    let sem = this.semana.split('-')[1];

    sem = sem.split('W')[1];
    let diasSemana: any = [];

    for (let i = 0; i < 7; i++) {
      diasSemana.push(
        moment()
          .year(+año)
          .day(i)
          .week(Number(sem) + 1)
          .format('YYYY-MM-DD')
      );
    }

    diasSemana.sort((a, b) => {
      return new Date(a).getTime() - <any>new Date(b);
    });

    this.diasSemanaActual = diasSemana;
    this.primerDiaSemana = moment(this.diasSemanaActual[6]).format(
      'YYYY-MM-DD'
    );
    this.ultimoDiaSemana = moment(
      this.diasSemanaActual[this.diasSemanaActual[0]]
    ).format('YYYY-MM-DD');

    /*   this.renderizarContenido = false; */

    this.ultimoDiaSemana = this.diasSemanaActual[6];
    this.primerDiaSemana = this.diasSemanaActual[0];

    this.getPeople();
  }

  getPeople() {
    this.loading = true;
    this._extraHours
      .getPeople(this.primerDiaSemana, this.ultimoDiaSemana, this.turnType)
      .subscribe((r: any) => {
        this.loading = false;
        this.horasExtras = r.data;
      });
  }
}
