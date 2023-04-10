import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime } from 'rxjs/operators';

export const cVdCalculateLaborHelper = {
  createFillInCVd(form: FormGroup, fb: FormBuilder, data, profiles, cities) {
    if (data.dimensional_validation_c) {
      data.dimensional_validation_c.forEach((r) => {
        let list = form.get('c_vd_calculate_labor') as FormArray;
        let group = fb.group({
          apu_profile_id: [r.apu_profile_id],
          displacement_type: [r.displacement_type],
          people_number: [r.people_number],
          days_number_displacement: [r.days_number_displacement],
          workind_day_displacement: [r.workind_day_displacement],
          hours_displacement: [r.hours_displacement],
          days_number_ordinary: [r.days_number_ordinary],
          working_day_ordinary: [r.working_day_ordinary],
          hours_ordinary: [r.hours_ordinary],
          days_number_festive: [r.days_number_festive],
          working_day_festive: [r.working_day_festive],
          hours_festive: [r.hours_festive],
          subtotal: [r.subtotal],
          viatic_estimation: fb.array([])
        });
        let viact = group.get('viatic_estimation') as FormArray;
        list.push(group);
        this.subscribeCVd(group, form, list, profiles);
        r.travel_estimation_dimensional_validations_c.forEach(v => {
          let travel = fb.group({
            description: [v.description],
            amount: [v.amount],
            unit: [v.unit],
            unit_value: [v.unit_value],
            total_value: [v.total_value],
            formula_amount: [v.formula_amount],
            formula_total_value: [v.formula_total_value],
            days_number_displacement: [r.days_number_displacement],
            people_number: [r.people_number],
            hours_displacement: [r.hours_displacement],
            days_number_ordinary: [r.days_number_ordinary],
            hours_ordinary: [r.hours_ordinary],
            days_number_festive: [r.days_number_festive],
            hours_festive: [r.hours_festive],
            travel_expense_estimation_id: [v.id]
          });
          form.patchValue({ unit_value: v.unit_value, amount: v.amount });
          viact.push(travel);
          this.viaticEstimationSubscribe(form, group, travel, v.travel_expense_estimation, cities, viact, list);
        });
      });
    }
  },

  createCVdCalculateLaborGroup(
    form: FormGroup,
    fb: FormBuilder,
    profiles: Array<any>,
    tEestimation: Array<any>,
    cities) {
    let group = fb.group({
      apu_profile_id: [''],
      displacement_type: [''],
      people_number: [0],
      days_number_displacement: [0],
      workind_day_displacement: [''],
      hours_displacement: [0],
      days_number_ordinary: [0],
      working_day_ordinary: [''],
      hours_ordinary: [0],
      days_number_festive: [0],
      working_day_festive: [''],
      hours_festive: [0],
      subtotal: [0],
      viatic_estimation: fb.array([])
    });
    let list = form.get('c_vd_calculate_labor') as FormArray;
    let viact = group.get('viatic_estimation') as FormArray;
    this.subscribeCVd(group, form, list, profiles);
    tEestimation.forEach(r => {
      let est = fb.group({
        description: [r.description],
        amount: [r.amount],
        unit: [r.unit],
        unit_value: [r.unit_value],
        total_value: [0],
        formula_amount: [r.formula_amount],
        formula_total_value: [r.formula_total_value],
        days_number_displacement: [0],
        people_number: [0],
        hours_displacement: [0],
        days_number_ordinary: [0],
        hours_ordinary: [0],
        days_number_festive: [0],
        hours_festive: [0],
        travel_expense_estimation_id: [r.id]
      });
      form.patchValue({ unit_value: r.unit_value, amount: r.amount });
      viact.push(est);
      this.viaticEstimationSubscribe(form, group, est, r, cities, viact, list);
    });
    return group;
  },
  operationAmount(group: FormGroup) {
    let formu = group.controls.formula_amount.value;
    let formula = formu;
    let el = group.value;
    for (const key in el) {
      if (formula?.includes(key)) {
        formula = formula.replaceAll('{' + key + '}', el[key]);
      }
    }
    let result = eval(formula);
    group.patchValue({
      amount: Math.round(result * 100) / 100
    });
  },

  operationValue(group) {
    let formu = group.controls.formula_total_value.value;
    let formula = formu;
    let el = group.value;
    for (const key in el) {
      if (formula?.includes(key)) {
        formula = formula.replaceAll('{' + key + '}', el[key]);
      }
    }
    let result = eval(formula);
    group.patchValue({
      total_value: Math.round(result * 100) / 100
    });
  },

  viaticEstimationSubscribe(
    forma: FormGroup,
    form: FormGroup,
    group: FormGroup,
    estimation,
    cities,
    viact,
    list
  ) {
    form.get('displacement_type').valueChanges.subscribe(value => {
      let city_id = forma.get('city_id');
      let city = cities.find(c => c.id == city_id.value);
      if (value == 1 && city?.department_?.country_id != 1) {
        group.patchValue({ unit_value: estimation?.aerial_international_value || estimation?.international_value || estimation.unit_value })
      } else if (value == 2 && city?.department_?.country_id != 1) {
        group.patchValue({ unit_value: estimation?.land_international_value || estimation?.aerial_international_value || estimation?.international_value || estimation.unit_value })
      } else if (value == 3) {
        group.patchValue({ unit_value: estimation?.aerial_international_value || estimation?.international_value || estimation.unit_value })
      }
      if (value == 1 && city?.department_?.country_id == 1) {
        group.patchValue({ unit_value: estimation?.aerial_national_value || estimation?.national_value || estimation.unit_value })
      } else if (value == 2 && city?.department_?.country_id == 1) {
        group.patchValue({ unit_value: estimation?.land_national_value || estimation?.national_value || estimation.unit_value })
      } else if (value == 3) {
        group.patchValue({ unit_value: estimation?.aerial_international_value || estimation?.international_value || estimation.unit_value })
      }
    });
    forma.get('city_id').valueChanges.subscribe(value => {
      let city = cities.find(c => c.id == value);
      let displacement_type = form.get('displacement_type').value
      if (displacement_type == 1 && city?.department_?.country_id != 1) {
        group.patchValue({ unit_value: estimation?.aerial_international_value || estimation?.international_value || estimation.unit_value })
      } else if (displacement_type == 2 && city?.department_?.country_id != 1) {
        group.patchValue({ unit_value: estimation?.land_international_value || estimation?.aerial_international_value || estimation?.international_value || estimation.unit_value })
      } else if (displacement_type == 3) {
        group.patchValue({ unit_value: estimation?.aerial_international_value || estimation?.international_value || estimation.unit_value })
      }
      if (displacement_type == 1 && city?.department_?.country_id == 1) {
        group.patchValue({ unit_value: estimation?.aerial_national_value || estimation?.national_value || estimation.unit_value })
      } else if (displacement_type == 2 && city?.department_?.country_id == 1) {
        group.patchValue({ unit_value: estimation?.land_national_value || estimation?.national_value || estimation.unit_value })
      } else if (displacement_type == 3) {
        group.patchValue({ unit_value: estimation?.aerial_international_value || estimation?.international_value || estimation.unit_value })
      }
    });
    group.get('amount').valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.operationValue(group)
    })
    group.get('unit_value').valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.operationValue(group)
    })
    if (estimation?.formula_amount === '{people_number}') {
      form.get('people_number').valueChanges.subscribe(value => {
        group.patchValue({ amount: value })
      })
    }
    group.get('total_value').valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.subtotalTravelExpenseEstimation(viact, form);
    })
    form.get('people_number').valueChanges.pipe(debounceTime(500)).subscribe(value => {
      group.patchValue({ people_number: value })
      this.operationAmount(group);
    });
    form.get('days_number_displacement').valueChanges.subscribe(value => {
      group.patchValue({ days_number_displacement: value });
      this.operationAmount(group);
    })
    form.get('hours_displacement').valueChanges.subscribe(value => {
      group.patchValue({ hours_displacement: value })
    })
    form.get('days_number_ordinary').valueChanges.subscribe(value => {
      group.patchValue({ days_number_ordinary: value })
      this.operationAmount(group);
    })
    form.get('hours_ordinary').valueChanges.subscribe(value => {
      group.patchValue({ hours_ordinary: value })
    })
    form.get('days_number_festive').valueChanges.subscribe(value => {
      group.patchValue({ days_number_festive: value })
      this.operationAmount(group);
    })
    form.get('hours_festive').valueChanges.subscribe(value => {
      group.patchValue({ hours_festive: value })
    })
    form.get('subtotal').valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.subtotalTravelExpense(list, forma)
    })
  },

  subscribeCVd(group: FormGroup, form: FormGroup, list: FormArray, profiles: Array<any>) {
    list.valueChanges.subscribe(value => {
      this.subtotalTravelExpense(list, form);
    })

  },

  subtotalTravelExpenseEstimation(viact: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total = viact.value.reduce((a, b) => { return a + b.total_value }, 0);
      form.patchValue({ subtotal: total })
    }, 100);
  },

  subtotalTravelExpense(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total = list.value.reduce((a, b) => { return a + b.subtotal }, 0);
      form.patchValue({ subtotal_travel_expense_vd_c: total })
    }, 100);
  },
};
