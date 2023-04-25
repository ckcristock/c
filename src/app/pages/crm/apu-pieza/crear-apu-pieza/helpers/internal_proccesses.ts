import { functionsApu } from './helper';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const internalProccessesHelper = {
  consts: {},

  createFillInInternal(form: FormGroup, fb: FormBuilder, data) {
    if (data.internal) {
      let internal_proccesses = form.get('internal_proccesses') as FormArray;
      data.internal.forEach((r) => {
        let group = fb.group({
          description: [r?.description],
          name_description: [r?.internal?.name],
          unit_id: [r?.unit_id],
          q_unit: [r?.q_unit],
          unit_name: [r?.unit?.name],
          q_total: [r?.q_total],
          unit_cost: [r?.unit_cost],
          total: [r?.total]
        });
        this.subscribeInternalProcesses(group, form, internal_proccesses);
        internal_proccesses.push(group);
      });
    }
  },

  createInternalProccessesGroup(form: FormGroup, fb: FormBuilder, element) {
    let amount = form.get('amount').value;
    let internal = fb.group({
      description: [element?.value],
      name_description: [element?.text],
      unit_id: [element?.unit_id],
      unit_name: [element?.unit?.name],
      q_unit: [0],
      q_total: [amount],
      unit_cost: [element?.unit_cost],
      total: [0]
    });
    let list = form.get('internal_proccesses') as FormArray;
    this.subscribeInternalProcesses(internal, form, list);
    return internal;
  },

  subscribeInternalProcesses(internal: FormGroup, form: FormGroup, list: FormArray) {
    internal.get('q_unit').valueChanges.subscribe(value => {
      let q_total = internal.get('q_total');
      let unit_cost = internal.get('unit_cost');
      let result = value * q_total?.value * unit_cost?.value;
      internal.patchValue({
        total: Math.round(result)
      });
    });
    internal.get('q_total').valueChanges.subscribe(value => {
      let q_unit = internal.get('q_unit');
      let unit_cost = internal.get('unit_cost');
      let result = q_unit?.value * value * unit_cost?.value;
      internal.patchValue({
        total: Math.round(result)
      });
    });
    internal.get('unit_cost').valueChanges.subscribe(value => {
      let q_unit = internal.get('q_unit');
      let q_total = internal.get('q_total');
      let result = q_unit.value * q_total?.value * value;
      internal.patchValue({
        total: Math.round(result)
      });
    });
    internal.get('total').valueChanges.subscribe(value => {
      this.subtotalInternalProcesses(list, form)
    });
    form.get('amount').valueChanges.subscribe(value => {
      internal.patchValue({
        q_total: value
      })
    });
  },

  subtotalInternalProcesses(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total =
        list.value.reduce(
          (a, b) => {
            return a + b.total
          }, 0
        );
      form.patchValue({
        internal_proccesses_subtotal: total
      })
    }, 100);
  }
};
