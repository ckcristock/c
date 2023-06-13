import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { consts } from 'src/app/core/utils/consts';
import { TexteditorService } from 'src/app/pages/ajustes/informacion-base/services/texteditor.service';

@Component({
  selector: 'app-alcance-items',
  templateUrl: './alcance-items.component.html',
  styleUrls: ['./alcance-items.component.scss']
})
export class AlcanceItemsComponent implements OnInit {
  @Input('form') form: FormGroup;
  masks = consts;
  get quotation_items() {
    return this.form?.get('quotation_items') as FormArray;
  }
  constructor(
    public _texteditor: TexteditorService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  addSubItemToScop(item: FormGroup) {
    let subitems = item.get('subitems') as FormArray;
    subitems.push(this.fb.group({
      quotation_item_subitem_id: '',
      name: ['', Validators.required],
      cuantity: [1, [Validators.required, Validators.min(1)]],
      unit: ['UNIDAD', Validators.required],
      observations: ['', Validators.maxLength(4294967295)]
    }))
  }

}
