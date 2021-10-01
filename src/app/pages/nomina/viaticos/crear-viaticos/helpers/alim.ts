import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

export const alimHelper = {
  createFillHotel(form: FormGroup, fb: FormBuilder, data) {
    if (data.feedings) {
      let feeding = form.get('feeding') as FormArray;
      data.feedings.forEach((r) => {
        let group = fb.group({
          type: [r.type],
          breakfast: [r.breakfast],
          stay: [r.stay],
          rate: [r.rate,Validators.required],
          total: [r.total],
        });
        this.createListener(group, form, feeding);
        feeding.push(group);
      });
      this.getTotal(form, feeding);
    }
  },
  createGroup(fb: FormBuilder, form: FormGroup): FormGroup {
    return fb.group({
      type: ['Seleccione',Validators.required],
      breakfast: ['',Validators.required],
      stay: [0],
      rate: [0],
      total: [0],
    });
  },
  createListener(group: FormGroup, form: FormGroup, list: FormArray) {
    group.get('rate').valueChanges.subscribe((value) => {
      let feeding = group.value;
      let totalFeeding = value * feeding.stay;
      group.patchValue({
        total: totalFeeding,
      });
    });
    group.get('stay').valueChanges.subscribe((value) => {
      let feeding = group.value;
      let totalFeeding = value * feeding.rate;
      group.patchValue({
        total: totalFeeding,
      });
      this.getTotal(form, list);
    });
    return group;
  },
  getTotal(form: FormGroup, list: FormArray) {
    let total = list.value.reduce(
      (a, b) => {
        if (b.type == 'Nacional') {
          return { inter: a.inter, nac: a.nac + b.total };
        }
        return { nac: a.nac, inter: a.inter + b.total };
      },
      { nac: 0, inter: 0 }
    );

    form.patchValue({
      total_feedings_cop: total.nac,
      total_feedings_usd: total.inter,
    });
  },
};
