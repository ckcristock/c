import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

export const externalProcessesHelper = {
  consts: {},

  createFillInExternal(form: FormGroup, fb: FormBuilder, data) {
    if (data.external) {
      let external_proccesses = form.get('external_processes') as FormArray;
      data.external.forEach((r) => {
        let group = fb.group({
          description: [r.description],
          name_description: [r.external.name],
          unit_id: [r.unit_id],
          unit_name: [r.unit.name],
          amount: [r.amount],
          unit_cost: [r.unit_cost],
          total: [r.total]
        });
        this.subscribeExternalProcesses(group, form, external_proccesses);
        external_proccesses.push(group);
      });
    }
  },

  createExternalProcessesGroup(form:FormGroup, fb: FormBuilder, element) {
    let external = fb.group({
      description: [element.value],
      name_description: [element.text],
      unit_id: [element.unit_id],
      unit_name: [element.unit.name],
      amount: [0],
      unit_cost: [element.unit_cost],
      total: [0]
    });
    let list = form.get('external_processes') as FormArray;
    this.subscribeExternalProcesses(external, form, list);
    return external;
  },

  subscribeExternalProcesses( external: FormGroup, form:FormGroup, list: FormArray){
    external.get('amount').valueChanges.subscribe(value => {
      let unit_cost = external.get('unit_cost');
      let result = (typeof unit_cost.value == 'number' && typeof value == 'number' ? (unit_cost.value * value) : 0)
      external.patchValue({
        total: Math.round(result)
      })
    });
    external.get('unit_cost').valueChanges.subscribe(value => {
      let amount = external.get('amount');
      let result = (typeof amount.value == 'number' && typeof value == 'number' ? (value * amount.value) : 0)
      external.patchValue({
        total: Math.round(result)
      })
    });
    external.get('total').valueChanges.subscribe(value => {
      this.subtotalExternalProcesses(list, form);
    })
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
        external_processes_subtotal: total
      })
    }, 100);
  }

};
