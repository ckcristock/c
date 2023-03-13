import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, take, tap } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';

import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-egresos-config',
  templateUrl: './egresos-config.component.html',
  styleUrls: ['./egresos-config.component.scss']
})
export class EgresosConfigComponent implements OnInit {
  @ViewChild('modalEgreso') modalEgreso: any;
  @Input() open: Observable<any> = new Observable();
  @Output() refresh: EventEmitter<any> = new EventEmitter;
  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();
  private _suscription: any;
  form: FormGroup;

  accounting_account: {
    Id_Plan_Cuentas: '',
    Codigo_Niif: '',
    Nombre_Niif: ''
  }
  searching: boolean;
  searchFail: boolean;
  loading: boolean;

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService,
    private _modal: ModalService,
    private _fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this._suscription = this.open.subscribe(() => {
      this._modal.open(this.modalEgreso, 'md', false)
    });
    this.createForm();
  }

  createForm() {
    this.form = this._fb.group({
      concept: ['', Validators.required],
      accounting_account: [this.accounting_account, Validators.required]
    })
  }

  formatter = (cuentas: { Nombre_Niif: string, Codigo_Niif: string }) => cuentas.Codigo_Niif + ' || ' + cuentas.Nombre_Niif;

  search_cuenta_niif = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.searchFail = false;
      }),
      switchMap(term =>
        this.http.get(`${environment.base_url}/php/plancuentas/filtrar_cuentas.php?`, { params: { coincidencia: term } }).pipe(
          tap((res: Array<{ Nombre_Niif: string, Codigo_Niif: string }>) => {
            if (res.length == 0) {
              this.searchFail = true
            }
          }),
          catchError(() => {
            this.searchFail = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

  actualizar(event, variable, id) {
    let params = {
      id: id,
      [variable]: event
    }
    this._nominaService.updateCreateEgresos(params)
      .subscribe((res: any) => {
        this._swal.show({
          icon: 'success',
          title: 'Egresos',
          text: res.data,
          showCancel: false,
          timer: 1000
        })
      })
  }

  save() {
    let params = {
      concept: this.form.value.concept,
      accounting_account: this.form.value.accounting_account.Codigo_Niif,
      state: true,
      editable: false
    }
    this._nominaService.updateCreateEgresos(params)
      .subscribe((res: any) => {
        this._modal.close()
        this._swal.show({
          icon: 'success',
          title: 'Egresos',
          text: res.data,
          showCancel: false,
          timer: 1000
        })
        this.form.reset()
        this.refresh.emit()
      })
  }

}
