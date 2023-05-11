import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-acompanamiento',
  templateUrl: './acompanamiento.component.html',
  styleUrls: ['./acompanamiento.component.scss']
})
export class AcompanamientoComponent implements OnInit {
  @Input('data') accompaniments: any;
  @Input('subtotal_labor_apm') subtotal_labor_apm: any;
  @Input('subtotal_travel_expense_apm') subtotal_travel_expense_apm: any;
  @Input('subtotal_accompaniment') subtotal_accompaniment: any;

  desplazamientos = [
    { text: 'Aero', value: 1 },
    { text: 'Terrestre', value: 2 },
    { text: 'N/A', value: 3 }
  ]
  constructor() { }

  ngOnInit(): void {
  }

  getDesplazamiento(value) {
    return this.desplazamientos?.find(x => x?.value == value)?.text
  }

}
