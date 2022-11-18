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

  actualizar(event, variable, id) {
    let params = {
      id: id,
      [variable]: event
    }
    this._nominaService.updateSSocialCompany(id, params)
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
