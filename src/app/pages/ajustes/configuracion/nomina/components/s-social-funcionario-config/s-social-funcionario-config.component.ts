import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-s-social-funcionario-config',
  templateUrl: './s-social-funcionario-config.component.html',
  styleUrls: ['./s-social-funcionario-config.component.scss']
})
export class SSocialFuncionarioConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  actualizar(event){

  }
}
