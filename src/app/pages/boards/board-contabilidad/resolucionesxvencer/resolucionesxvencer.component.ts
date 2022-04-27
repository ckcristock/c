import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BoardContabilidadService } from '../board-contabilidad.service';

@Component({
  selector: 'app-resolucionesxvencer',
  templateUrl: './resolucionesxvencer.component.html',
  styleUrls: ['./resolucionesxvencer.component.scss']
})
export class ResolucionesxvencerComponent implements OnInit {
  @Output() resolucionesXVencer:EventEmitter<any> = new EventEmitter();
  public Resoluciones = [];
  constructor(private contabilidadService: BoardContabilidadService) { }

  ngOnInit() {
    this.contabilidadService.getResolucionesPorVencer().subscribe((data:any) => {
      this.Resoluciones = data;
      this.resolucionesXVencer.emit(data);
    })
  }

}
