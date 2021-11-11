import { functionsApu} from './helper';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const externalProccessesHelper = {
  consts: {},
  createExternalProccessesGroup(form:FormGroup, fb: FormBuilder) {
    let amount = form.get('amount').value;
    let external = fb.group({
      description: [''],
      unit_id: [''],
      q_unit: [0],
      q_total: [amount],
      unit_cost: [0],
      total: [0]
    });
    let list = form.get('external_proccesses') as FormArray;
    this.subscribeExternalProcesses(external, form, list);
    return external;
  },

  subscribeExternalProcesses( external: FormGroup, form:FormGroup, list: FormArray){
    external.get('q_unit').valueChanges.subscribe(value => {
      let q_total = external.get('q_total').value;
      let unit_cost = external.get('unit_cost').value;
      let result = value * q_total * unit_cost;
      external.patchValue({
        total: result
      });
    });
    external.get('q_total').valueChanges.subscribe(value => {
      let q_unit = external.get('q_unit').value;
      let unit_cost = external.get('unit_cost').value;
      let result = q_unit * value * unit_cost;
      external.patchValue({
        total: result
      });
    });
    external.get('unit_cost').valueChanges.subscribe(value => {
      let q_unit = external.get('q_unit').value;
      let q_total = external.get('q_total').value;
      let result = q_unit * q_total * value;
      external.patchValue({
        total: result
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

  subtotalExternalProcesses(list: FormArray, form: FormGroup){
    setTimeout(() => {
      let total = 
      list.value.reduce(
        (a, b) => {
          return  a + b.total
        },0
      );
      form.patchValue({
        external_proccesses_subtotal: total
      }) 
    }, 100);
  }

};