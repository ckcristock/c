import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.scss']
})
export class IngresosComponent implements OnInit {

  @Input('ingresosDatos') ingresosDatos
  ingresos :any = ''
  constitutivos:any[] = []
  noConstitutivos:any[] =[]

  constructor() { }

  ngOnInit(): void {
    this.ingresos = this.ingresosDatos
    this.ordenarIngresos() 
  }

  ordenarIngresos() {
    for (let propiedad in this.ingresos.constitutivos) {
      this.constitutivos.push({
        concepto: propiedad,
        valor: this.ingresos.constitutivos[propiedad],
      })
    }
    for (let propiedad in this.ingresos.no_constitutivos) {
      this.noConstitutivos.push({
        concepto: propiedad,
        valor: this.ingresos.no_constitutivos[propiedad],
      })
    }
  }
  
}
