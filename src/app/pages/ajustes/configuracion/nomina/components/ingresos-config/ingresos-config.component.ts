import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-ingresos-config',
  templateUrl: './ingresos-config.component.html',
  styleUrls: ['./ingresos-config.component.scss']
})
export class IngresosConfigComponent implements OnInit {

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
    this._nominaService.updateCreateIngresos(params).subscribe((res: any) => {
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
