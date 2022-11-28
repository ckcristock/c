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
  @ViewChild('budgets_modal') budgets_modal: any
  itemsTodelete: Array<number> = [];
  tempItem: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  addItems(item_to_add = null) {
    let item = this.fb.group({
      subItems: this.fb.array([]),
      id: item_to_add ? item_to_add.id : '',
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
    this.budgets_modal.openModal()
  }

  getBudgets(e: any[]) {
    let subItems = this.tempItem.get('subItems') as FormArray;
    e.forEach(apu => {
      const exist = subItems.value.some(x => (x.apu_id == apu.apu_id && x.type_module == apu.type_module))
      !exist ? subItems.push(this.makeSubItem(apu)) : ''
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

  get items() {
    return this.form.get('items') as FormArray;
  }
}
