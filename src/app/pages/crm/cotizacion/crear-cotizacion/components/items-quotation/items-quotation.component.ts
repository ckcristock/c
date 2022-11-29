import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }


  addItems(item_to_add = null) {
    console.log(item_to_add)
    let item = this.fb.group({
      subItems: this.fb.array([]),
      id: item_to_add ? item_to_add.id : '',
      name: item_to_add ? item_to_add.name : '',
      value_cop: item_to_add ? item_to_add.value_cop : '',
      value_usd: item_to_add ? item_to_add.value_usd : '',
    })
    const subItems = item.get('subItems') as FormArray
    this.items.push(item)
    return item;
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
