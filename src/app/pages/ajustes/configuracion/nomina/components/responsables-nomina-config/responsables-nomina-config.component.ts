import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-responsables-nomina-config',
  templateUrl: './responsables-nomina-config.component.html',
  styleUrls: ['./responsables-nomina-config.component.scss']
})
export class ResponsablesNominaConfigComponent implements OnInit {
  @ViewChild('modalResponsable') modalResponsable: any;
  @Input('datos') datos;
  @Input() open: Observable<any> = new Observable();
  @Output('notificacion') notificacion = new EventEmitter<any>();
  @Output() refresh: EventEmitter<any> = new EventEmitter;
  private _suscription: any;

  form: FormGroup;
  loading: boolean = false;
  people: any = [];
  model: any = {};
  searchFailedName = false;
  searchingName = false;
  dato: any = {};

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService,
    private _modal: ModalService,
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this._suscription = this.open.subscribe(() => {
      this._modal.open(this.modalResponsable, 'md', false)
    });
    this.createForm();
  }

  createForm() {
    this.form = this._fb.group({
      area: ['', Validators.required],
      manager: ['', Validators.required],
    })
  }

  formatterName = (responsable: { identifier: string, text: string }) => responsable.text;

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.searchingName = true;
        this.searchFailedName = false;
      }),
      switchMap((term) =>
        this._nominaService.getPeopleWithDni({ search: term }).pipe(
          tap((res) => {
            if (res.length == 0) {
              this.searchFailedName = true;
            }
          }),
          catchError(() => {
            this.searchFailedName = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searchingName = false))
    );

  actualizar = (responsable, identifier) => {
    let data = {
      id: responsable.id,
      manager: identifier.identifier
    }
    this._nominaService.updateCreatePayrollManager(data)
      .subscribe((res: any) => {
        this._swal.show({
          title: 'Responsable de Nómina',
          icon: 'success',
          text: res.data,
          showCancel: false,
          timer: 1000
        })
      })
  }

  save() {
    let params = {
      area: this.form.value.area,
      manager: this.form.value.manager.identifier,
    }
    this._nominaService.updateCreatePayrollManager(params)
      .subscribe((res: any) => {
        this._modal.close()
        this._swal.show({
          title: 'Responsable de Nómina',
          icon: 'success',
          text: res.data,
          showCancel: false,
          timer: 1000
        })
        this.form.reset()
        this.refresh.emit()
      })
  }

}
