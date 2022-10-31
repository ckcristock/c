import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-s-social-funcionario-config',
  templateUrl: './s-social-funcionario-config.component.html',
  styleUrls: ['./s-social-funcionario-config.component.scss']
})
export class SSocialFuncionarioConfigComponent implements OnInit {
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

  actualizar(event, percentage){
    let params = {
      percentage: percentage
    }
    this._nominaService.updateSSocialPerson(event.id, params).subscribe((res: any)=>{
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
