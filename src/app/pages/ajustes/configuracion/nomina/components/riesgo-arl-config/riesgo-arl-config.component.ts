import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    private fb: FormBuilder,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
  }

  actualizar(event, percentage) {
    let params = {
      percentage: percentage
    }
    this._nominaService.updateRiesgosArl(event.id, params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: res.data,
        showCancel: false,
        text: '',
        timer: 1000
      })
    })
  }

}
