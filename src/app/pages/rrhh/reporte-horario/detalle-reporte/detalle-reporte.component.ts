import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output('update') update = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }
  showDetail() { }

  updateList() {
    this.update.emit();
  }
}
