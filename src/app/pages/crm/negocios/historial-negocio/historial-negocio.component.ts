import { Component, Input, OnInit } from '@angular/core';
import { NegociosService } from '../negocios.service';

@Component({
  selector: 'app-historial-negocio',
  templateUrl: './historial-negocio.component.html',
  styleUrls: ['./historial-negocio.component.scss'],
})
export class HistorialNegocioComponent implements OnInit {
  //historial: any[];
  @Input('historial') historial: any[];
  @Input('id') id: any[];
  loading: boolean;
  constructor(private _negocio: NegociosService) { }

  ngOnInit(): void {
    this.getHistorial(this.id);
  }

  getHistorial(id) {
    this.loading = true
    this._negocio.getHistory(id).subscribe((res: any) => {
      let history = res.data.history;
      let timeline = res.data.timeline;
      let historyAndTimeline = [];
      history.forEach(function (h) {
        let newObject = {
          icon: h.icon,
          title: h.title,
          description: h.description,
          created_at: h.created_at,
          person: {
            image: h.person.image
          }
        };
        historyAndTimeline.push(newObject);
      });
      timeline.forEach(function (t) {
        let newObject = {
          icon: t.icon,
          title: t.title,
          description: t.description,
          created_at: t.created_at,
          person: {
            image: t.person.image
          }
        };
        historyAndTimeline.push(newObject);
      });
      historyAndTimeline.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at)).reverse();
      console.log(historyAndTimeline)
      this.historial = historyAndTimeline;
      this.loading = false
    });
  }

  addItemToHistory(action: string) {

    this._negocio.addEventToHistroy(action);
  }
}
