import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-horas-extras-config',
  templateUrl: './horas-extras-config.component.html',
  styleUrls: ['./horas-extras-config.component.scss']
})
export class HorasExtrasConfigComponent implements OnInit {

  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
  }

  actualizar(event, percentage) {
    let params = {
      percentage: percentage
    }
    this._nominaService.updateExtras(event.id, params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Horas Extras',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

  setAccount(datos) {
    let params = {
      id: datos.datos.id,
      account_plan_id: datos.identifier
    }
    this._nominaService.updateExtras(datos.datos.id, params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Horas Extras',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

}
