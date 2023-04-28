import { functionsApu } from './helper';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const externalProccessesHelper = {
  consts: {},

  createFillInExternal(form: FormGroup, fb: FormBuilder, data) {
    if (data.external) {
      let external_proccesses = form.get('external_proccesses') as FormArray;
      data.external.forEach((r) => {
        let group = fb.group({
          description: [r?.description],
          name_description: [r?.external?.name],
          unit_id: [r?.unit_id],
          unit_name: [r?.unit?.name],
          q_unit: [r?.q_unit],
          q_total: [r?.q_total],
          unit_cost: [r?.unit_cost],
          total: [r?.total]
        });
        this.subscribeExternalProcesses(group, form, external_proccesses);
        external_proccesses.push(group);
      });
    }
  },

  createExternalProccessesGroup(form: FormGroup, fb: FormBuilder, element) {
    let amount = form.get('amount').value;
    let external = fb.group({
      description: [element?.value],
      name_description: [element?.text],
      unit_id: [element?.unit_id],
      unit_name: [element?.unit?.name],
      q_unit: [0],
      q_total: [amount],
      unit_cost: [element?.unit_cost],
      total: [0]
    });
    let list = form.get('external_proccesses') as FormArray;
    this.subscribeExternalProcesses(external, form, list);
    return external;
  },

  subscribeExternalProcesses(external: FormGroup, form: FormGroup, list: FormArray) {
    external.get('q_unit').valueChanges.subscribe(value => {
      let q_total = external.get('q_total').value;
      let unit_cost = external.get('unit_cost').value;
      let result = value * q_total * unit_cost;
      external.patchValue({
        total: Math.round(result)
      });
    });
    external.get('q_total').valueChanges.subscribe(value => {
      let q_unit = external.get('q_unit').value;
      let unit_cost = external.get('unit_cost').value;
      let result = q_unit * value * unit_cost;
      external.patchValue({
        total: Math.round(result)
      });
    });
    external.get('unit_cost').valueChanges.subscribe(value => {
      let q_unit = external.get('q_unit').value;
      let q_total = external.get('q_total').value;
      let result = q_unit * q_total * value;
      external.patchValue({
        total: Math.round(result)
      });
    });
    external.get('total').valueChanges.subscribe(value => {
      this.subtotalExternalProcesses(list, form)
    });
    form.get('amount').valueChanges.subscribe(value => {
      external.patchValue({
        q_total: value
      })
    });
  },

  subtotalExternalProcesses(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total =
        list.value.reduce(
          (a, b) => {
            return a + b.total
          }, 0
        );
      form.patchValue({
        external_proccesses_subtotal: total
      })
    }, 100);
  }

};
