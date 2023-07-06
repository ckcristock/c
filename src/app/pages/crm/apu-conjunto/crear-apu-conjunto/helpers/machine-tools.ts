import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

export const machineToolHelper = {

  createFillInMachineTools(form: FormGroup, fb: FormBuilder, data) {
    if (data?.machine) {
      let machine_tools = form?.get('machine_tools') as FormArray;
      data?.machine?.forEach((r) => {
        let group = fb?.group({
          description: [r?.description],
          name_description: [r?.machine?.name],
          unit_id: [r?.unit_id],
          unit_name: [r?.unit?.name],
          amount: [r?.amount],
          unit_cost: [r?.unit_cost],
          total: [r?.total]
        });
        this?.subscribeMachine(group, form, machine_tools);
        machine_tools?.push(group);
      });
    }
  },

  createMachineToolGroup(form: FormGroup, fb: FormBuilder, element) {
    let machine = fb?.group({
      description: [element?.value],
      name_description: [element?.text],
      unit_id: [element?.unit_id],
      unit_name: [element?.unit?.name],
      amount: [0],
      unit_cost: [element?.unit_cost],
      total: [0]
    });
    let list = form?.get('machine_tools') as FormArray;
    this?.subscribeMachine(machine, form, list);
    return machine;
  },

  subscribeMachine(machine: FormGroup, form: FormGroup, list: FormArray) {
    machine?.get('amount')?.valueChanges?.subscribe(value => {
      let unit_cost = machine?.get('unit_cost');
      let result = (typeof unit_cost?.value == 'number' && typeof value == 'number' ? (unit_cost?.value * value) : 0)
      machine?.patchValue({ total: Math?.round(result) })
    });
    machine?.get('unit_cost')?.valueChanges?.subscribe(value => {
      let amount = machine?.get('amount');
      let result = (typeof amount?.value == 'number' && typeof value == 'number' ? (value * amount?.value) : 0);
      machine?.patchValue({
        total: Math?.round(result)
      })
    });
    machine?.get('total')?.valueChanges?.subscribe(value => {
      this?.subtotalMachine(list, form);
    })
  },

  subtotalMachine(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total =
        list?.value?.reduce(
          (a, b) => {
            return a + b?.total
          }, 0
        );
      form?.patchValue({
        machine_tools_subtotal: total
      })
    }, 100);
  }

};
