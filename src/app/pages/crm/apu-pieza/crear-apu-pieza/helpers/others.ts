import { functionsApu} from './helper';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const othersHelper = {
  consts: {},

  createFillInOthers(form: FormGroup, fb: FormBuilder, data) {
    if (data.other) {
      let others = form.get('others') as FormArray;
      data.other.forEach((r) => {
        let group = fb.group({
          description: [r.description],
          unit_id: [r.unit_id],
          q_unit: [r.q_unit],
          q_total: [r.q_total],
          unit_cost: [r.unit_cost],
          total: [r.total]
        });
        this.subscribeOthers(group, form, others);
        others.push(group);
      });
    }
  },

  createOthersGroup(form: FormGroup, fb: FormBuilder) {
    let amount = form.get('amount').value;
    let others = fb.group({
      description: [''],
      unit_id: [''],
      q_unit: [0],
      q_total: [amount],
      unit_cost: [0],
      total: [0]
    });
    let list = form.get('others') as FormArray;
    this.subscribeOthers(others, form, list);
    return others;
  },

  subscribeOthers( others: FormGroup, form:FormGroup, list: FormArray){
    others.get('q_unit').valueChanges.subscribe(value => {
      let q_total = others.get('q_total').value;
      let unit_cost = others.get('unit_cost').value;
      let result = value * q_total * unit_cost;
      others.patchValue({
        total: result
      });
    });
    others.get('q_total').valueChanges.subscribe(value => {
      let q_unit = others.get('q_unit').value;
      let unit_cost = others.get('unit_cost').value;
      let result = q_unit * value * unit_cost;
      others.patchValue({
        total: result
      });
    });
    others.get('unit_cost').valueChanges.subscribe(value => {
      let q_unit = others.get('q_unit').value;
      let q_total = others.get('q_total').value;
      let result = q_unit * q_total * value;
      others.patchValue({
        total: result
      });
    });
    others.get('total').valueChanges.subscribe(value => {
      this.subtotalOthers(list, form)
    });
    form.get('amount').valueChanges.subscribe(value => {
      others.patchValue({
        q_total: value
      })
    });
  },

  subtotalOthers(list: FormArray, form: FormGroup){
    setTimeout(() => {
      let total = 
      list.value.reduce(
        (a, b) => {
          return  a + b.total
        },0
      );
      form.patchValue({
        others_subtotal: total
      }) 
    }, 100);
  }
};