import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { consts } from 'src/app/core/utils/consts';
import { CalculationBasesService } from 'src/app/pages/ajustes/configuracion/base-calculos/calculation-bases.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { TexteditorService } from 'src/app/pages/ajustes/informacion-base/services/texteditor.service';
import { Texteditor2Service } from 'src/app/pages/ajustes/informacion-base/services/texteditor2.service';
import { BudgetService } from 'src/app/pages/crm/presupuesto/budget.service';

@Component({
  selector: 'app-items-quotation',
  templateUrl: './items-quotation.component.html',
  styleUrls: ['./items-quotation.component.scss']
})
export class ItemsQuotationComponent implements OnInit {
  @ViewChild('apus') apus: any;
  @Input('form') form: FormGroup;
  itemsTodelete: Array<number> = [];
  subItemsToDelete: Array<number> = [];
  tempItem: FormGroup;
  numberInput: any = '500000';
  masksMoney = consts
  apuSelected: any[] = [];
  calculationBases: any;
  subItemActive;
  indexAdd;
  constructor(
    private fb: FormBuilder,
    private _swal: SwalService,
    private _calculationBases: CalculationBasesService,
    private router: Router,
    public _texteditor: TexteditorService,
  ) { }

  ngOnInit(): void {
    this.getCalculationBases()
  }

  getCalculationBases() {
    this._calculationBases?.getAll()?.subscribe((r: any) => {
      this.calculationBases = r?.data
    })
  }

  insert: boolean = false;

  getApus(e: any[]) {
    const subItems = this.subItemActive?.get('subItems') as FormArray
    e?.forEach(apu => {
      const exist = this.apuSelected?.some(x => (x?.apu_id == apu?.apu_id && x?.type_module == apu?.type_module))
      if (!this.insert) {
        if (!exist) {
          subItems?.setControl(this.indexAdd, this.makeSubItem(apu, false, 'withSub', this.subItemActive, 'apu'))
        } else {
          this._swal?.show({ icon: 'error', title: 'Error', text: 'Ya agregaste este APU', showCancel: false })
        }
      } else {
        !exist ? subItems?.insert(this.indexAdd, this.makeSubItem(apu, false, 'withSub', this.subItemActive, 'apu')) : this._swal?.show({ icon: 'error', title: 'Error', text: 'Ya agregaste este APU', showCancel: false })
      }

    });
    this.recalculate(subItems, this.subItemActive)
  }

  addSubItem(group: FormGroup, type) {
    const subItems = group?.get('subItems') as FormArray
    if (subItems?.controls?.length == 0) {
      group?.patchValue({
        value_cop_aux: 0,
        value_cop: 0,
        value_usd_aux: 0,
        value_usd: 0,
        total_cop_aux: { value: 0, disabled: true },
        total_cop: { value: 0, disabled: true },
        total_usd_aux: { value: 0, disabled: true },
        total_usd: { value: 0, disabled: true },
      })
    }
    group?.get('value_cop_aux')?.disable()
    group?.get('value_usd_aux')?.disable()
    subItems?.push(this.makeSubItem(null, false, type, group))

  }

