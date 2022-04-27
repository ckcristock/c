import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-s-social-empresa-config',
  templateUrl: './s-social-empresa-config.component.html',
  styleUrls: ['./s-social-empresa-config.component.scss']
})
export class SSocialEmpresaConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  actualizar(event){

  }
}
