import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-incapacidades-config',
  templateUrl: './incapacidades-config.component.html',
  styleUrls: ['./incapacidades-config.component.scss']
})
export class IncapacidadesConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();
  form: FormGroup;

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
    this._nominaService.updateIncapacidades(event.id, params).subscribe((res: any) => {
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
