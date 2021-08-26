import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.scss'],
})
export class TurnoComponent implements OnInit {
  @Input('turnos') turnos: Array<any>;
  turno = 'seleccione';
  active = false;
  withColor = '#9da4ad';
  constructor() {}

  ngOnInit(): void {}

  changeColor() {
    if (this.turno === 'seleccione') {
      this.withColor = '#9da4ad';
      return;
    }
    if (this.turno === '0') {
      this.withColor = '#000';
      return;
    }

    this.withColor = this.turnos.find((turno) => {
      return turno.id === this.turno;
    }).color;
  }
}
