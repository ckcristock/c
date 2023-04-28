
import { Component, OnInit, Input } from '@angular/core';

import { BoardContabilidadService } from '../board-contabilidad.service';
@Component({
  selector: 'app-cardreportes',
  templateUrl: './cardreportes.component.html',
  styleUrls: ['./cardreportes.component.scss']
})
export class CardreportesComponent implements OnInit {
  @Input() Reportes;
  private params: any = '';
  private subcripcion: any;
  constructor(private contabiliad: BoardContabilidadService) { }

  ngOnInit() {
    this.subcripcion = this.contabiliad.event.subscribe((data: any) => {
      this.params = data;
      if (data == '') {
        this.contabiliad.ShowMessage([
          "warning", "Upss ! ", "Faltan datos para poder generar el reporte"
        ]);

      }
    });
  }
  DescargasReporte(pos) {
    if (this.Reportes[pos].Ruta != '') {
      if (this.params != '') {
        window.open(this.Reportes[pos].Ruta + '?' + this.params + '&tipo=' + this.Reportes[pos].Tipo, '_blank');
      } else {
        this.contabiliad.ShowMessage([
          "warning", "Upss ! ", "Faltan datos para poder generar el reporte"
        ]);
      }
    } else {
      this.contabiliad.ShowMessage([
        "warning", "En Desarrollo! ", "Este reporte está actualmente en desarrollo!"
      ]);
    }
  }

}
