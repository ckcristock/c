import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposActivoFijoService } from './tipos-activo-fijo.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

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
  title:any = '';
  pagination:any = {
    page: 1,
    pageSize: 6,
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
    this.title = 'Nuevo tipo de activo fijo';
  }

  closeModal(){
    this.modal.hide();
    this.form.reset();
  }
  
  createForm(){
    this.form = this.fb.group({
      id: [this.fixedAsset.id],
      name: ['', Validators.required],
      category: ['Seleccione', Validators.required],
      useful_life_niif: ['', Validators.required],
      annual_depreciation_percentage_niif: ['', Validators.required],
      useful_life_pcga: ['', Validators.required],
      annual_depreciation_percentage_pcga: ['', Validators.required],
/*    niif_depreciation_account_plan_id: ['', Validators.required],
      pcga_depreciation_account_plan_id: ['', Validators.required], */
      niif_account_plan_id: ['', Validators.required],
      pcga_account_plan_id: ['', Validators.required],
      niif_account_plan_credit_depreciation_id: ['', Validators.required],
      pcga_account_plan_credit_depreciation_id: ['', Validators.required],
      pcga_account_plan_debit_depreciation_id: ['', Validators.required],
      niif_account_plan_debit_depreciation_id: ['', Validators.required]
    });
  }

    inputFormatBandListValue(value: any) {
      if (value.code)
        return value.code
      return value;
    }
  
    resultFormatBandListValue(value: any) {
      return value.code;
    }
  
  /* formatter = (x: { code }) => x.code; */
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

    // formatterNiif = (x: { niif_code }) => x.niif_code;
    searchNiif: OperatorFunction<string, readonly { niif_code }[]> = (
    text$: Observable<string>
    ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.accountPlan
          .filter((state) => new RegExp(term, 'mi').test(state.niif_code))
          .slice(0, 10)
      )
    );

    inputFormatListValueNiif(value: any) {
      if (value.niif_code)
        return value.niif_code
      return value;
    }
  
    resultFormatListValueNiif(value: any) {
      return value.niif_code;
    }
  
    getAccountPlan(){
      this._tipoActivoFijo.getAccountPlan().subscribe((r:any) => {
        this.accountPlan = r.data;
      })
    }

    getTipo(){
      let value = this.form.get('pcga_account_plan_id').value;
    }

    getFixedAsset(fixedAsset){
      this.fixedAsset = {...fixedAsset};
      this.title = 'Editar tipo de activo fijo';
      this.form.patchValue({
        id: this.fixedAsset.id,
        name: this.fixedAsset.name,
        category: this.fixedAsset.category,
        useful_life_niif: this.fixedAsset.useful_life_niif,
        annual_depreciation_percentage_niif: this.fixedAsset.annual_depreciation_percentage_niif,
        useful_life_pcga: this.fixedAsset.useful_life_pcga,
        annual_depreciation_percentage_pcga: this.fixedAsset.annual_depreciation_percentage_pcga,
        niif_depreciation_account_plan_id: this.fixedAsset.niif_depreciation_account_plan,
        niif_account_plan_id: this.fixedAsset.niif_account_plan,
        pcga_depreciation_account_plan_id: this.fixedAsset.pcga_depreciation_account_pland,
        pcga_account_plan_id: this.fixedAsset.pcga_account_plan,
        niif_account_plan_credit_depreciation_id: this.fixedAsset.niif_account_plan_credit_depreciation,
        pcga_account_plan_credit_depreciation_id: this.fixedAsset.pcga_account_plan_credit_depreciation,
        pcga_account_plan_debit_depreciation_id: this.fixedAsset.pcga_account_plan_debit_depreciation,
        niif_account_plan_debit_depreciation_id: this.fixedAsset.niif_account_plan_debit_depreciation
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
      let niif_account_plan_credit_depreciation_id = this.form.value.niif_account_plan_credit_depreciation_id.id;
      let niif_account_plan_debit_depreciation_id = this.form.value.niif_account_plan_debit_depreciation_id.id;
      let niif_account_plan_id = this.form.value.niif_account_plan_id.id;
      let pcga_account_plan_credit_depreciation_id = this.form.value.pcga_account_plan_credit_depreciation_id.id;
      let pcga_account_plan_debit_depreciation_id = this.form.value.pcga_account_plan_debit_depreciation_id.id;
      let pcga_account_plan_id = this.form.value.pcga_account_plan_id.id;
      this.form.patchValue({
        niif_account_plan_credit_depreciation_id,
        niif_account_plan_debit_depreciation_id,
        niif_account_plan_id,
        pcga_account_plan_credit_depreciation_id,
        pcga_account_plan_debit_depreciation_id,
        pcga_account_plan_id
      });
      this._tipoActivoFijo.updateOrCreateFixedAssetType(this.form.value).subscribe((r:any) => {
        this.modal.hide();
        this.form.reset();
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
