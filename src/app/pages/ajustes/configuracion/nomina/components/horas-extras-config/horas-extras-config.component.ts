import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-horas-extras-config',
  templateUrl: './horas-extras-config.component.html',
  styleUrls: ['./horas-extras-config.component.scss']
})
export class HorasExtrasConfigComponent implements OnInit {

  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();

  form: FormGroup;
  busquedaCuentaFallida: boolean;
  buscandoCuenta: boolean;

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  formatter = (cuentas: { Nombre_Niif: string , Codigo_Niif: string }) => cuentas.Nombre_Niif;

  search_cuenta_niif1 = (text$: Observable<string>) =>{
    return text$.pipe(
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
  }

  actualizar(event, percentage) {
    let params = {
      percentage: percentage
    }
    this._nominaService.updateExtras(event.id, params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Horas Extras',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

  setAccount(datos) {
    let params = {
      id: datos.datos.id,
      account_plan_id: datos.identifier
    }
    this._nominaService.updateExtras(datos.datos.id, params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Horas Extras',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

}
