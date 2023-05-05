import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-horario',
  templateUrl: './detalle-horario.component.html',
  styleUrls: ['./detalle-horario.component.scss']
})
export class DetalleHorarioComponent implements OnInit {
  @Input('horas') horas: any
  @Input('horarios') horarios: any
  @Input('type_report') type_report: any
  constructor() { }

  ngOnInit(): void {
  }

  convertHours(decimal) {
    let horas = Math.floor(decimal);
    let minutos = Math.round((decimal - horas) * 60);
    return `${horas}h ${minutos}m`;
  }

}
