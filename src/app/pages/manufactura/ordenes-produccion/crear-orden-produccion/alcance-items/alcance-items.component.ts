import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
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
  ) { }

  ngOnInit() {
  }

}