  addItems(item_to_add = null, type, category = '', noCreate = false) {
    let type_model;
    if (item_to_add && category == 'apu' && !noCreate) {
      switch (item_to_add?.type_module) {
        case 'apu_part':
          type_model = 'App\\Models\\ApuPart';
          break;
        case 'apu_set':
          type_model = 'App\\Models\\ApuSet';
          break;
        case 'apu_service':
          type_model = 'App\\Models\\ApuService';
          break;
        default:
          break;
      }
    }
    let item = this.fb?.group({
      subItems: this.fb?.array([]),
      id: item_to_add ? item_to_add?.id : '',
      quotationitemable_id:
        (category == 'budget' && item_to_add && !noCreate)
          ? item_to_add?.id
          : (category == 'apu' && item_to_add && !noCreate)
            ? item_to_add?.apu_id
            : noCreate
              ? item_to_add?.quotationitemable_id
              : '',
      quotationitemable_type:
        (category == 'apu' && item_to_add && !noCreate)
          ? type_model
          : (category == 'budget' && item_to_add && !noCreate)
            ? 'App\\Models\\BudgetItem'
            : noCreate
              ? item_to_add?.quotationitemable_type
              : '',
      name: [item_to_add ? item_to_add?.name : '', Validators?.required],
      cuantity_aux: [1, Validators?.required],
      cuantity: 1,
      value_cop_aux:
        (category == 'apu' && item_to_add && !noCreate)
          ? item_to_add?.unit_cost
          : (category == 'budget' && item_to_add && !noCreate)
            ? item_to_add?.value_cop
            : noCreate
              ? item_to_add?.value_cop
              : 0,
      value_cop:
        (category == 'apu' && item_to_add && !noCreate)
          ? item_to_add?.unit_cost
          : (category == 'budget' && item_to_add && !noCreate)
            ? item_to_add?.value_cop
            : noCreate
              ? item_to_add?.value_cop
              : 0,
      value_usd_aux:
        (category == 'apu' && item_to_add && !noCreate)
          ? (item_to_add?.unit_cost / this.calculationBases[0]?.value)
          : (category == 'budget' && item_to_add && !noCreate)
            ? item_to_add?.value_usd
            : noCreate
              ? item_to_add?.value_usd
              : 0,
      value_usd:
        (category == 'apu' && item_to_add && !noCreate)
          ? (item_to_add?.unit_cost / this.calculationBases[0]?.value)
          : (category == 'budget' && item_to_add && !noCreate)
            ? item_to_add?.value_usd
            : noCreate
              ? item_to_add?.value_usd
              : 0,
      total_cop_aux: {
        value:
          (category == 'apu' && item_to_add && !noCreate)
            ? item_to_add?.unit_cost
            : (category == 'budget' && item_to_add && !noCreate)
              ? item_to_add?.value_cop
              : noCreate
                ? item_to_add?.total_cop
                : 0,
        disabled: true
      },
      total_cop: {
        value:
          (category == 'apu' && item_to_add && !noCreate)
            ? item_to_add?.unit_cost
            : (category == 'budget' && item_to_add && !noCreate)
              ? item_to_add?.value_cop
              : noCreate
                ? item_to_add?.total_cop
                : 0,
        disabled: true
      },
      total_usd_aux: {
        value:
          (category == 'apu' && item_to_add && !noCreate)
            ? (item_to_add?.unit_cost / this.calculationBases[0]?.value)
            : (category == 'budget' && item_to_add && !noCreate)
              ? item_to_add?.value_usd
              : noCreate
                ? item_to_add?.total_usd
                : 0,
        disabled: true
      },
      total_usd: {
        value:
          (category == 'apu' && item_to_add && !noCreate)
            ? (item_to_add?.unit_cost / this.calculationBases[0]?.value)
            : (category == 'budget' && item_to_add && !noCreate)
              ? item_to_add?.value_usd
              : noCreate
                ? item_to_add?.total_usd
                : 0,
        disabled: true
      },
      type: type == 'only_item' ? false : type == 'withSub' ? true : true,
    })

    const subItems = item?.get('subItems') as FormArray
    const cuantity_aux = item?.get('cuantity_aux')
    const money_type_value = this.form?.get('money_type')?.value
    /* const trm = this.form?.get('trm') //?CAMBIOS DE TRM
    trm?.valueChanges?.subscribe(r => {
      if (money_type_value == 'cop') {
        let value_cop = item?.get('value_cop')?.value?.toString()?.split(/[,$]+/).join('')
        let trm = this.form.get('trm').value
        let value_usd = value_cop / trm
        item.patchValue({
          value_usd: this._numberPipe.transform(value_usd.toString(), '$'),
          value_cop: this._numberPipe.transform(value_cop.toString(), '$'),
        })
      } else if (money_type_value == 'usd') {
        let value_usd = item.get('value_usd').value.toString().split(/[,$]+/).join('')
        let trm = this.form.get('trm').value
        let value_cop = value_usd * trm
        item.patchValue({
          value_usd: this._numberPipe.transform(value_usd.toString(), '$'),
          value_cop: this._numberPipe.transform(value_cop.toString(), '$'),
        })
      }
    }) */
    const value_cop_aux = item?.get('value_cop_aux')
    const value_usd_aux = item?.get('value_usd_aux')
    const total_cop_aux = item?.get('total_cop_aux')
    const total_usd_aux = item?.get('total_usd_aux')
    value_cop_aux?.valueChanges?.subscribe(r => {
      let cuantity_aux = item?.get('cuantity_aux')?.value
      let value_cop_aux = item?.get('value_cop_aux')?.value
      let total_cop_aux = value_cop_aux * cuantity_aux
      item?.patchValue({
        total_cop_aux: total_cop_aux,
        value_cop: value_cop_aux,
        total_cop: total_cop_aux,
      })
    })

    value_usd_aux?.valueChanges?.subscribe(r => {
      let cuantity_aux = item?.get('cuantity_aux')?.value
      let value_usd_aux = item?.get('value_usd_aux')?.value
      let total_usd_aux = value_usd_aux * cuantity_aux
      item?.patchValue({
        total_usd_aux: total_usd_aux,
        value_usd: total_usd_aux,
        total_usd: total_usd_aux,
      })
    })
    /* this.changesValues(item, money_type_value) */
    cuantity_aux?.valueChanges?.subscribe(r => {
      let value_cop_aux = item?.get('value_cop_aux')?.value
      let value_usd_aux = item?.get('value_usd_aux')?.value
      let cuantity_aux = item?.get('cuantity_aux')?.value
      let total_cop_aux = value_cop_aux * cuantity_aux
      let total_usd_aux = value_usd_aux * cuantity_aux
      item?.patchValue({
        total_cop_aux: total_cop_aux,
        total_cop: total_cop_aux,
        total_usd_aux: total_usd_aux,
        total_usd: total_usd_aux,
        cuantity: cuantity_aux,
      })
    })

    total_cop_aux?.valueChanges?.subscribe(r => {
      this.updateTotal()
    })
    total_usd_aux?.valueChanges?.subscribe(r => {
      this.updateTotal()
    })
    this.items?.push(item)
    if (item_to_add && type == 'subitems') {
      item?.get('value_cop_aux')?.disable()
      item?.get('value_usd_aux')?.disable()
      const subItems = item?.get('subItems') as FormArray

      if (item_to_add?.subitems) {
        item_to_add?.subitems?.forEach(subi => {
          subItems?.push(this.makeSubItem(subi, true, type, item, category, noCreate))
        });
      }
      if (item_to_add?.sub_items) {
        item_to_add?.sub_items?.forEach(subi => {
          subItems?.push(this.makeSubItem(subi, true, type, item, category, noCreate))
        });
      }
    }
    this.updateTotal()
    return item;
  }

