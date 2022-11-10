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

  actualizar(event, percentage) {
    let params = {
      percentage: percentage
    }
    this._nominaService.updateRiesgosArl(event.id, params)
    .subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Seguridad Social Funcionario',
        showCancel: false,
        text: res.data,
        timer: 1000
      })
    })
  }


  setAccount=(datos)=>{
    let data = {
      id: datos.datos.id,
      account_plan_id: datos.identifier
    }
    this._nominaService.updateRiesgosArl(datos.datos.id, data)
      .subscribe((res:any)=>{
        this._swal.show({
          title: 'Seguridad Social Funcionario',
          icon: 'success',
          text: res.data,
          showCancel: false,
          timer: 1000
        })
      })
  }

  setContrapartida(datos) {
    let params = {
      id: datos.datos.id,
      account_setoff: datos.identifier
    }
    console.log(params);
    this._nominaService.updateRiesgosArl(datos.datos.id, params)
    .subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Seguridad Social Funcionario',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

}
