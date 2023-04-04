import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-validacion-dimensional-contratista',
  templateUrl: './validacion-dimensional-contratista.component.html',
  styleUrls: ['./validacion-dimensional-contratista.component.scss']
})
export class ValidacionDimensionalContratistaComponent implements OnInit {
  @Input('data') dimensional_validation_c;
  @Input('subtotal_travel_expense_vd_c') subtotal_travel_expense_vd_c;
  @Input('subtotal_dimensional_validation_c') subtotal_dimensional_validation_c;
  desplazamientos = [
    { text: 'Aero', value: 1 },
    { text: 'Terrestre', value: 2 },
    { text: 'N/A', value: 3 }
  ]
  constructor() { }

  ngOnInit(): void {
  }

  getDesplazamiento(value) {
    return this.desplazamientos.find(x => x.value == value).text
  }

}
