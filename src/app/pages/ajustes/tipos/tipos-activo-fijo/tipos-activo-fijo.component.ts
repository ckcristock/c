import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TiposActivoFijoService } from './tipos-activo-fijo.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
type AccountPlan = { code: string, id:number, name:string }
@Component({
  selector: 'app-tipos-activo-fijo',
  templateUrl: './tipos-activo-fijo.component.html',
  styleUrls: ['./tipos-activo-fijo.component.scss']
})
export class TiposActivoFijoComponent implements OnInit {
  @ViewChild('modal') modal;
  form: FormGroup;
  loading:boolean = false;
  fixedAssets:any[] = [];
  fixedAsset:any = {};
  accountPlan:any[] = [];
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros:any = {
    name: '',
    category: '',
    useful_life_niif: '',
    depreciation: ''
  }
  constructor( 
                private fb: FormBuilder,
                private _tipoActivoFijo: TiposActivoFijoService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.getFixedAssetTypes();
    this.createForm();
    this.getAccountPlan();
  }

  openModal(){
    this.modal.show();
  }
  
  createForm(){
    this.form = this.fb.group({
      id: [this.fixedAsset.id],
      name: [''],
      category: [''],
      useful_life_niif: [''],
      annual_depreciation_percentage_niif: [''],
      useful_life_pcga: [''],
      annual_depreciation_percentage_pcga: [''],
      niif_depreciation_account_plan_id: [''],
      pcga_depreciation_account_plan_id: [''],
      niif_account_plan_id: [''],
      pcga_account_plan_id: [''],
      niif_account_plan_credit_depreciation_id: [''],
      pcga_account_plan_credit_depreciation_id: [''],
      pcga_account_plan_debit_depreciation_id: [''],
      niif_account_plan_debit_depreciation_id: ['']
    });
  }

  formatter = (state: AccountPlan) => state.code;
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

    /* formatter_niif = (state: AccountPlan) => state.code;
    search_niif: OperatorFunction<string, readonly { code }[]> = (
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
    ); */
  
  getAccountPlan(){
    this._tipoActivoFijo.getAccountPlan().subscribe((r:any) => {
      this.accountPlan = r.data;
    })
  }

    getTipo(){
      let f = this.form.get('pcga_account_plan_id').value;
      /* this.form.patchValue({
        pcga_account_plan_id: f.code
      }) */
    }

    getFixedAsset(fixedAsset){
      this.fixedAsset = {...fixedAsset};
      this.form.patchValue({
        id: this.fixedAsset.id,
        name: this.fixedAsset.name,
        category: this.fixedAsset.category,
        useful_life_niif: this.fixedAsset.useful_life_niif,
        annual_depreciation_percentage_niif: this.fixedAsset.annual_depreciation_percentage_niif,
        useful_life_pcga: this.fixedAsset.useful_life_pcga,
        annual_depreciation_percentage_pcga: this.fixedAsset.annual_depreciation_percentage_pcga,
        niif_depreciation_account_plan_id: this.fixedAsset.niif_depreciation_account_plan_id,
        niif_account_plan_id: this.fixedAsset.niif_account_plan_id,
        pcga_depreciation_account_plan_id: this.fixedAsset.pcga_depreciation_account_plan_id,
        pcga_account_plan_id: this.fixedAsset.pcga_account_plan_id,
        niif_account_plan_credit_depreciation_id: this.fixedAsset.niif_account_plan_credit_depreciation_id,
        pcga_account_plan_credit_depreciation_id: this.fixedAsset.pcga_account_plan_credit_depreciation_id,
        pcga_account_plan_debit_depreciation_id: this.fixedAsset.pcga_account_plan_debit_depreciation_id,
        niif_account_plan_debit_depreciation_id: this.fixedAsset.niif_account_plan_debit_depreciation_id,
      });
    }
  
  getFixedAssetTypes(page = 1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._tipoActivoFijo.getFixedAssetType(params).subscribe((r:any) => {
      this.fixedAssets = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  calculateDepreciationPercentage(tipo) {
    if (tipo == 'pcga') {
      let porcentaje = (100 / parseInt(this.form.value.useful_life_pcga)).toFixed(4);
      this.form.patchValue({
        annual_depreciation_percentage_pcga: porcentaje
      })
    } else {
      let porcentaje = (100 / parseInt(this.form.value.useful_life_niif)).toFixed(4);
      this.form.patchValue({
        annual_depreciation_percentage_niif: porcentaje
      })
    }
  }

  save(){
    this._tipoActivoFijo.updateOrCreateFixedAssetType(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      console.log(this.form.value);
      this.getFixedAssetTypes();
      this._swal.show({
        icon: 'success',
        title: 'Proceso Satisfactorio',
        text: 'El Tipo de Activo se ha creado Satisfactoriamente.',
        showCancel: false
      })
    })
  }

  activateOrInactivate(tipo_activo, state){
    let data = {
      id: tipo_activo.id,
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? '¡El tipo de Activo Fijo de anulará!' : '¡El tipo de Activo Fijo de activará!')
    }).then((r) => {
      if (r.isConfirmed) {
        this._tipoActivoFijo.updateOrCreateFixedAssetType(data).subscribe((r) => {
          this.getFixedAssetTypes();
          this._swal.show({
            icon: 'success',
            title: '¿Estas Seguro?',
            text: (data.state == 'Inactivo' ? 'El tipo de Activo Fijo ha sido anulado con éxito.' : 'El tipo de Activo Fijo ha sido activado con éxito.'),
            showCancel: false
          })
        })
      }
    });
  }

}
