import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposRetencionesService } from './tipos-retenciones.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-tipos-retenciones',
  templateUrl: './tipos-retenciones.component.html',
  styleUrls: ['./tipos-retenciones.component.scss']
})
export class TiposRetencionesComponent implements OnInit {
  form: FormGroup;
  @ViewChild('modal') modal:any;
  loading:boolean =  false;
  accountPlan:any[] = [];
  retentionTypes:any[] = [];
  retention:any = {};
  title:any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  constructor(
                private fb: FormBuilder,
                private _retentionType: TiposRetencionesService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getRetentionTypes();
    this.getAccountPlan();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevo tipo de retención';
  }

  closeModal(){
    this.modal.hide();
    this.form.reset();
  }

  search: OperatorFunction<string, readonly { code }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.accountPlan
          .filter((state) => new RegExp(term, 'mi').test(state.code))
          .slice(0, 10)
      )
  );

  inputFormatBandListValue(value: any) {
    if (value.code)
       return value.code
    return value;
  }

   resultFormatBandListValue(value: any) {
    return value.code;
  }

  getAccountPlan(){
    this._retentionType.getAccountPlan().subscribe((r:any) => {
      this.accountPlan = r.data;
    })
  }

  getTipo(){
    let data = this.form.get('account_plan_id').value;
  }

  createForm(){
    this.form = this.fb.group({
      id: [this.retention.id],
      name: ['', Validators.required],
      account_plan_id: ['', Validators.required],
      percentage: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  
  getRetentionTypes(page = 1){
    this.pagination.page = page;
    this.loading = true;
    this._retentionType.getRetentionType(this.pagination).subscribe((r:any) => {
      this.retentionTypes = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    });
  }

  getRetention(retention){
    this.retention = {...retention};
    this.title = 'Editar tipo de retención';
    this.form.patchValue({
      id: this.retention.id,
      name: this.retention.name,
      account_plan_id: this.retention.account_plan,
      percentage: this.retention.percentage,
      description: this.retention.description
    });
  }

  save(){
    let account_plan_id = this.form.value.account_plan_id.id;
    this.form.patchValue({
      account_plan_id
    })
    this._retentionType.updateOrCreateRetentionType(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      this.form.reset();
      this.getRetentionTypes();
      this._swal.show({
        icon: 'success',
        title: 'Proceso Satisfactio',
        text: 'El tipo de Retención ha sido creado con éxito.',
        showCancel: false
      });
    })
  }

  activateOrInactivate(retention, state){
    let data = {
      id: retention.id,
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? '¡El tipo de Retención de anulará!' : '¡El tipo de Retención de activará!')
    }).then((r) => {
      if (r.isConfirmed) {
        this._retentionType.updateOrCreateRetentionType(data).subscribe((r) => {
          this.getRetentionTypes();
          this._swal.show({
            icon: 'success',
            title: '¿Estas Seguro?',
            text: (data.state == 'Inactivo' ? 'El tipo de Retención ha sido anulado con éxito.' : 'El tipo de Retención ha sido activado con éxito.'),
            showCancel: false
          })
        })
      }
    });
  }

}
