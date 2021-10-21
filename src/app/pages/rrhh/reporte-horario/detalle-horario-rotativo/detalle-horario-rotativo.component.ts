import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-horario-rotativo',
  templateUrl: './detalle-horario-rotativo.component.html',
  styleUrls: ['./detalle-horario-rotativo.component.scss']
})
export class DetalleHorarioRotativoComponent implements OnInit {
  @Input('horarios') horarios:any
  @Input('horas') horas:any

  constructor() { }

  ngOnInit(): void {
  }

}
