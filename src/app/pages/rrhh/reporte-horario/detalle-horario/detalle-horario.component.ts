import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-horario',
  templateUrl: './detalle-horario.component.html',
  styleUrls: ['./detalle-horario.component.scss']
})
export class DetalleHorarioComponent implements OnInit {
  @Input('horarios') horarios:any
  constructor() { }

  ngOnInit(): void {
  }

}
