import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-liquidacion-config',
  templateUrl: './liquidacion-config.component.html',
  styleUrls: ['./liquidacion-config.component.scss']
})
export class LiquidacionConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
  }

  actualizar(event, variable, id) {
    let params = {
      id: id,
      [variable]: event
    }
    this._nominaService.updateCreateLiquidaciones(params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Liquidación',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

}
