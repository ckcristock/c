import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-montaje-equipos-contratista',
  templateUrl: './montaje-equipos-contratista.component.html',
  styleUrls: ['./montaje-equipos-contratista.component.scss']
})
export class MontajeEquiposContratistaComponent implements OnInit {
  @Input('data') assemblies_start_up_c;
  @Input('subtotal_travel_expense_me_c') subtotal_travel_expense_me_c;
  @Input('subtotal_assembly_c') subtotal_assembly_c;
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
