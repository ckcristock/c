import { FormGroup, FormBuilder } from '@angular/forms';

export const functionsApuService = {
  consts: {
    retefuente_percentage: []
  },

  fillInForm(form: FormGroup, data, fb: FormBuilder) {
    form.patchValue({
      name: data.name,
      city_id: data.city.id,
      person_id: data.person_id,
      third_party_id: data.third_party_id,
      line: data.line,
      observation: data.observation
    });
    this.subscribes(form)
  },

  createForm(fb: FormBuilder) {
    let group = fb.group({
      name: [''],
      city_id: [''],
      person_id: [''],
      third_party_id:[''],
      line: [''],
      observation: [''],
    });
    this.subscribes(group)
    return group;
  },

  totalMasRetencion(group: FormGroup, clients:Array<any>){
    /* group.get('third_party_id').valueChanges.subscribe(value => {
      let data = clients.find(c => c.value == value);
      this.consts.retefuente_percentage = data.retefuente_percentage;
      let admin_unforeseen_utility_subtotal = group.get('admin_unforeseen_utility_subtotal');
      let result = admin_unforeseen_utility_subtotal.value / ( 1 - (this.consts.retefuente_percentage / 100));
      group.patchValue({
        sale_price_cop_withholding_total: Math.round(result)
      })
    });
    group.get('admin_unforeseen_utility_subtotal').valueChanges.subscribe(value => {
      let result = value / ( 1 - (this.consts.retefuente_percentage / 100));
      group.patchValue({
        sale_price_cop_withholding_total: Math.round(result)
      });
    }); */
  },

  subscribes(group: FormGroup, clients:Array<any>){
    
  },

};
