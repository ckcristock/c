import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-egresos-config',
  templateUrl: './egresos-config.component.html',
  styleUrls: ['./egresos-config.component.scss']
})
export class EgresosConfigComponent implements OnInit {

  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService,
    private _modal: ModalService
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
        title: 'Ingresos',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

  setAccount(datos) {
    let params = {
      id: datos.datos.id,
      accounting_account: datos.identifier
    }
    this._nominaService.updateCreateEgresos(params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Ingresos',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

}
