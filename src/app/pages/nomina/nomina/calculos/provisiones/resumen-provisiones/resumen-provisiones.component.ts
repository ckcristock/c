import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resumen-provisiones',
  templateUrl: './resumen-provisiones.component.html',
  styleUrls: ['./resumen-provisiones.component.scss']
})
export class ResumenProvisionesComponent implements OnInit {
  @Input('provisionesDatos') provisionesDatos

  datosResumen: any[] = []

  constructor() { }

  ngOnInit(): void {
    this.organizarResumen()

  }

  organizarResumen() {
    for (let objeto in this.provisionesDatos.resumen) {
      this.datosResumen.push(this.provisionesDatos.resumen[objeto])
    }
  }
  
  fijarPorcentaje(valor, digitos) {
    return Number(valor).toFixed(digitos)
  }

}
