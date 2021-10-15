import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

export const transporteHelper = {
  createFillTransport(form: FormGroup, fb: FormBuilder, data) {
    if (data.transports) {
      let transports = form.get('transporte') as FormArray;
      data.transports.forEach((r) => {
        let group = fb.group({
          ticket_payment: [r.ticket_payment],
          type: [r.type],
          journey: [r.journey],
          company: [r.company],
          departure_date: [r.departure_date],
          ticket_value: [r.ticket_value],
        });
        this.createListener(group, form, transports);
        transports.push(group);
      });
      this.getTotal(form,transports)
    }
  },

  createGroup(fb: FormBuilder): FormGroup {
    return fb.group({
      type: ['Ida'],
      journey: [],
      company: [],
      ticket_payment: [],
      departure_date: [],
      ticket_value: [0],
    });
  },
  createListener(group: FormGroup, form: FormGroup, list: FormArray) {
    group.get('ticket_value').valueChanges.subscribe((value) => {
      this.getTotal(form, list);
    });
    group.get('ticket_payment').valueChanges.subscribe((value) => {
      if (value == 'Agencia') {
        form.patchValue({
          total_transports_cop: 0
        })
      } else {
        this.getTotal(form, list);
      }
    });
  },

  getTotal(form: FormGroup, list: FormArray) {
    setTimeout(() => {
      let total = list.controls.reduce((a, b) => {
        return a + b.value.ticket_value;
      }, 0);
      form.patchValue({
        total_transports_cop: total,
      });
    }, 50);
  },
};
