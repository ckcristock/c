import { Component, OnInit } from '@angular/core';
import { NegociosService } from '../negocios.service';

@Component({
  selector: 'app-historial-negocio',
  templateUrl: './historial-negocio.component.html',
  styleUrls: ['./historial-negocio.component.scss'],
})
export class HistorialNegocioComponent implements OnInit {
  historial: any[];

  constructor(private _negocio: NegociosService) {}

  ngOnInit(): void {
    this.getHistorial();
  }

  getHistorial() {
    console.log('Prueba de ejecución')
    this._negocio.getHistory().subscribe((data: any) => {
      this.historial = data;
      console.log(this.historial)
    });
  }

  addItemToHistory(action: string) {

    this._negocio.addEventToHistroy(action);
  }
}
