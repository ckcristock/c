import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';
import { environment } from 'src/environments/environment';
import { ajax, map } from 'jquery';

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
    private fb: FormBuilder,
    private _swal: SwalService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  formatter = (cuentas: { Nombre_Niif: string , Codigo_Niif: string }) => cuentas.Nombre_Niif;

  search_cuenta_niif = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => (this.buscandoCuenta = true)),
    switchMap(term =>
      this.http.get(`${environment.ruta}php/plancuentas/filtrar_cuentas.php?`, { params: { coincidencia: term, tipo: 'codigo' }}).pipe(
        tap((res : Array<{ Nombre_Niif: string , Codigo_Niif: string }>) => {
          console.log(res)
          if(res){
            this.buscandoCuenta = false
            this.busquedaCuentaFallida = false
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
      percentage: percentage
    }
    this._nominaService.updateIncapacidades(event.id, params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: res.data,
        showCancel: false,
        text: '',
        timer: 1000
      })
    })
  }

  setAccount=(cuentas, identifier)=>{
    let data = {
      id: cuentas.id,
      manager: identifier
    }
    console.log(data)
    /* this._responsableNService.createUpdatePayrollManager(data)
      .subscribe((res:any)=>{

        this._swal.show({
          title: 'Responsable de Nómina',
          icon: 'success',
          text: res.data,
          timer: 1000
        })
      }) */
  }

}
