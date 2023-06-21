import { Component, Input, OnInit } from '@angular/core';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { ReporteHorarioService } from '../reporte-horario.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { consts } from 'src/app/core/utils/consts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-horario',
  templateUrl: './detalle-horario.component.html',
  styleUrls: ['./detalle-horario.component.scss']
})
export class DetalleHorarioComponent implements OnInit {
  @Input('horas') horas: any
  @Input('horarios') horarios: any
  @Input('type_report') type_report: any;
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
    return `${horas}h ${minutos}m`;
  }

  update(item) {
    Swal.fire({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      html: `
      <textarea id="justification-input" class="swal2-textarea" required placeholder="Escribe la justificación..."></textarea>
    `,
      showCancelButton: true,
      confirmButtonColor: '#A3BD30',
      confirmButtonText: '¡Sí, confirmar!',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: () => {
        const justification = (document.getElementById('justification-input') as HTMLInputElement).value;

        if (!justification) {
          Swal.showValidationMessage('La justificación es requerida');
          return false;
        }
        item.justification = justification;
        return this._reporteHorarios.updateHoursWorked(item).toPromise();
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
      .then((result) => {
        if (result.isConfirmed) {
          item.edit = false;
          this._swal.show({
            icon: 'success',
            title: 'Operación exitosa',
            showCancel: false,
            text: 'Horas totales editadas',
            timer: 1000
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message
        });
      });
  }

}
