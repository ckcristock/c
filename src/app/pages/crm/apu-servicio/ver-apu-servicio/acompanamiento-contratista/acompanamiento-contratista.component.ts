import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-acompanamiento-contratista',
  templateUrl: './acompanamiento-contratista.component.html',
  styleUrls: ['./acompanamiento-contratista.component.scss']
})
export class AcompanamientoContratistaComponent implements OnInit {
  @Input('data') accompaniments_c;
  @Input('subtotal_travel_expense_apm_c') subtotal_travel_expense_apm_c;
  @Input('subtotal_accompaniment_c') subtotal_accompaniment_c;
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
