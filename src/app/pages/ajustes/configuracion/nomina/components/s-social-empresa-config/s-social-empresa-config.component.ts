import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-s-social-empresa-config',
  templateUrl: './s-social-empresa-config.component.html',
  styleUrls: ['./s-social-empresa-config.component.scss']
})
export class SSocialEmpresaConfigComponent implements OnInit {
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();
  form: FormGroup;

  constructor(
    private _nominaService: NominaConfigService,
    private fb: FormBuilder,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
  }

  actualizar(event, percentage){
    let params = {
      percentage: percentage
    }
    this._nominaService.updateSSocialCompany(event.id, params)
    .subscribe((res:any)=>{
      this._swal.show({
        icon: 'success',
        title: 'Seguridad Social Empresa',
        showCancel: false,
        text: res.data,
        timer: 1000
      })
    })
  }

  setAccount=(datos)=>{
    let data = {
      id: datos.datos.id,
      accounting_account: datos.identifier
    }
    this._nominaService.updateSSocialCompany(datos.datos.id, data)
      .subscribe((res:any)=>{
        this._swal.show({
          title: 'Seguridad Social Empresa',
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
    this._nominaService.updateSSocialCompany(datos.datos.id, params)
    .subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Seguridad Social Empresa',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

}
