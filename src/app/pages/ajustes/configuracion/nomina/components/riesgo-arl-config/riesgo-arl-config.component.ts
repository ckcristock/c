import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-riesgo-arl-config',
  templateUrl: './riesgo-arl-config.component.html',
  styleUrls: ['./riesgo-arl-config.component.scss']
})
export class RiesgoArlConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();
  form: FormGroup

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
  }

  actualizar(event, variable, id) {
    let params = {
      id: id,
      [variable]: event
    }
    this._nominaService.updateRiesgosArl(event.id, params)
    .subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Riesgo ARL',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

}
