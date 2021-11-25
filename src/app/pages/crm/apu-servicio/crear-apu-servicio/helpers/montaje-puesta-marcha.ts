import {
    FormGroup,
    FormBuilder,
    FormArray
  } from '@angular/forms';
  
  export const mypmHelper = {
  
    createFillInMpym(form: FormGroup, fb: FormBuilder, data) {
      if (data.assembly_commissioning) {
        let list = form.get('assembly_commissioning') as FormArray;
        data.other.forEach((r) => {
          let group = fb.group({
            description: [r.description],
            unit: [r.unit],
            amount: [r.amount],
            unit_cost: [r.unit_cost],
            total: [r.total]
          });
          this.subscribeMypm(group, form, list);
          list.push(group);
        });
      }
    },
  
    createMypmGroup(form: FormGroup, fb: FormBuilder) {
      let group = fb.group({
        description: [''],
        unit: [''],
        amount: [0],
        unit_cost: [0],
        total: [0]
      });
      let list = form.get('assembly_commissioning') as FormArray;
      this.subscribeMypm(group, form, list);
      return group;
    },
  
    subscribeMypm( group: FormGroup, form:FormGroup, list: FormArray){
      
    },
  
    subtotalMypm(list: FormArray, form: FormGroup){
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