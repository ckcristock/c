import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-colilla-deducciones',
  templateUrl: './colilla-deducciones.component.html',
  styleUrls: ['./colilla-deducciones.component.scss']
})
export class ColillaDeduccionesComponent implements OnInit {

  @Input('deduccionesDatos') deduccionesDatos
  @Input('datosEmpresa') datosEmpresa
  @Input('brand') brand

  deducciones: any[] = []

  constructor() { }

  ngOnInit(): void {
    this.organizarDeducciones();

  }
  organizarDeducciones() {
    if (this.deduccionesDatos.deducciones !== null) {
      
      for (let prop in this.deduccionesDatos.deducciones) {
        this.deducciones.push({ 
          concepto: prop,
          valor: this.deduccionesDatos.deducciones[prop]
        });
      }
    }
  }
}
