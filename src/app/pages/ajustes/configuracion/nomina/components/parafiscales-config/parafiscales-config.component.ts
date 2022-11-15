import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-parafiscales-config',
  templateUrl: './parafiscales-config.component.html',
  styleUrls: ['./parafiscales-config.component.scss']
})
export class ParafiscalesConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();
  form: FormGroup

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
    this._nominaService.updateParafiscales(event.id, params)
    .subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Egresos',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

}
