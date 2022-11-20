import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-novedades-config',
  templateUrl: './novedades-config.component.html',
  styleUrls: ['./novedades-config.component.scss']
})
export class NovedadesConfigComponent implements OnInit {

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
  search = []
  fail = []

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService,
    private http: HttpClient,
    private _user: UserService
    ) { }

  ngOnInit(): void {
  }

  actualizar(event, variable, id) {
    let params = {
      id: id,
      [variable]: event
    }
    this._nominaService.updateCreateNovedades(params)
    .subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Novedades',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

  //las novedades no las agrega el usuario del sistema,
  //por tanto no hay modal para nueva

}
