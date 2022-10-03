import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-riesgo-arl-config',
  templateUrl: './riesgo-arl-config.component.html',
  styleUrls: ['./riesgo-arl-config.component.scss']
})
export class RiesgoArlConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  actualizar(event){

  }

}