  updateTotal() {
    let total_cop: number = 0
    let total_usd: number = 0
    let form = this.form?.getRawValue()
    form?.items?.forEach(item => {
      total_cop += Number(item?.total_cop_aux)
      total_usd += Number(item?.total_usd_aux)
    });
    this.form?.patchValue({
      total_cop: total_cop,
      total_usd: total_usd
    })
  }

  /* changesValues(item, money_type_value) {
    const value_cop_aux = item.get('value_cop_aux')
    const value_usd_aux = item.get('value_usd_aux')
    //if (money_type_value == 'cop') {
    value_cop_aux.valueChanges.subscribe(r => {
      if (typeof r === 'string') {
        const maskedVal = this._numberPipe.transform(r, '$');
        if (r !== maskedVal) {
          item.patchValue({ value_cop_aux: maskedVal });
        }
      }
      //let trm = this.form.get('trm').value
      //let value_cop = item.get('value_cop').value.toString().split(/[,$]+/).join('')
      let cuantity_aux = item.get('cuantity_aux').value.toString().split(',').join('')
      //let value_usd = value_cop / trm
      let total_cop_aux = value_cop_aux * cuantity_aux
      //let total_usd = value_usd * cuantity
      item.patchValue({
        //value_usd: this._numberPipe.transform(value_usd.toString(), '$'),
        total_cop_aux: this._numberPipe.transform(total_cop_aux.toString(), '$'),
        //total_usd: this._numberPipe.transform(total_usd.toString(), '$'),
      })
    })
    //}

    //if (money_type_value == 'usd') {
    value_usd_aux.valueChanges.subscribe(r => {
      if (typeof r === 'string') {
        const maskedVal = this._numberPipe.transform(r, '$');
        if (r !== maskedVal) {
          item.patchValue({ value_usd_aux: maskedVal });
        }
      }
      //let trm = this.form.get('trm').value
      let value_usd_aux = item.get('value_usd_aux').value.toString().split(/[,$]+/).join('')
      let cuantity_aux = item.get('cuantity_aux').value.toString().split(',').join('')
      //let value_cop = value_usd * trm
      let total_usd_aux = value_usd_aux * cuantity_aux
      //let total_cop = value_cop * cuantity
      item.patchValue({
        //value_cop: this._numberPipe.transform(value_cop.toString(), '$'),
        total_usd_aux: this._numberPipe.transform(total_usd_aux.toString(), '$'),
        //total_cop: this._numberPipe.transform(total_cop.toString(), '$'),
      })
    })
    //}
  } */
  value_cop_temp: number
  value_usd_temp: number

  recalculate(subItemGroup, item_pre) {
    this.value_cop_temp = 0
    this.value_usd_temp = 0
    item_pre?.getRawValue()?.subItems?.forEach(subItem => {
      this.value_cop_temp += Number(subItem?.total_cop_aux)
      this.value_usd_temp += Number(subItem?.total_usd_aux)
    });
    let value_cop = this.value_cop_temp * Number(item_pre?.controls?.cuantity_aux?.value)
    item_pre?.patchValue({
      value_cop_aux: this.value_cop_temp,
      value_usd_aux: this.value_usd_temp,
    })

  }

