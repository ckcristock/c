import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-horas-extras-config',
  templateUrl: './horas-extras-config.component.html',
  styleUrls: ['./horas-extras-config.component.scss']
})
export class HorasExtrasConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  actualizar(event){

  }
}
