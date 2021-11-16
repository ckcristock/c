import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

export const machineToolHelper = {

  createFillInMachineTools(form: FormGroup, fb: FormBuilder, data) {
    if (data.machine) {
      let machine_tools = form.get('machine_tools') as FormArray;
      data.machine.forEach((r) => {
        let group = fb.group({
          description: [r.description],
          unit: [r.unit],
          amount: [r.amount],
          unit_cost: [r.unit_cost],
          total: [r.total]
        });
        this.subscribeMachine(group, form, machine_tools);
        machine_tools.push(group);
      });
    }
  },

  createMachineToolGroup(form:FormGroup, fb: FormBuilder) {
    let machine = fb.group({
      description: [''],
      unit: [''],
      amount: [0],
      unit_cost: [0],
      total: [0]
    });
    let list = form.get('machine_tools') as FormArray;
    this.subscribeMachine(machine, form, list);
    return machine;
  },

  subscribeMachine( machine: FormGroup, form:FormGroup, list: FormArray){
    machine.get('amount').valueChanges.subscribe(value => {
      let unit_cost = machine.get('unit_cost').value;
      machine.patchValue({
        total: unit_cost * value
      })
    });
    machine.get('unit_cost').valueChanges.subscribe(value => {
      let amount = machine.get('amount').value;
      machine.patchValue({
        total: value * amount
      })
    });
    machine.get('total').valueChanges.subscribe(value => {
      this.subtotalMachine(list, form);
    })
  },

  subtotalMachine(list: FormArray, form: FormGroup){
    setTimeout(() => {
      let total = 
      list.value.reduce(
        (a, b) => {
          return  a + b.total
        },0
      );
      form.patchValue({
        machine_tools_subtotal: total
      }) 
    }, 100);
  }

};