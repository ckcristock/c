import { Component, Input, OnInit } from '@angular/core';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';

@Component({
  selector: 'app-detalle-reporte',
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.scss'],
})
export class DetalleReporteComponent implements OnInit {
  @Input('type') type: any[]
  @Input('reporteHorarios') reporteHorarios: any[];
  @Input('permissions') permissions: Permissions;
  constructor() { }

  ngOnInit(): void {
  }
  showDetail() { }
}
