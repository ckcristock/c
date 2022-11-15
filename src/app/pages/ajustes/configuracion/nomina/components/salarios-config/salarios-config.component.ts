import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-salarios-config',
  templateUrl: './salarios-config.component.html',
  styleUrls: ['./salarios-config.component.scss']
})
export class SalariosConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
  }


  actualizar(event, variable, id) {
    let params = {
      id: id,
      [variable]: event
    }
    this._nominaService.updateCreateSalariosSubsidios(params)
    .subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Salarios y subsidios',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

}
