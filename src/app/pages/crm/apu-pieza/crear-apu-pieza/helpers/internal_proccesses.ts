import { functionsApu} from './helper';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const internalProccessesHelper = {
  consts: {},
  createInternalProccessesGroup(form: FormGroup, fb: FormBuilder) {
    let amount = form.get('amount').value;
    let internal = fb.group({
      description: [''],
      unit_id: [''],
      q_unit: [0],
      q_total: [amount],
      unit_cost: [0],
      total: [0]
    });
    let list = form.get('internal_proccesses') as FormArray;
    this.subscribeInternalProcesses(internal, form, list);
    return internal;
  },

  subscribeInternalProcesses( internal: FormGroup, form:FormGroup, list: FormArray){
    internal.get('q_unit').valueChanges.subscribe(value => {
      let q_total = internal.get('q_total').value;
      let unit_cost = internal.get('unit_cost').value;
      let result = value * q_total * unit_cost;
      internal.patchValue({
        total: result
      });
    });
    internal.get('q_total').valueChanges.subscribe(value => {
      let q_unit = internal.get('q_unit').value;
      let unit_cost = internal.get('unit_cost').value;
      let result = q_unit * value * unit_cost;
      internal.patchValue({
        total: result
      });
    });
    internal.get('unit_cost').valueChanges.subscribe(value => {
      let q_unit = internal.get('q_unit').value;
      let q_total = internal.get('q_total').value;
      let result = q_unit * q_total * value;
      internal.patchValue({
        total: result
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

  subtotalInternalProcesses(list: FormArray, form: FormGroup){
    setTimeout(() => {
      let total = 
      list.value.reduce(
        (a, b) => {
          return  a + b.total
        },0
      );
      form.patchValue({
        internal_proccesses_subtotal: total
      }) 
    }, 100);
  }
};