import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dias-vacaciones',
  templateUrl: './dias-vacaciones.component.html',
  styleUrls: ['./dias-vacaciones.component.scss']
})
export class DiasVacacionesComponent implements OnInit {
  @Input('diasVacaciones') diasVacaciones
  constructor() { }

  ngOnInit(): void {
  }

}
