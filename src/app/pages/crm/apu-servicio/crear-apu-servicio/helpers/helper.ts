import { FormGroup, FormBuilder } from '@angular/forms';
import { cmoHelper } from './calculo-mano-obra';
import { mpmCalculateLaborHelper } from './mp-calculo-mano-obra';

export const functionsApuService = {
  consts: {
    retefuente_percentage: []
  },

  fillInForm(form: FormGroup, data, fb: FormBuilder, profiles, cities) {
    form.patchValue({
      name: data.name,
      city_id: data.city.id,
      person_id: data.person_id,
      third_party_id: data.third_party_id,
      line: data.line,
      observation: data.observation,
      administrative_percentage: data.administrative_percentage,
      administrative_value: data.administrative_value,
      general_subtotal_travel_expense_labor: data.general_subtotal_travel_expense_labor,
      sale_price_cop_withholding_total: data.sale_price_cop_withholding_total,
      sale_price_usd_withholding_total: data.sale_price_usd_withholding_total,
      subtotal_administrative_unforeseen: data.subtotal_administrative_unforeseen,
      subtotal_administrative_unforeseen_utility: data.subtotal_administrative_unforeseen_utility,
      subtotal_assembly_commissioning: data.subtotal_assembly_commissioning,
      subtotal_dimensional_validation: data.subtotal_dimensional_validation,
      subtotal_labor: data.subtotal_labor,
      subtotal_labor_mpm: data.subtotal_labor_mpm,
      subtotal_travel_expense: data.subtotal_travel_expense,
      subtotal_travel_expense_mpm: data.subtotal_travel_expense_mpm,
      unforeseen_percentage: data.unforeseen_percentage,
      unforeseen_value: data.unforeseen_value,
      utility_percentage: data.utility_percentage,
      trm: data.trm
    });
    cmoHelper.createFillIncmo(form, fb, data, profiles, cities);
    mpmCalculateLaborHelper.createFillInMpm(form, fb, data, profiles, cities)
    this.subscribes(form)
  },

  createForm(fb: FormBuilder, clients:Array<any>) {
    let group = fb.group({
      name: [''],
      city_id: [''],
      person_id: [''],
      third_party_id:[''],
      line: [''],
      observation: [''],
      subtotal_labor: [0],
      subtotal_labor_mpm: [0],
      subtotal_travel_expense: [0],
      subtotal_travel_expense_mpm: [0],
      subtotal_dimensional_validation: [0],
      subtotal_assembly_commissioning: [0],
      general_subtotal_travel_expense_labor: [0],
      administrative_percentage: [0],
      administrative_value: [0],
      unforeseen_percentage: [0],
      unforeseen_value: [0],
      utility_percentage: [0],
      subtotal_administrative_unforeseen: [0],
      subtotal_administrative_unforeseen_utility: [0],
      sale_price_cop_withholding: [0],
      trm: [0],
      sale_price_usd_withholding_total: [0],
      sale_price_cop_withholding_total: [0],
      calculate_labor: fb.array([]),
      mpm_calculate_labor: fb.array([])
    });
    this.subscribes(group)
    return group;
  },

  totalMasRetencion(group: FormGroup, clients:Array<any>){
    group.get('third_party_id').valueChanges.subscribe(value => {
      let data = clients.find(c => c.value == value);
      this.consts.retefuente_percentage = data.retefuente_percentage;
      let subtotal_administrative_unforeseen_utility = group.get('subtotal_administrative_unforeseen_utility');
      let result = subtotal_administrative_unforeseen_utility.value / ( 1 - (this.consts.retefuente_percentage / 100));
      group.patchValue({sale_price_cop_withholding_total: Math.round(result)})
    });
    group.get('subtotal_administrative_unforeseen_utility').valueChanges.subscribe(value => {
      let result = value / ( 1 - (this.consts.retefuente_percentage / 100));
      group.patchValue({sale_price_cop_withholding_total: Math.round(result)});
    });
  },

  subscribes(form: FormGroup, ){
    form.get('subtotal_labor').valueChanges.subscribe(value => {
      let subtotal_travel_expense = form.get('subtotal_travel_expense')
      let result = (value + subtotal_travel_expense.value);
      form.patchValue({ subtotal_dimensional_validation: Math.round(result) })
    });
    form.get('subtotal_travel_expense').valueChanges.subscribe(value => {
      let subtotal_labor = form.get('subtotal_labor')
      let result = (subtotal_labor.value + value);
      form.patchValue({ subtotal_dimensional_validation: Math.round(result) })
    });
    form.get('subtotal_labor_mpm').valueChanges.subscribe(value => {
      let subtotal_travel_expense_mpm = form.get('subtotal_travel_expense_mpm')
      let result = (value + subtotal_travel_expense_mpm.value);
      form.patchValue({ subtotal_assembly_commissioning: Math.round(result) })
    });
    form.get('subtotal_travel_expense_mpm').valueChanges.subscribe(value => {
      let subtotal_labor_mpm = form.get('subtotal_labor_mpm')
      let result = (subtotal_labor_mpm.value + value);
      form.patchValue({ subtotal_assembly_commissioning: Math.round(result) })
    });
    form.get('subtotal_assembly_commissioning').valueChanges.subscribe(value => {
      let subtotal_dimensional_validation = form.get('subtotal_dimensional_validation')
      let result = (value + subtotal_dimensional_validation.value);
      form.patchValue({ general_subtotal_travel_expense_labor: Math.round(result) })
    })
    form.get('subtotal_dimensional_validation').valueChanges.subscribe(value => {
      let subtotal_assembly_commissioning = form.get('subtotal_assembly_commissioning')
      let result = (subtotal_assembly_commissioning.value + value);
      form.patchValue({ general_subtotal_travel_expense_labor: Math.round(result) })
    })
    /********* AUI **********/
    form.get('administrative_percentage').valueChanges.subscribe(value => {
      let general_subtotal_travel_expense_labor = form.get('general_subtotal_travel_expense_labor')
      let result = (general_subtotal_travel_expense_labor.value * (value / 100));
      form.patchValue({ administrative_value: Math.round(result) })
    });
    form.get('unforeseen_percentage').valueChanges.subscribe(value => {
      let general_subtotal_travel_expense_labor = form.get('general_subtotal_travel_expense_labor')
      let result = (general_subtotal_travel_expense_labor.value * (value / 100));
      form.patchValue({ unforeseen_value: Math.round(result) })
    });
    form.get('general_subtotal_travel_expense_labor').valueChanges.subscribe(value => {
      let administrative_percentage = form.get('administrative_percentage')
      let unforeseen_percentage = form.get('unforeseen_percentage')
      let resultAdministrative = (value * (administrative_percentage.value / 100));
      let resultUnforeseen = (value * (unforeseen_percentage.value / 100));
      form.patchValue({ 
        administrative_value: Math.round(resultAdministrative), 
        unforeseen_value: Math.round(resultUnforeseen)
      })
    });
    form.get('administrative_value').valueChanges.subscribe(value => {
      let general_subtotal_travel_expense_labor = form.get('general_subtotal_travel_expense_labor')
      let unforeseen_value = form.get('unforeseen_value')
      let result = (general_subtotal_travel_expense_labor.value + value + unforeseen_value.value)
      form.patchValue({ subtotal_administrative_unforeseen: Math.round(result) })
    })
    form.get('unforeseen_value').valueChanges.subscribe(value => {
      let general_subtotal_travel_expense_labor = form.get('general_subtotal_travel_expense_labor')
      let administrative_value = form.get('administrative_value')
      let result = (general_subtotal_travel_expense_labor.value + administrative_value.value + value)
      form.patchValue({ subtotal_administrative_unforeseen: Math.round(result) })
    })
    form.get('subtotal_administrative_unforeseen').valueChanges.subscribe(value => {
      let utility_percentage = form.get('utility_percentage')
      let result = (value / (1 - (utility_percentage.value / 100)))
      form.patchValue({ subtotal_administrative_unforeseen_utility: Math.round(result) })
    });
    form.get('utility_percentage').valueChanges.subscribe(value => {
      let subtotal_administrative_unforeseen = form.get('subtotal_administrative_unforeseen')
      let result = (subtotal_administrative_unforeseen.value / (1 - (value / 100)))
      form.patchValue({ subtotal_administrative_unforeseen_utility: Math.round(result) })
    });
    form.get('sale_price_cop_withholding_total').valueChanges.subscribe(value => {
      let trm = form.get('trm')
      let result = (value / trm.value);
      form.patchValue({ sale_price_usd_withholding_total: Math.round(result) })
    })
    form.get('trm').valueChanges.subscribe(value => {
      let sale_price_cop_withholding_total = form.get('sale_price_cop_withholding_total')
      let result = (sale_price_cop_withholding_total.value / value);
      form.patchValue({ sale_price_usd_withholding_total: Math.round(result) })
    });
  },

};
