import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AsignacionTurnosService } from '../asignacion-turnos.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';

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
  @Input('changeWeek') changeWeek: EventEmitter<any>;
  masiveTurnId: any = {};
  diaInicialSemana: any;
  diasSemana: any[] = [];
  horariosExistentes: any[] = [];
  turnos: any[] = [];

  constructor(
    private _asignacion: AsignacionTurnosService,
    private _swal: SwalService
  ) {}

  ngOnInit(): void {
    this.changeWeek.subscribe((d: any) => {
      this.diasSemana = [];
      this.diaFinal = d.diaFinalSemana;
      this.diaInicial = d.diaInicialSemana;
      this.diaInicialSemana = this.diaInicial;
      this.turnos = this.turnosRotativos;
      this.fillDiasSemana();
    });
  }
  turnAllChanged(turnId) {
    let turn = this.turnos.find((r) => r.id == turnId);
    if (turn) {
      this.masiveTurnId = turn;
      
    }else{
      this.masiveTurnId = {};

    }
    
    this.masiveTurnId.rotating_turn_id = turnId;
    this.masiveTurnId = this.getColors(this.masiveTurnId);
  }
  asignarHorariosMasivo() {
    
    if (this.masiveTurnId.rotating_turn_id != 'seleccione') {
      this.people.forEach((r) => {
        if (r.selected) {
          r.diasSemana.forEach((dia) => {
            if(dia.dia == 'domingo'){
              let turnId = this.masiveTurnId?.sunday?.id  ? this.masiveTurnId?.sunday?.id : 0;
              dia.turno = turnId;
              dia.color = turnId ? this.masiveTurnId.sunday.color : 'black' ;
              return;
            } 
            if(dia.dia == 'sábado'){
              let turnId = this.masiveTurnId?.saturday?.id  ? this.masiveTurnId?.saturday?.id : 0;
              dia.turno = turnId;
              dia.color = turnId ? this.masiveTurnId.saturday.color : 'black' ;
              return;

            }
            else{
              dia.turno = this.masiveTurnId.rotating_turn_id;
              dia.color = this.masiveTurnId.color;
            }
          });
        }
      });
    }
  }
  fillDiasSemana() {
    this.diaInicialSemana.locale('es');
    while (this.diaInicialSemana < this.diaFinal) {
      let dia = this.diaInicialSemana.format('dddd');

      let pur = {
        dia,
        fecha: this.diaInicialSemana.format('YYYY-MM-DD'),
        color: dia == 'domingo' ? 'black' : '#9da4ad',
        turno: dia == 'domingo' ? 0 : 'seleccione', 
      };

      this.diasSemana.push(pur);
      this.diaInicialSemana = moment(this.diaInicialSemana).add(1, 'd');
    }

    this.people.forEach((p, i) => {
      let sem = [...this.diasSemana];
      p.diasSemana = [];
      p.diasSemana = sem.map((acc) => {
        return Object.assign({}, acc);
      });

      p.fixed_turn_hours.forEach((turn) => {
        turn = this.getColors(turn, true);
        p.diasSemana.forEach((dia, i) => {          
          if (turn.date == dia.fecha) {
            dia.turno = turn.rotating_turn_id;
            dia.color = turn.color;
          }
        });
      });
    });
  }

  getColors(turn: any, findColor = false) {

    if (turn.rotating_turn_id && turn.rotating_turn_id == 0) {
      turn.color = 'black';
      return turn;
    }

    if (turn.rotating_turn_id === 'seleccione') {
      turn.color = '#9da4ad';

      return turn;
    }
    if (!turn.rotating_turn_id) {
      turn.color = '#000';
    } else if (findColor){
      turn.color = this.turnos.find(
        (turno) => turno.id == turn.rotating_turn_id
      ).color;
    }
    return turn;
  }

  getColorByDay(dia) {
    if (dia.turno == 0) {
      dia.color = '#000';
    } else {
      dia.color = this.turnos.find((turno) => turno.id == dia.turno).color;
    }
  }

  formatFecha(fecha) {
    return moment(fecha).format('DD/MM/YYYY');
  }

  makeHorario() {
    this._swal
      .show({
        title: '¿Está seguro?',
        text: 'Se dispone a asignar horarios',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          let horarios = [];
          this.people.forEach((funcionario) => {
            funcionario.diasSemana.forEach((dia) => {
              if (
                dia.turno != null &&
                dia.turno != undefined &&
                dia.turno != 'seleccione'
              ) {
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
    this._asignacion.saveHours(horarios).subscribe(
      (r: any) => {
        this._swal.show({
          icon: 'success',
          text: 'Guardado con éxito',
          title: 'Operación realizada',
          showCancel: false,
        });
      },
      (err) => {
        this._swal.show({
          icon: 'erro',
          text: 'Ha ocurrido un error',
          title: 'Operación erronea',
          showCancel: false,
        });
      }
    );
  }
}
