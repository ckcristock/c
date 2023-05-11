import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-validacion-dimensional',
  templateUrl: './validacion-dimensional.component.html',
  styleUrls: ['./validacion-dimensional.component.scss']
})
export class ValidacionDimensionalComponent implements OnInit {
  @Input('data') dimensional_validation;
  @Input('subtotal_labor') subtotal_labor;
  @Input('subtotal_travel_expense') subtotal_travel_expense;
  @Input('subtotal_dimensional_validation') subtotal_dimensional_validation;

  desplazamientos = [
    { text: 'Aero', value: 1 },
    { text: 'Terrestre', value: 2 },
    { text: 'N/A', value: 3 }
  ]
  constructor() { }

  ngOnInit(): void {
  }

  getDesplazamiento(value) {
    return this.desplazamientos?.find(x => x.value == value)?.text
  }

}
