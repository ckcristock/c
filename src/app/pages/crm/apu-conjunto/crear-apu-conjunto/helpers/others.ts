import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

export const othersHelper = {

  createFillInOthers(form: FormGroup, fb: FormBuilder, data) {
    if (data.other) {
      let others = form.get('others') as FormArray;
      data.other.forEach((r) => {
        let group = fb.group({
          description: [r.description],
          unit: [r.unit],
          amount: [r.amount],
          unit_cost: [r.unit_cost],
          total: [r.total]
        });
        this.subscribeOthers(group, form, others);
        others.push(group);
      });
    }
  },

  createOthersGroup(form: FormGroup, fb: FormBuilder) {
    let others = fb.group({
      description: [''],
      unit: [''],
      amount: [0],
      unit_cost: [0],
      total: [0]
    });
    let list = form.get('others') as FormArray;
    this.subscribeOthers(others, form, list);
    return others;
  },

  subscribeOthers( others: FormGroup, form:FormGroup, list: FormArray){
    others.get('amount').valueChanges.subscribe(value => {
      let unit_cost = others.get('unit_cost');
      let result = (typeof unit_cost.value == 'number' && typeof value == 'number' ? (unit_cost.value * value) : 0)
      others.patchValue({
        total: Math.round(result)
      })
    });
    others.get('unit_cost').valueChanges.subscribe(value => {
      let amount = others.get('amount');
      let result = (typeof amount.value == 'number' && typeof value == 'number' ? (value * amount.value) : 0)
      others.patchValue({
        total: Math.round(result)
      })
    });
    others.get('total').valueChanges.subscribe(value => {
      this.subtotalOthers(list, form);
    })
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