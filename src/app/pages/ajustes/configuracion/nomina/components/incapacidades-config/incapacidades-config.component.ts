import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-incapacidades-config',
  templateUrl: './incapacidades-config.component.html',
  styleUrls: ['./incapacidades-config.component.scss']
})
export class IncapacidadesConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  actualizar(event){

  }
}
