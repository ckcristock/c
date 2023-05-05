import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-horario-rotativo',
  templateUrl: './detalle-horario-rotativo.component.html',
  styleUrls: ['./detalle-horario-rotativo.component.scss']
})
export class DetalleHorarioRotativoComponent implements OnInit {
  @Input('horarios') horarios: any
  @Input('horas') horas: any

  constructor() { }

  ngOnInit(): void {
  }

  convertHours(decimal) {
    let horas = Math.floor(decimal);
    let minutos = Math.round((decimal - horas) * 60);
    return `${horas}h ${minutos}m`;
  }

}
