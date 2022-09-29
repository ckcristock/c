import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  form: FormGroup;
  constructor(
    private _nominaService: NominaConfigService,
    private fb: FormBuilder,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
  }

  /* createForm() {
    this.form = this.fb.group({
      percentage: ['']
    })
  } */

  actualizar(event, percentage) {
    let params = {
      percentage: percentage
    }
    this._nominaService.updateExtras(event.id, params).subscribe((res: any) => {
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