  makeSubItem(pre = null, edit = false, type = '', group = null, category = '', noCreate = false) {
    const subItemGroup = this.makeSubItemGroup(pre, edit, type, category, noCreate)
    const cuantity_aux = subItemGroup?.get('cuantity_aux')
    const value_cop_aux = subItemGroup?.get('value_cop_aux')
    const value_usd_aux = subItemGroup?.get('value_usd_aux')
    const total_cop_aux = subItemGroup?.get('total_cop_aux')
    const total_usd_aux = subItemGroup?.get('total_usd_aux')
    const suma = (a, b) => parseFloat(a) * parseFloat(b);
    cuantity_aux?.valueChanges?.subscribe(r => {
      let value_cop_aux = subItemGroup?.get('value_cop_aux')?.value
      let value_usd_aux = subItemGroup?.get('value_usd_aux')?.value
      let cuantity_aux = subItemGroup?.get('cuantity_aux')?.value

      let total_cop_aux = value_cop_aux * cuantity_aux
      let total_usd_aux = value_usd_aux * cuantity_aux

      subItemGroup?.patchValue({
        total_cop_aux: total_cop_aux,
        total_cop: total_cop_aux,
        total_usd_aux: total_usd_aux,
        total_usd: total_usd_aux,
        cuantity: cuantity_aux,
      })
      this?.recalculate(subItemGroup, group)
    })
    value_cop_aux?.valueChanges?.subscribe(r => {
      let cuantity_aux = subItemGroup?.get('cuantity_aux')?.value
      let value_cop_aux = subItemGroup?.get('value_cop_aux')?.value
      let total_cop_aux = value_cop_aux * cuantity_aux
      subItemGroup?.patchValue({
        total_cop_aux: total_cop_aux,
        value_cop: value_cop_aux,
        total_cop: total_cop_aux,
      })
      this.recalculate(subItemGroup, group)
    })
    value_usd_aux?.valueChanges?.subscribe(r => {
      let cuantity_aux = subItemGroup?.get('cuantity_aux')?.value
      let value_usd_aux = subItemGroup?.get('value_usd_aux')?.value
      let total_usd_aux = value_usd_aux * cuantity_aux
      subItemGroup?.patchValue({
        total_usd_aux: total_usd_aux,
        value_usd: value_usd_aux,
        total_usd: total_usd_aux,
      })
      this.recalculate(subItemGroup, group)
    })

    return subItemGroup;
  }

  /* getBudgets(e: any[]) {
    let subItems = this.tempItem.get('subItems') as FormArray;
    e.forEach(budget => {
      const exist = subItems.value.some(x => (x.id == budget.id && x.type_module == budget.type_module))
      !exist ? subItems.push(this.makeSubItem(budget, null, '', this.tempItem, 'budget')) : ''
    });
  } */

  openNewTab(type, id) {
    let uri = ''
    switch (type) {
      case 'App\\Models\\ApuPart':
        uri = '/crm/apu/ver-apu-pieza';
        break;
      case 'App\\Models\\ApuSet':
        uri = '/crm/apu/ver-apu-conjunto';
        break;
      case 'App\\Models\\ApuService':
        uri = '/crm/apu/ver-apu-servicio';
        break;
      case 'App\\Models\\BudgetItemSubitem':
        uri = '/crm/presupuesto/ver';
        break;
      default:
        break;
    }
    const url = this.router?.serializeUrl(
      this.router?.createUrlTree([uri + '/' + id])
    );
    window?.open(url, '_blank');
  }


