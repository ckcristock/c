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
    console.log(this._user.user.person.company_worked.id)
  }

  formatter = (cuentas: { Nombre_Niif: string , Codigo_Niif: string }) => cuentas.Nombre_Niif;

  search_cuenta_niif = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => {
      this.buscandoCuenta = true;
      this.busquedaCuentaFallida = false;
    }),
    switchMap(term =>
      this.http.get(`${environment.ruta}php/plancuentas/filtrar_cuentas.php?`, { params: { coincidencia: term, tipo: 'codigo' }}).pipe(
        tap((res : Array<{ Nombre_Niif: string , Codigo_Niif: string }>) => {
          if(res.length==0){
            this.busquedaCuentaFallida = true
          }
        }),
        catchError(() => {
          this.busquedaCuentaFallida = true;
          return of([]);
        })
      )
    ),
    tap(() => (this.buscandoCuenta = false))
  );

  actualizar(event, percentage) {
    let params = {
      id: event.id,
      percentage: percentage
    }
    this._nominaService.updateCreateNovedades(params)
    .subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Novedades',
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
    this._nominaService.updateCreateNovedades(data)
      .subscribe((res:any)=>{
        this._swal.show({
          title: 'Novedades',
          icon: 'success',
          text: res.data,
          timer: 1000
        })
      })
  }

  //las novedades no las agrega el usuario del sistema,
  //por tanto no hay modal para nueve

}
