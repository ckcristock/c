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
          unit: [r.unit],
          amount: [r.amount],
          unit_cost: [r.unit_cost],
          total: [r.total]
        });
        this.subscribeExternalProcesses(group, form, external_proccesses);
        external_proccesses.push(group);
      });
    }
  },

  createExternalProcessesGroup(form:FormGroup, fb: FormBuilder) {
    let external = fb.group({
      description: [''],
      unit: [''],
      amount: [0],
      unit_cost: [0],
      total: [0]
    });
    let list = form.get('external_processes') as FormArray;
    this.subscribeExternalProcesses(external, form, list);
    return external;
  },

  subscribeExternalProcesses( external: FormGroup, form:FormGroup, list: FormArray){
    external.get('amount').valueChanges.subscribe(value => {
      let unit_cost = external.get('unit_cost').value;
      external.patchValue({
        total: Math.round(unit_cost * value)
      })
    });
    external.get('unit_cost').valueChanges.subscribe(value => {
      let amount = external.get('amount').value;
      external.patchValue({
        total: Math.round(value * amount)
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