import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NumberPipePipe } from 'src/app/core/pipes/number-pipe.pipe';
import { BudgetService } from 'src/app/pages/crm/presupuesto/budget.service';

@Component({
  selector: 'app-items-quotation',
  templateUrl: './items-quotation.component.html',
  styleUrls: ['./items-quotation.component.scss']
})
export class ItemsQuotationComponent implements OnInit {
  @Input('form') form: FormGroup;
  itemsTodelete: Array<number> = [];
  subItemsToDelete: Array<number> = [];
  tempItem: FormGroup;
  numberInput: any = '500000';
  constructor(
    private fb: FormBuilder,
    private _numberPipe: NumberPipePipe
  ) { }

  ngOnInit(): void {
  }


  addItems(item_to_add = null, type) {
    let item = this.fb.group({
      subItems: this.fb.array([]),
      id: item_to_add ? item_to_add.id : '',
      name: item_to_add ? item_to_add.name : '',
      ammount: 1,
      value_cop: item_to_add ? this._numberPipe.transform(item_to_add.value_cop.toString(), '$') : 0,
      value_usd: item_to_add ? this._numberPipe.transform(((item_to_add.value_cop / this.form.get('trm').value).toString()), '$') : 0,
      total_cop: item_to_add ? this._numberPipe.transform(item_to_add.value_cop.toString(), '$') : 0,
      total_usd: item_to_add ? item_to_add.value_usd : 0,
      type: type == 'only_item' ? true : false,
    })


    const subItems = item.get('subItems') as FormArray
    const ammount = item.get('ammount')

    const money_type = this.form.get('money_type') //?CAMBIOS DE TRM
    const money_type_value = this.form.get('money_type').value
    this.changesValues(item, money_type_value)
    ammount.valueChanges.subscribe(r => {
      if (typeof r === 'string') {
        const maskedVal = this._numberPipe.transform(r, '');
        if (r !== maskedVal) {
          item.patchValue({ ammount: maskedVal });
        }
      }
      let value_cop = item.get('value_cop').value.toString().split(/[,$]+/).join('')
      let value_usd = item.get('value_usd').value.toString().split(/[,$]+/).join('')

      let total_cop = value_cop * r.split(',').join('')
      let total_usd = value_usd * r.split(',').join('')
      item.patchValue({
        total_cop: this._numberPipe.transform(total_cop.toString(), '$'),
        total_usd: total_usd
      })
    })
    this.items.push(item)
    return item;
  }

  changesValues(item, money_type_value) {
    const value_cop = item.get('value_cop')
    const value_usd = item.get('value_usd')
    if (money_type_value == 'cop') {
      value_cop.valueChanges.subscribe(r => {
        if (typeof r === 'string') {
          const maskedVal = this._numberPipe.transform(r, '$');
          if (r !== maskedVal) {
            item.patchValue({ value_cop: maskedVal });
          }
        }
        let trm = this.form.get('trm').value
        let value_cop = item.get('value_cop').value.toString().split(/[,$]+/).join('')
        let ammount = item.get('ammount').value.toString().split(',').join('')
        let value_usd = value_cop / trm
        let total_cop = value_cop * ammount
        let total_usd = value_usd * ammount
        item.patchValue({
          value_usd: this._numberPipe.transform(value_usd.toString(), '$'),
          total_cop: this._numberPipe.transform(total_cop.toString(), '$'),
          total_usd: this._numberPipe.transform(total_usd.toString(), '$'),
        })
      })
    }

    if (money_type_value == 'usd') {
      value_usd.valueChanges.subscribe(r => {
        if (typeof r === 'string') {
          const maskedVal = this._numberPipe.transform(r, '$');
          if (r !== maskedVal) {
            item.patchValue({ value_cop: maskedVal });
          }
        }
        let trm = this.form.get('trm').value
        let value_usd = item.get('value_usd').value.toString().split(/[,$]+/).join('')
        let ammount = item.get('ammount').value.toString().split(',').join('')
        let value_cop = value_usd * trm
        let total_usd = value_usd * ammount
        let total_cop = value_cop * ammount
        item.patchValue({
          value_cop: this._numberPipe.transform(value_cop.toString(), '$'),
          total_usd: this._numberPipe.transform(total_usd.toString(), '$'),
          total_cop: this._numberPipe.transform(total_cop.toString(), '$'),
        })
      })
    }
  }


  addSubItem(group: FormGroup) {
    const subItems = group.get('subItems') as FormArray
    subItems.push(this.makeSubItem())
  }

  makeSubItem(pre = null, edit = false) {
    const subItemGroup = this.makeSubItemGroup(pre, edit)
    return subItemGroup;
  }

  findApus(item: FormGroup) {
    this.tempItem = item;
  }

  getBudgets(e: any[]) {
    console.log(e)
    let subItems = this.tempItem.get('subItems') as FormArray;
    e.forEach(budget => {
      const exist = subItems.value.some(x => (x.id == budget.id && x.type_module == budget.type_module))
      !exist ? subItems.push(this.makeSubItem(budget)) : ''
    });
  }



  makeSubItemGroup(pre, edit = null) {
    return this.fb.group({
      id: ((edit && pre?.id) ? pre.id : ''),
    })
  }

  /* console() {
    console.log(this.form.value)
  } */

  deleteItem(pos) {
    const id = this.items.at(pos).get('id').value;
    id ? this.itemsTodelete.push(id) : ''
    this.form.patchValue({ itemsTodelete: this.itemsTodelete })
    this.items.removeAt(pos)
  }

  deleteSubItem(group: FormGroup, pos: number) {
    const subItems = group.get('subItems') as FormArray

    const id = subItems.at(pos).get('id').value;
    id ? this.subItemsToDelete.push(id) : ''

    this.form.patchValue({ subItemsToDelete: this.subItemsToDelete })
    subItems.removeAt(pos)
    /* this.updateSubTotals(subItems,
      ['total_cost', 'subtotal_indirect_cost', 'total_amd_imp_uti',
        'value_amd', 'value_unforeseen', 'value_utility',
        'subTotal', 'another_values', 'retention',
        'value_cop', 'value_usd'])

    this.recalculateTotals() */
  }

  get items() {
    return this.form.get('items') as FormArray;
  }
}
