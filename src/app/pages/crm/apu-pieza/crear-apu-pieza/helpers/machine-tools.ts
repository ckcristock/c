import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

export const machineToolHelper = {
  consts: {},

  createFillInMachineTools(form: FormGroup, fb: FormBuilder, data) {
    if (data.machine) {
      let machine_tools = form.get('machine_tools') as FormArray;
      data?.machine.forEach((r) => {
        let group = fb.group({
          description: [r?.description],
          name_description: [r?.machine?.name],
          unit_id: [r?.unit_id],
          unit_name: [r?.unit?.name],
          q_unit: [r?.q_unit],
          q_total: [r?.q_total],
          unit_cost: [r?.unit_cost],
          total: [r?.total]
        });
        this.subscribeMachine(group, form, machine_tools);
        machine_tools.push(group);
      });
    }
  },

  createMachineToolGroup(form: FormGroup, fb: FormBuilder, element) {
    let amount = form.get('amount').value;
    let machine = fb.group({
      description: [element?.value],
      name_description: [element?.text],
      unit_id: [element?.unit_id],
      unit_name: [element?.unit?.name],
      q_unit: [0],
      q_total: [amount],
      unit_cost: [element?.unit_cost],
      total: [0]
    });
    let list = form.get('machine_tools') as FormArray;
    this.subscribeMachine(machine, form, list);
    return machine;
  },

  subscribeMachine(machine: FormGroup, form: FormGroup, list: FormArray) {
    machine.get('q_unit').valueChanges.subscribe(value => {
      let q_total = machine.get('q_total').value;
      let unit_cost = machine.get('unit_cost').value;
      let result = value * q_total * unit_cost;
      machine.patchValue({
        total: Math.round(result)
      });
    });
    machine.get('q_total').valueChanges.subscribe(value => {
      let q_unit = machine.get('q_unit').value;
      let unit_cost = machine.get('unit_cost').value;
      let result = q_unit * value * unit_cost;
      machine.patchValue({
        total: Math.round(result)
      });
    });
    machine.get('unit_cost').valueChanges.subscribe(value => {
      let q_unit = machine.get('q_unit').value;
      let q_total = machine.get('q_total').value;
      let result = q_unit * q_total * value;
      machine.patchValue({
        total: Math.round(result)
      });
    });
    machine.get('total').valueChanges.subscribe(value => {
      this.subtotalMachine(list, form)
    });
    form.get('amount').valueChanges.subscribe(value => {
      machine.patchValue({
        q_total: value
      })
    });
  },

  subtotalMachine(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total =
        list.value.reduce(
          (a, b) => {
            return a + b.total
          }, 0
        );
      form.patchValue({
        machine_tools_subtotal: total
      })
    }, 100);
  }

};
