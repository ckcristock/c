import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  page: any = '';
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  loading: boolean = false;
  filtros: any  = {
    nombre:'',
    categoria:'',
    vida_util:'',
    depreciacion:''
  };
  pageSize: any = 10;
  cuentas: any;
  buscandoCuenta: boolean = false;
  busquedaCuentaFallida: boolean = false;

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
  }

  actualizar(event, variable, id) {
    let params = {
      id: id,
      [variable]: event
    }
    this._nominaService.updateIncapacidades(params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Incapacidades',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }


}
