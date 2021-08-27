import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-asignacion-turnos',
  templateUrl: './asignacion-turnos.component.html',
  styleUrls: ['./asignacion-turnos.component.scss'],
})
export class AsignacionTurnosComponent implements OnInit {
  datosGenerales: any = [
    {
      name: 'Admistrativo',
      dependencies: [
        {
          name: 'Desarrollo',
          people: [{ first_name: 'Carlos', second_name: 'Cardoba' }],
        },
      ],
    },
  ];
  turns: any[] = [
    {
      id: 1,
      nombre: 'Prueba 01',
      extras: 1,
      tolerancia_entrada: 0,
      tolerancia_salida: 0,
      hora_inicio_uno: '13:49',
      hora_fin_uno: '19:49',
      hora_inicio_dos: null,
      hora_fin_dos: null,
      jornada_turno: 'Diurno',
      color: '#D98880',
    },
  ];
  groupList: any[];
  dependencyList: any[];
  diaInicialSemana = moment().startOf('week');
  diaFinalSemana = moment().endOf('week');
  constructor() {}

  ngOnInit(): void {
    console.log(this.diaInicialSemana);
  }

  grupChange() {}

  filtrar() {}
  makeRequestBySemana(week) {}

  descargarInformeTurnos(turno) {}
}
