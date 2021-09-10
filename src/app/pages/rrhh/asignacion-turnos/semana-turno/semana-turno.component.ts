import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AsignacionTurnosService } from '../asignacion-turnos.service';

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

  diaInicialSemana: any;
  diasSemana: any[] = [];
  horariosExistentes: any[] = [];
  turnos: any[] = [];
  constructor(private _asignacion: AsignacionTurnosService) {}

  ngOnInit(): void {
    this.changeWeek.subscribe(d=>{
      console.log('emiting',);
      setTimeout(() => {
        this.diasSemana = [];
        this.diaInicialSemana = this.diaInicial;
        this.turnos = this.turnosRotativos;
        this.fillDiasSemana();
        this.asignarHorariosExistentes();

        
      }, 200);
    })
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

  makeHorario() {
    let index = null;
    let horarios = [];
    this.people.forEach((funcionario) => {
      this.diasSemana.forEach((dia) => {
        console.log(dia);
        index = this.diasSemana.indexOf(dia);
        if (
          funcionario.dias &&
          funcionario.dias[index] &&
          funcionario.dias[index] !== 'seleccione'
        ) {
          horarios.push({
            person_id: funcionario.id,
            rotating_turn_id: funcionario.dias[index],
            date: dia.fecha,
            weeks_number: moment().format('ww'),
          });
        }
      });
    });
    console.log(horarios);

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
        console.log(this.horariosExistentes,'te');
        
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
