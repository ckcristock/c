import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AsignacionTurnosService } from '../../asignacion-turnos/asignacion-turnos.service';

@Component({
  selector: 'app-semanas-extras',
  templateUrl: './semanas-extras.component.html',
  styleUrls: ['./semanas-extras.component.scss']
})
export class SemanasExtrasComponent implements OnInit {
  @Input('turnosRotativos') turnosRotativos;
  @Input('diaInicial') diaInicial;
  @Input('diaFinal') diaFinal;
  @Input('people') people;
  @Input('changeWeek') changeWeek: EventEmitter<any>;

  diaInicialSemana: any;
  diasSemana: any[] = [];
  horariosExistentes: any[] = [];
  turnos: any[] = [];

  /**
   * test
   */
  turno = 'seleccione';
  active = false;
  withColor = '#9da4ad';
  /**End */
  constructor(private _asignacion: AsignacionTurnosService) {}

  ngOnInit(): void {
    this.changeWeek.subscribe((d) => {
      setTimeout(() => {
        this.diasSemana = [];
        this.diaInicialSemana = this.diaInicial;
        this.turnos = this.turnosRotativos;
        this.fillDiasSemana();
        this.asignarHorariosExistentes();
      }, 200);
    });
  }

  asignarHorariosMasivo() {}
  fillDiasSemana() {
    while (this.diaInicialSemana < this.diaFinal) {
      this.diasSemana.push({
        dia: this.diaInicialSemana.format('dddd'),
        fecha: this.diaInicialSemana.format('YYYY-MM-DD'),
        color: '#9da4ad',
        turno: 'seleccione',
      });
      this.diaInicialSemana = moment(this.diaInicialSemana).add(1, 'd');
    }

    this.people.forEach((p) => {
      let sem = this.diasSemana;

      p.fixed_turn_hours.forEach((turn) => {
        turn = this.getColors(turn);
        sem.map((dia) => {
          if (turn.date == dia.fecha) {
            dia.turno = turn.rotating_turn_id;
            dia.color = turn.color;
          }
        });
      });
      p.diasSemana = sem;
    });

  }

  getColors(turn: any) {
    if (turn.rotating_turn_id == 0) {
      turn.color = '#000';
    } else {
      turn.color = this.turnos.find(
        (turno) => turno.id == turn.rotating_turn_id
      ).color;
    }
    return turn;
  }

  getColorByDay( dia ) {
    if (dia.turno == 0) {
      dia.color = '#000';
    } else {
      dia.color = this.turnos.find(
        (turno) => turno.id == dia.turno
      ).color;
    }
  }

  formatFecha(fecha) {
    return moment(fecha).format('DD/MM/YYYY');
  }

  makeHorario() {

    let horarios = [];
    this.people.forEach((funcionario) => {
      funcionario.diasSemana.forEach((dia) => {
        if (dia.turno && dia.turno != 'seleccione') {
          horarios.push({
            person_id: funcionario.id,
            rotating_turn_id: dia.turno,
            date: dia.fecha,
            weeks_number: moment().format('ww'),
          });
        }
      });
    });

    if (horarios.length) {
      this.saveHours(horarios);
    }
  }
  asignarHorariosExistentes() {
    this.people.forEach((funcionario) => {
      if (funcionario.fixed_turn_hours.length) {
        this.horariosExistentes = this.diasSemana.map((dia) => {
          return funcionario.fixed_turn_hours.find((horario) => {
            return dia.fecha == horario.date;
          });
        });

        this.horariosExistentes.forEach((dia) => {
          let index = null;
          if (dia !== undefined) {
            index = this.horariosExistentes.indexOf(dia);
            /*    let id = 'turnos' + funcionario.id;
            this.$refs[id][index].turno = dia.turno_rotativo_id; */
            let turno_select = this.turnos.find((turno) => {
              if (dia.turno_rotativo_id != 0) {
                return turno.id === dia.turno_rotativo_id;
              }
            });
            let color = turno_select ? turno_select.color : '#000';
            /*  this.$refs[id][index].withColor = color; */
          }
        });
      }
    });
  }
  turnChanged(turno, person, day) {
    let index = this.diasSemana.indexOf(day);
    if (person.dias) {
    } else {
      person.dias = {};
    }
    person.dias[index] = turno;
  }

  saveHours(horarios) {
    this._asignacion.saveHours(horarios).subscribe((r: any) => {});
  }
}
