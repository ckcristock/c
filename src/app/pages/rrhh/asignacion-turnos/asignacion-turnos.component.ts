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
      name: 'First',
      dependencies: [
        {
          name: 'first',
          people: [{ first_name: 'sdsd', second_name: 'sdsd' }],
        },
      ],
    },
  ];
  turns: any[];
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
