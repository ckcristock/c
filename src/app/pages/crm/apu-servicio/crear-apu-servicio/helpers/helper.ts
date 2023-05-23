import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { cmoHelper } from './calculo-mano-obra';
import { mpmCalculateLaborHelper } from './mp-calculo-mano-obra';
import { apmCalculateLaborHelper } from './amp-calculo-mano-obra';
import { cApmCalculateLaborHelper } from './c-apm-cmo';
import { cVdCalculateLaborHelper } from './c-vd-cmo';
import { cMeCalculateLaborHelper } from './c-me-cmo';

export const functionsApuService = {
  consts: {
    retefuente_percentage: []
  },

  fillInForm(form: FormGroup, data, fb: FormBuilder, profiles, cities) {
    form?.patchValue({
      name: data?.name,
      city_id: data?.city?.id,
      person_id: data?.person_id,
      third_party_id: data?.third_party_id,
      line: data?.line,
      observation: data?.observation,
      administrative_percentage: data?.administrative_percentage,
      administrative_value: data?.administrative_value,
      general_subtotal_travel_expense_labor: data?.general_subtotal_travel_expense_labor,
      general_subtotal_travel_expense_labor_c: data?.general_subtotal_travel_expense_labor_c,
      total_unit_cost: data?.total_unit_cost,
      sale_price_cop_withholding_total: data?.sale_price_cop_withholding_total,
      sale_price_usd_withholding_total: data?.sale_price_usd_withholding_total,
      subtotal_administrative_unforeseen: data?.subtotal_administrative_unforeseen,
      subtotal_administrative_unforeseen_utility: data?.subtotal_administrative_unforeseen_utility,
      subtotal_assembly_commissioning: data?.subtotal_assembly_commissioning,
      subtotal_accompaniment: data?.subtotal_accompaniment,
      subtotal_dimensional_validation: data?.subtotal_dimensional_validation,
      subtotal_labor: data?.subtotal_labor,
      subtotal_labor_mpm: data?.subtotal_labor_mpm,
      subtotal_labor_apm: data?.subtotal_labor_apm,
      subtotal_travel_expense: data?.subtotal_travel_expense,
      subtotal_travel_expense_mpm: data?.subtotal_travel_expense_mpm,
      subtotal_travel_expense_apm: data?.subtotal_travel_expense_apm,
      //! Contratistas
      subtotal_travel_expense_vd_c: data?.subtotal_travel_expense_vd_c,
      subtotal_travel_expense_me_c: data?.subtotal_travel_expense_me_c,
      subtotal_travel_expense_apm_c: data?.subtotal_travel_expense_apm_c,
      subtotal_dimensional_validation_c: data?.subtotal_dimensional_validation_c,
      subtotal_assembly_c: data?.subtotal_assembly_c,
      subtotal_accompaniment_c: data?.subtotal_accompaniment_c,
      //! Fin contratistas
      unforeseen_percentage: data?.unforeseen_percentage,
      unforeseen_value: data?.unforeseen_value,
      utility_percentage: data?.utility_percentage,
      trm: data?.trm,
      set_name: data?.set_name,
      machine_name: data?.machine_name
    });
    cmoHelper?.createFillIncmo(form, fb, data, profiles, cities);
    mpmCalculateLaborHelper?.createFillInMpm(form, fb, data, profiles, cities)
    apmCalculateLaborHelper?.createFillInApm(form, fb, data, profiles, cities)
    cApmCalculateLaborHelper?.createFillInCApm(form, fb, data, profiles, cities)
    cVdCalculateLaborHelper?.createFillInCVd(form, fb, data, profiles, cities)
    cMeCalculateLaborHelper?.createFillInCMe(form, fb, data, profiles, cities)
    this?.subscribes(form)
  },

  createForm(fb: FormBuilder, clients: Array<any>, user_id, calculationBase) {
    let group = fb?.group({
      name: ['', [Validators?.required, Validators.maxLength(191)]],
      city_id: [null, Validators?.required],
      person_id: [user_id],
      third_party_id: [null, Validators?.required],
      line: ['', [Validators?.required, Validators.maxLength(191)]],
      observation: ['', Validators.maxLength(65535)],
      subtotal_labor: [0],
      subtotal_labor_mpm: [0],
      subtotal_labor_apm: [0],
      subtotal_travel_expense: [0],
      subtotal_travel_expense_mpm: [0],
      subtotal_travel_expense_apm: [0],
      //! Contratistas
      subtotal_travel_expense_vd_c: [0],
      subtotal_travel_expense_me_c: [0],
      subtotal_travel_expense_apm_c: [0],
      subtotal_dimensional_validation_c: [0],
      subtotal_assembly_c: [0],
      subtotal_accompaniment_c: [0],
      //! Fin contratistas
      subtotal_dimensional_validation: [0],
      subtotal_assembly_commissioning: [0],
      subtotal_accompaniment: [0],
      general_subtotal_travel_expense_labor: [0],
      general_subtotal_travel_expense_labor_c: [0],
      total_unit_cost: [0],
      administrative_percentage: [calculationBase?.administration_percentage?.value],
      administrative_value: [0],
      unforeseen_percentage: [calculationBase?.unforeseen_percentage?.value],
      unforeseen_value: [0],
      utility_percentage: [calculationBase?.utility_percentage?.value],
      subtotal_administrative_unforeseen: [0],
      subtotal_administrative_unforeseen_utility: [0],
      sale_price_cop_withholding: [0],
      trm: [calculationBase?.trm?.value],
      sale_price_usd_withholding_total: [0],
      sale_price_cop_withholding_total: [0],
      calculate_labor: fb?.array([]),
      mpm_calculate_labor: fb?.array([]),
      apm_calculate_labor: fb?.array([]),
      c_apm_calculate_labor: fb?.array([]),
      c_vd_calculate_labor: fb?.array([]),
      c_me_calculate_labor: fb?.array([]),
      format_code: [''],
      code: [''],
      set_name: ['', Validators?.maxLength(255)],
      machine_name: ['', Validators?.maxLength(255)]
    });
    this?.subscribes(group)
    return group;
  },

  cityRetention(group: FormGroup, cities: Array<any>) {
    group?.get('city_id')?.valueChanges?.subscribe(value => {
      let data = cities?.find(c => c?.value == value);
      if (data) {
        let subtotal_administrative_unforeseen_utility = group?.get('subtotal_administrative_unforeseen_utility');
        let result = subtotal_administrative_unforeseen_utility?.value / (1 - (data?.percentage_service / 100));
        group?.patchValue({
          sale_price_cop_withholding_total: Math?.round(result)
        })
      }
    });
    group?.get('subtotal_administrative_unforeseen_utility')?.valueChanges?.subscribe(value => {
      let city = group?.get('city_id');
      let data = cities?.find(c => c?.value == city?.value);
      if (data) {
        let result = value / (1 - (data?.percentage_service / 100));
        group?.patchValue({
          sale_price_cop_withholding_total: Math?.round(result)
        });
      }
    });
  },

  subscribes(form: FormGroup,) {
    form?.get('subtotal_labor')?.valueChanges?.subscribe(value => {
      let subtotal_travel_expense = form?.get('subtotal_travel_expense')
      let result = (value + subtotal_travel_expense?.value);
      form?.patchValue({ subtotal_dimensional_validation: Math?.round(result) })
    });
    form?.get('subtotal_travel_expense')?.valueChanges?.subscribe(value => {
      let subtotal_labor = form?.get('subtotal_labor')
      let result = (subtotal_labor?.value + value);
      form?.patchValue({ subtotal_dimensional_validation: Math?.round(result) })
    });
    form?.get('subtotal_labor_mpm')?.valueChanges?.subscribe(value => {
      let subtotal_travel_expense_mpm = form?.get('subtotal_travel_expense_mpm')
      let result = (value + subtotal_travel_expense_mpm?.value);
      form?.patchValue({ subtotal_assembly_commissioning: Math?.round(result) })
    });
    form?.get('subtotal_travel_expense_mpm')?.valueChanges?.subscribe(value => {
      let subtotal_labor_mpm = form?.get('subtotal_labor_mpm')
      let result = (subtotal_labor_mpm?.value + value);
      form?.patchValue({ subtotal_assembly_commissioning: Math?.round(result) })
    });
    form?.get('subtotal_labor_apm')?.valueChanges?.subscribe(value => {
      let subtotal_travel_expense_apm = form?.get('subtotal_travel_expense_apm')
      let result = (value + subtotal_travel_expense_apm?.value);
      form?.patchValue({ subtotal_accompaniment: Math?.round(result) })
    });
    form?.get('subtotal_travel_expense_apm')?.valueChanges?.subscribe(value => {
      let subtotal_labor_apm = form?.get('subtotal_labor_apm')
      let result = (subtotal_labor_apm?.value + value);
      form?.patchValue({ subtotal_accompaniment: Math?.round(result) })
    });
    //! Inicio contratistas
    form?.get('subtotal_travel_expense_apm_c')?.valueChanges?.subscribe(value => {
      let result = (value);
      form?.patchValue({ subtotal_accompaniment_c: Math?.round(result) })
    });
    //!
    form?.get('subtotal_travel_expense_vd_c')?.valueChanges?.subscribe(value => {
      let result = (value);
      form?.patchValue({ subtotal_dimensional_validation_c: Math?.round(result) })
    });
    //!
    form?.get('subtotal_travel_expense_me_c')?.valueChanges?.subscribe(value => {
      let result = (value);
      form?.patchValue({ subtotal_assembly_c: Math?.round(result) })
    });
    //! Fin contratistas
    //!sumar subtotal_accompaniment
    form?.get('subtotal_assembly_commissioning')?.valueChanges?.subscribe(value => {
      let subtotal_dimensional_validation = form?.get('subtotal_dimensional_validation')
      let subtotal_accompaniment = form?.get('subtotal_accompaniment')
      let result = (value + subtotal_dimensional_validation?.value + subtotal_accompaniment?.value);
      form?.patchValue({ general_subtotal_travel_expense_labor: Math?.round(result) })
    })
    form?.get('subtotal_dimensional_validation')?.valueChanges?.subscribe(value => {
      let subtotal_assembly_commissioning = form?.get('subtotal_assembly_commissioning')
      let subtotal_accompaniment = form?.get('subtotal_accompaniment')
      let result = (subtotal_assembly_commissioning?.value + subtotal_accompaniment?.value + value);
      form?.patchValue({ general_subtotal_travel_expense_labor: Math?.round(result) })
    })
    form?.get('subtotal_accompaniment')?.valueChanges?.subscribe(value => {
      let subtotal_assembly_commissioning = form?.get('subtotal_assembly_commissioning')
      let subtotal_dimensional_validation = form?.get('subtotal_dimensional_validation')
      let result = (subtotal_assembly_commissioning?.value + subtotal_dimensional_validation?.value + value);
      form?.patchValue({ general_subtotal_travel_expense_labor: Math?.round(result) })
    })

    //!contratistas subtotal_accompaniment_c subtotal_assembly_c subtotal_dimensional_validation_c
    form?.get('subtotal_assembly_c')?.valueChanges?.subscribe(value => {
      let subtotal_dimensional_validation_c = form?.get('subtotal_dimensional_validation_c')
      let subtotal_accompaniment_c = form?.get('subtotal_accompaniment_c')
      let result = (value + subtotal_dimensional_validation_c?.value + subtotal_accompaniment_c?.value);
      form?.patchValue({ general_subtotal_travel_expense_labor_c: Math?.round(result) })
    })
    form?.get('subtotal_dimensional_validation_c')?.valueChanges?.subscribe(value => {
      let subtotal_assembly_c = form?.get('subtotal_assembly_c')
      let subtotal_accompaniment_c = form?.get('subtotal_accompaniment_c')
      let result = (subtotal_assembly_c?.value + subtotal_accompaniment_c?.value + value);
      form?.patchValue({ general_subtotal_travel_expense_labor_c: Math?.round(result) })
    })
    form?.get('subtotal_accompaniment_c')?.valueChanges?.subscribe(value => {
      let subtotal_assembly_c = form?.get('subtotal_assembly_c')
      let subtotal_dimensional_validation_c = form?.get('subtotal_dimensional_validation_c')
      let result = (subtotal_assembly_c?.value + subtotal_dimensional_validation_c?.value + value);
      form?.patchValue({ general_subtotal_travel_expense_labor_c: Math?.round(result) })
    })


    /********* AUI **********/
    form?.get('administrative_percentage')?.valueChanges?.subscribe(value => {
      let general_subtotal_travel_expense_labor = form?.get('general_subtotal_travel_expense_labor')
      let general_subtotal_travel_expense_labor_c = form?.get('general_subtotal_travel_expense_labor_c')
      let result = ((general_subtotal_travel_expense_labor?.value + general_subtotal_travel_expense_labor_c?.value) * (value / 100));
      form?.patchValue({ administrative_value: Math?.round(result) })
    });
    form?.get('unforeseen_percentage')?.valueChanges?.subscribe(value => {
      let general_subtotal_travel_expense_labor = form?.get('general_subtotal_travel_expense_labor')
      let general_subtotal_travel_expense_labor_c = form?.get('general_subtotal_travel_expense_labor_c')
      let result = ((general_subtotal_travel_expense_labor?.value + general_subtotal_travel_expense_labor_c?.value) * (value / 100));
      form?.patchValue({ unforeseen_value: Math?.round(result) })
    });
    form?.get('general_subtotal_travel_expense_labor')?.valueChanges?.subscribe(value => {
      let administrative_percentage = form?.get('administrative_percentage')
      let unforeseen_percentage = form?.get('unforeseen_percentage')
      let general_subtotal_travel_expense_labor_c = form?.get('general_subtotal_travel_expense_labor_c')
      let total_unit_cost = value + general_subtotal_travel_expense_labor_c?.value;
      let resultAdministrative = ((total_unit_cost) * (administrative_percentage?.value / 100));
      let resultUnforeseen = ((total_unit_cost) * (unforeseen_percentage?.value / 100));
      form?.patchValue({
        administrative_value: Math?.round(resultAdministrative),
        unforeseen_value: Math?.round(resultUnforeseen),
        total_unit_cost: Math?.round(total_unit_cost)
      })
    });
    form?.get('general_subtotal_travel_expense_labor_c')?.valueChanges?.subscribe(value => {
      let administrative_percentage = form?.get('administrative_percentage')
      let unforeseen_percentage = form?.get('unforeseen_percentage')
      let general_subtotal_travel_expense_labor = form?.get('general_subtotal_travel_expense_labor')
      let total_unit_cost = value + general_subtotal_travel_expense_labor?.value;
      let resultAdministrative = ((total_unit_cost) * (administrative_percentage?.value / 100));
      let resultUnforeseen = ((total_unit_cost) * (unforeseen_percentage?.value / 100));
      form?.patchValue({
        administrative_value: Math?.round(resultAdministrative),
        unforeseen_value: Math?.round(resultUnforeseen),
        total_unit_cost: Math?.round(total_unit_cost)
      })
    });
    form?.get('administrative_value')?.valueChanges?.subscribe(value => {
      let general_subtotal_travel_expense_labor = form?.get('general_subtotal_travel_expense_labor')
      let general_subtotal_travel_expense_labor_c = form?.get('general_subtotal_travel_expense_labor_c')
      let unforeseen_value = form?.get('unforeseen_value')
      let result = (general_subtotal_travel_expense_labor?.value + general_subtotal_travel_expense_labor_c?.value + value + unforeseen_value?.value)
      form?.patchValue({ subtotal_administrative_unforeseen: Math?.round(result) })
    })
    form?.get('unforeseen_value')?.valueChanges?.subscribe(value => {
      let general_subtotal_travel_expense_labor = form?.get('general_subtotal_travel_expense_labor')
      let general_subtotal_travel_expense_labor_c = form?.get('general_subtotal_travel_expense_labor_c')
      let administrative_value = form?.get('administrative_value')
      let result = (general_subtotal_travel_expense_labor?.value + general_subtotal_travel_expense_labor_c?.value + administrative_value?.value + value)
      form?.patchValue({ subtotal_administrative_unforeseen: Math?.round(result) })
    })
    form?.get('subtotal_administrative_unforeseen')?.valueChanges?.subscribe(value => {
      let utility_percentage = form?.get('utility_percentage')
      let result = (value / (1 - (utility_percentage?.value / 100)))
      form?.patchValue({ subtotal_administrative_unforeseen_utility: Math?.round(result) })
    });
    form?.get('utility_percentage')?.valueChanges?.subscribe(value => {
      let subtotal_administrative_unforeseen = form?.get('subtotal_administrative_unforeseen')
      let result = (subtotal_administrative_unforeseen?.value / (1 - (value / 100)))
      form?.patchValue({ subtotal_administrative_unforeseen_utility: Math?.round(result) })
    });
    form?.get('sale_price_cop_withholding_total')?.valueChanges?.subscribe(value => {
      let trm = form?.get('trm')
      let result = (value / trm?.value);
      result ? form?.patchValue({ sale_price_usd_withholding_total: result.toFixed(2) }) : ''
    })
    form?.get('trm')?.valueChanges?.subscribe(value => {
      let sale_price_cop_withholding_total = form?.get('sale_price_cop_withholding_total')
      let result = (sale_price_cop_withholding_total?.value / value);
      form?.patchValue({ sale_price_usd_withholding_total: result.toFixed(2) })
    });
  },

};
