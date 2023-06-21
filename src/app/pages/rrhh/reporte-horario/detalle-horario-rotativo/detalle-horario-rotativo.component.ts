import { Component, Input, OnInit } from '@angular/core';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { consts } from 'src/app/core/utils/consts';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ReporteHorarioService } from '../reporte-horario.service';

@Component({
  selector: 'app-detalle-horario-rotativo',
  templateUrl: './detalle-horario-rotativo.component.html',
  styleUrls: ['./detalle-horario-rotativo.component.scss']
})
export class DetalleHorarioRotativoComponent implements OnInit {
  @Input('horarios') horarios: any
  @Input('horas') horas: any;
  @Input('permissions') permissions: Permissions;
  mask = consts;
  constructor(
    private _swal: SwalService,
    private _reporteHorarios: ReporteHorarioService
  ) { }

  ngOnInit(): void {
  }

  convertHours(decimal) {
    let horas = Math.floor(decimal);
    let minutos = Math.round((decimal - horas) * 60);
    return `${(horas)}h ${(minutos)}m`;
  }

  update(item) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: 'Vamos a modificar las horas trabajadas',
    }).then(r => {
      if (r.isConfirmed) {
        this._reporteHorarios.updateHoursWorked(item).subscribe((data: any) => {
          if (data.status) {
            this._swal.show({
              icon: 'success',
              title: 'Operación exitosa',
              showCancel: false,
              text: 'Categoria guardada',
              timer: 1000
            })
            item.edit = false;
          } else {
            this._swal.hardError();
          }
        })
      }
    })
  }

}