  makeSubItemGroup(pre, edit = null, type, category = '', noCreate = false) {
    let type_model;
    if (pre && category == 'apu' && !noCreate) {
      switch (pre?.type_module) {
        case 'apu_part':
          type_model = 'App\\Models\\ApuPart';
          break;
        case 'apu_set':
          type_model = 'App\\Models\\ApuSet';
          break;
        case 'apu_service':
          type_model = 'App\\Models\\ApuService';
          break;
        default:
          break;
      }
    }
    return this.fb?.group({
      id: ((edit && pre?.id) ? pre?.id : ''),
      budget_item_subitem_id: ((edit && pre?.id) ? pre?.id : ''),
      quotationitemsubitemable_id:
        (category == 'budget' && pre && !noCreate)
          ? pre?.id
          : (category == 'apu' && pre && !noCreate)
            ? pre?.apu_id
            : noCreate
              ? pre?.quotationitemsubitemable_id
              : '',
      quotationitemsubitemable_type:
        (category == 'apu' && pre && !noCreate)
          ? type_model
          : (category == 'budget' && pre && !noCreate)
            ? 'App\\Models\\BudgetItemSubitem'
            : noCreate
              ? pre?.quotationitemsubitemable_type
              : '',
      description: [
        (category == 'apu' && pre && !noCreate)
          ? pre?.name
          : (category == 'budget' && pre && !noCreate)
            ? pre?.description
            : noCreate
              ? pre?.description
              : ''
        ,
        Validators?.required],
      cuantity_aux:
        (edit && pre?.cuantity)
          ? pre?.cuantity
          : 1,
      cuantity:
        (edit && pre?.cuantity)
          ? pre?.cuantity
          : 1,
      value_cop_aux:
        (category == 'apu' && pre && !noCreate)
          ? pre?.unit_cost
          : (category == 'budget' && pre && !noCreate)
            ? pre?.value_cop / pre?.cuantity
            : noCreate
              ? pre?.value_cop / pre?.cuantity
              : 0,
      value_cop:
        (category == 'apu' && pre && !noCreate)
          ? pre?.unit_cost
          : (category == 'budget' && pre && !noCreate)
            ? pre?.value_cop / pre?.cuantity
            : noCreate
              ? pre?.value_cop / pre?.cuantity
              : 0,
      value_usd_aux:
        (category == 'apu' && pre && !noCreate)
          ? (pre?.unit_cost / this.calculationBases[0]?.value)
          : (category == 'budget' && pre && !noCreate)
            ? pre?.value_usd / pre?.cuantity
            : noCreate
              ? pre?.value_usd / pre?.cuantity
              : 0,
      value_usd:
        (category == 'apu' && pre && !noCreate)
          ? (pre?.unit_cost / this.calculationBases[0]?.value)
          : (category == 'budget' && pre && !noCreate)
            ? pre?.value_usd / pre?.cuantity
            : noCreate
              ? pre?.value_usd / pre?.cuantity
              : 0,
      total_cop_aux: {
        value:
          (category == 'apu' && pre && !noCreate)
            ? pre?.unit_cost
            : (category == 'budget' && pre && !noCreate)
              ? pre?.value_cop
              : noCreate
                ? pre?.value_cop
                : 0,
        disabled: true
      },
      total_cop: {
        value:
          (category == 'apu' && pre && !noCreate)
            ? pre?.unit_cost
            : (category == 'budget' && pre && !noCreate)
              ? pre?.value_cop
              : noCreate
                ? pre?.value_cop
                : 0,
        disabled: true
      },
      total_usd_aux: {
        value:
          (category == 'apu' && pre && !noCreate)
            ? (pre?.unit_cost / this.calculationBases[0]?.value)
            : (category == 'budget' && pre && !noCreate)
              ? pre?.value_usd
              : noCreate
                ? pre?.value_usd
                : 0,
        disabled: true
      },
      total_usd: {
        value:
          (category == 'apu' && pre && !noCreate)
            ? (pre?.unit_cost / this.calculationBases[0]?.value)
            : (category == 'budget' && pre && !noCreate)
              ? pre?.value_usd
              : noCreate
                ? pre?.value_usd
                : 0,
        disabled: true
      },
      type: type == 'only_item' ? true : false,
    })
  }

  printForm() {
  }

  deleteItem(pos) {
    const id = this.items?.at(pos)?.get('id')?.value;
    id ? this.itemsTodelete?.push(id) : ''
    this.form?.patchValue({ itemsTodelete: this.itemsTodelete })
    this.items?.removeAt(pos)
    this.updateTotal()
  }

  deleteSubItem(group: FormGroup, pos: number) {
    const subItems = group?.get('subItems') as FormArray
    if (subItems?.controls?.length == 1) {
      group?.controls?.value_cop_aux?.enable()
      group?.controls?.value_usd_aux?.enable()
    }
    const id = subItems?.at(pos)?.get('id')?.value;
    id ? this.subItemsToDelete?.push(id) : ''

    this.form?.patchValue({ subItemsToDelete: this.subItemsToDelete })
    subItems?.removeAt(pos)
    this.recalculate('', group)
    /* this.updateSubTotals(subItems,
      ['total_cost', 'subtotal_indirect_cost', 'total_amd_imp_uti',
        'value_amd', 'value_unforeseen', 'value_utility',
        'subTotal', 'another_values', 'retention',
        'value_cop', 'value_usd'])

    this.recalculateTotals() */
  }

  get items() {
    return this.form?.get('items') as FormArray;
  }
}
