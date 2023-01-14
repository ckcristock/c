import { functionsApuConjunto } from './helper';
import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

export const internalProcessesHelper = {
  consts: {},

  createFillInInternal(form: FormGroup, fb: FormBuilder, data) {

    if (data.internal) {
      let internal_processes = form.get('internal_processes') as FormArray;
      data.internal.forEach((r) => {
        let group = fb.group({
          description: [r.description],
          unit_id: [r.unit_id],
          amount: [r.amount],
          unit_cost: [r.unit_cost],
          total: [r.total]
        });
        this.subscribeInternalProcesses(group, form, internal_processes);
        internal_processes.push(group);
      });
    }
  },

  createInternalProcessesGroup(form: FormGroup, fb: FormBuilder) {
    let internal = fb.group({
      description: [''],
      unit_id: [''],
      amount: [0],
      unit_cost: [0],
      total: [0]
    });
    let list = form.get('internal_processes') as FormArray;
    this.subscribeInternalProcesses(internal, form, list);
    return internal;
  },

  subscribeInternalProcesses( internal: FormGroup, form:FormGroup, list: FormArray){
    internal.get('amount').valueChanges.subscribe(value => {
      let unit_cost = internal.get('unit_cost');
      let result = (typeof unit_cost.value == 'number' && typeof value == 'number' ? (unit_cost.value * value) : 0 )
      internal.patchValue({
        total: Math.round(result)
      })
    });
    internal.get('unit_cost').valueChanges.subscribe(value => {
      let amount = internal.get('amount');
      let result = (typeof amount.value == 'number' && typeof value == 'number' ? (value * amount.value) : 0)
      internal.patchValue({
        total: Math.round(result)
      })
    });
    internal.get('total').valueChanges.subscribe(value => {
      this.subtotalInternalProcesses(list, form);
    })
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
        internal_processes_subtotal: total
      })
    }, 100);
  }
};
