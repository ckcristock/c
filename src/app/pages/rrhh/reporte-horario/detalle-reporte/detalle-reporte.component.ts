import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-reporte',
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.scss'],
})
export class DetalleReporteComponent implements OnInit {
 @Input('type') type :any[]
 @Input('reporteHorarios') reporteHorarios :any[]
  constructor() {}

  ngOnInit(): void {
  }
  showDetail() {}
}
