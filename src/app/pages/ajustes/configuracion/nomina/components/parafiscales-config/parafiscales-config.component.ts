import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-parafiscales-config',
  templateUrl: './parafiscales-config.component.html',
  styleUrls: ['./parafiscales-config.component.scss']
})
export class ParafiscalesConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}
