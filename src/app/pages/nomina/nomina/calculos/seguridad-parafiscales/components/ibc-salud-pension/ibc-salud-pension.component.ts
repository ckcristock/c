import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ibc-salud-pension',
  templateUrl: './ibc-salud-pension.component.html',
  styleUrls: ['./ibc-salud-pension.component.scss']
})
export class IbcSaludPensionComponent implements OnInit {
  @Input('retencionesDatos') retencionesDatos
  retenciones: any = {}
  ibc:any [] = []
  
  constructor() { }
  ngOnInit(): void {
    this.retenciones = this.retencionesDatos
    this.organizarIbc()
  }
  organizarIbc() {
    for (let prop in this.retenciones.retenciones) {
      if (this.retenciones.retenciones[prop] > 0) {
        this.ibc.push({
          concepto: prop,
          valor: this.retenciones.retenciones[prop],
        })
      }
    }
  }
}
