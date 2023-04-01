import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

export const cmoHelper = {

  createFillIncmo(form: FormGroup, fb: FormBuilder, data, profiles, cities) {
    if (data.dimensional_validation) {
      data.dimensional_validation.forEach((r) => {
        let list = form.get('calculate_labor') as FormArray;
        let group = fb.group({
          apu_profile_id: [r.apu_profile_id],
          displacement_type: [r.displacement_type],
          people_number: [r.people_number],
          days_number_displacement: [r.days_number_displacement],
          workind_day_displacement: [r.workind_day_displacement],
          hours_displacement: [r.hours_displacement],
          hours_value_displacement: [r.hours_value_displacement],
          total_value_displacement: [r.total_value_displacement],
          days_number_ordinary: [r.days_number_ordinary],
          working_day_ordinary: [r.working_day_ordinary],
          hours_ordinary: [r.hours_ordinary],
          hours_value_ordinary: [r.hours_value_ordinary],
          total_value_ordinary: [r.total_value_ordinary],
          days_number_festive: [r.days_number_festive],
          working_day_festive: [r.working_day_festive],
          hours_festive: [r.hours_festive],
          hours_value_festive: [r.hours_value_festive],
          total_value_festive: [r.total_value_festive],
          salary_value: [r.salary_value],
          subtotal: [r.subtotal],
          viatic_estimation: fb.array([])
        });
        let viact = group.get('viatic_estimation') as FormArray;
        list.push(group);
        this.subscribecmo(group, form, list, profiles);
        r.travel_estimation_dimensional_validations.forEach(v => {
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
            hours_value_displacement: [r.hours_value_displacement],
            total_value_displacement: [r.total_value_displacement],
            days_number_ordinary: [r.days_number_ordinary],
            hours_ordinary: [r.hours_ordinary],
            hours_value_ordinary: [r.hours_value_ordinary],
            total_value_ordinary: [r.total_value_ordinary],
            days_number_festive: [r.days_number_festive],
            hours_festive: [r.hours_festive],
            hours_value_festive: [r.hours_value_festive],
            total_value_festive: [r.total_value_festive],
            salary_value: [r.salary_value],
            travel_expense_estimation_id: [v.id]
          });
          form.patchValue({ unit_value: v.unit_value, amount: v.amount });
          viact.push(travel);
          this.viaticEstimationSubscribe(form, group, travel, v.travel_expense_estimation, cities, viact, list);
        });
      });
    }
  },

  createcmoGroup(
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
      hours_value_displacement: [0],
      total_value_displacement: [0],
      days_number_ordinary: [0],
      working_day_ordinary: [''],
      hours_ordinary: [0],
      hours_value_ordinary: [0],
      total_value_ordinary: [0],
      days_number_festive: [0],
      working_day_festive: [''],
      hours_festive: [0],
      hours_value_festive: [0],
      total_value_festive: [0],
      salary_value: [0],
      subtotal: [0],
      viatic_estimation: fb.array([])
    });
    let list = form.get('calculate_labor') as FormArray;
    let viact = group.get('viatic_estimation') as FormArray;
    this.subscribecmo(group, form, list, profiles);
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
        hours_value_displacement: [0],
        total_value_displacement: [0],
        days_number_ordinary: [0],
        hours_ordinary: [0],
        hours_value_ordinary: [0],
        total_value_ordinary: [0],
        days_number_festive: [0],
        hours_festive: [0],
        hours_value_festive: [0],
        total_value_festive: [0],
        salary_value: [0],
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
    viact: FormArray,
    list: FormArray
  ) {
    form.get('displacement_type').valueChanges.subscribe(value => {
      let city_id = forma.get('city_id');
      let city = cities.find(c => c.id == city_id.value);
      if (value == 1 && city?.department_?.country_id != 1) {
        group.patchValue({ unit_value: estimation?.aerial_international_value || estimation?.international_value || estimation.unit_value })
      } else if (value == 2 && city?.department_?.country_id != 1) {
        group.patchValue({ unit_value: estimation?.land_international_value || estimation?.international_value || estimation.unit_value })
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
      if (city?.department_?.country_id != 1) {
        group.patchValue({ unit_value: estimation.aerial_international_value || estimation?.international_value || estimation.unit_value })
      } else {
        group.patchValue({ unit_value: estimation.land_national_value || estimation?.national_value || estimation.unit_value })
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
      group.patchValue({ days_number_displacement: value })
    })
    form.get('hours_displacement').valueChanges.subscribe(value => {
      group.patchValue({ hours_displacement: value })
    })
    form.get('hours_value_displacement').valueChanges.subscribe(value => {
      group.patchValue({ hours_value_displacement: value })
    })
    form.get('total_value_displacement').valueChanges.subscribe(value => {
      group.patchValue({ total_value_displacement: value })
    })
    form.get('days_number_ordinary').valueChanges.subscribe(value => {
      group.patchValue({ days_number_ordinary: value })
    })
    form.get('hours_ordinary').valueChanges.subscribe(value => {
      group.patchValue({ hours_ordinary: value })
    })
    form.get('hours_value_ordinary').valueChanges.subscribe(value => {
      group.patchValue({ hours_value_ordinary: value })
    })
    form.get('total_value_ordinary').valueChanges.subscribe(value => {
      group.patchValue({ total_value_ordinary: value })
    })
    form.get('days_number_festive').valueChanges.subscribe(value => {
      group.patchValue({ days_number_festive: value })
    })
    form.get('hours_festive').valueChanges.subscribe(value => {
      group.patchValue({ hours_festive: value })
    })
    form.get('hours_value_festive').valueChanges.subscribe(value => {
      group.patchValue({ hours_value_festive: value })
    })
    form.get('total_value_festive').valueChanges.subscribe(value => {
      group.patchValue({ total_value_festive: value })
    })
    form.get('salary_value').valueChanges.subscribe(value => {
      this.operationAmount(group);
    });
    form.get('subtotal').valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.subtotalTravelExpense(list, forma)
    })
  },

  subscribecmo(group: FormGroup, form: FormGroup, list: FormArray, profiles: Array<any>) {
    list.valueChanges.subscribe(value => {
      this.subtotalLabor(list, form);
      this.subtotalTravelExpense(list, form);
    })
    group.get('people_number').valueChanges.subscribe(value => {
      let hours_value_displacement = group.get('hours_value_displacement');
      let hours_displacement = group.get('hours_displacement')
      let days_number_displacement = group.get('days_number_displacement')
      let hours_value_ordinary = group.get('hours_value_ordinary')
      let hours_ordinary = group.get('hours_ordinary')
      let days_number_ordinary = group.get('days_number_ordinary')
      let hours_value_festive = group.get('hours_value_festive')
      let hours_festive = group.get('hours_festive')
      let days_number_festive = group.get('days_number_ordinary')
      let resultDisplacement = (days_number_displacement.value * hours_displacement.value * hours_value_displacement.value * value);
      let resultOrdinary = (days_number_ordinary.value * hours_ordinary.value * hours_value_ordinary.value * value);
      let resultFestive = (days_number_festive.value * hours_festive.value * hours_value_festive.value * value)
      group.patchValue({
        total_value_displacement: Math.round(resultDisplacement),
        total_value_ordinary: Math.round(resultOrdinary),
        total_value_festive: Math.round(resultFestive)
      })
    });
    /******************************/
    group.get('hours_value_displacement').valueChanges.subscribe(value => {
      let hours_displacement = group.get('hours_displacement');
      let days_number_displacement = group.get('days_number_displacement')
      let people_number = group.get('people_number')
      let result = (days_number_displacement.value * hours_displacement.value * value * people_number.value);
      group.patchValue({ total_value_displacement: Math.round(result) })
    });
    group.get('hours_displacement').valueChanges.subscribe(value => {
      let hours_value_displacement = group.get('hours_value_displacement');
      let days_number_displacement = group.get('days_number_displacement')
      let people_number = group.get('people_number')
      let result = (days_number_displacement.value * value * hours_value_displacement.value * people_number.value);
      group.patchValue({ total_value_displacement: Math.round(result) })
    });
    group.get('days_number_displacement').valueChanges.subscribe(value => {
      let hours_value_displacement = group.get('hours_value_displacement');
      let hours_displacement = group.get('hours_displacement')
      let people_number = group.get('people_number')
      let result = (value * hours_displacement.value * hours_value_displacement.value * people_number.value);
      group.patchValue({ total_value_displacement: Math.round(result) })
    });
    group.get('hours_value_displacement').valueChanges.subscribe(value => {
      let hours_displacement = group.get('hours_displacement');
      let days_number_displacement = group.get('days_number_displacement')
      let people_number = group.get('people_number')
      let result = (days_number_displacement.value * hours_displacement.value * value * people_number.value);
      group.patchValue({ total_value_displacement: Math.round(result) })
    });
    /******************************/
    group.get('hours_value_ordinary').valueChanges.subscribe(value => {
      let hours_ordinary = group.get('hours_ordinary')
      let days_number_ordinary = group.get('days_number_ordinary')
      let people_number = group.get('days_number_ordinary')
      let result = (days_number_ordinary.value * hours_ordinary.value * value * people_number.value);
      group.patchValue({ total_value_ordinary: Math.round(result) })
    });
    group.get('hours_ordinary').valueChanges.subscribe(value => {
      let hours_value_ordinary = group.get('hours_value_ordinary')
      let days_number_ordinary = group.get('days_number_ordinary')
      let people_number = group.get('days_number_ordinary')
      let result = (days_number_ordinary.value * value * hours_value_ordinary.value * people_number.value);
      group.patchValue({ total_value_ordinary: Math.round(result) })
    });
    group.get('days_number_ordinary').valueChanges.subscribe(value => {
      let hours_value_ordinary = group.get('hours_value_ordinary')
      let hours_ordinary = group.get('hours_ordinary')
      let people_number = group.get('people_number')
      let result = (value * hours_ordinary.value * hours_value_ordinary.value * people_number.value);
      group.patchValue({ total_value_ordinary: Math.round(result) })
    });
    /******************************/
    group.get('hours_value_festive').valueChanges.subscribe(value => {
      let hours_festive = group.get('hours_festive')
      let days_number_festive = group.get('days_number_festive')
      let people_number = group.get('days_number_ordinary')
      let result = (days_number_festive.value * hours_festive.value * value * people_number.value);
      group.patchValue({ total_value_festive: Math.round(result) })
    });
    group.get('hours_festive').valueChanges.subscribe(value => {
      let hours_value_festive = group.get('hours_value_festive')
      let days_number_festive = group.get('days_number_festive')
      let people_number = group.get('people_number')
      let result = (days_number_festive.value * value * hours_value_festive.value * people_number.value);
      group.patchValue({ total_value_festive: Math.round(result) })
    });
    group.get('days_number_festive').valueChanges.subscribe(value => {
      let hours_value_festive = group.get('hours_value_festive')
      let hours_festive = group.get('hours_festive')
      let people_number = group.get('people_number')
      let result = (value * hours_festive.value * hours_value_festive.value * people_number.value);
      group.patchValue({ total_value_festive: Math.round(result) })
    });
    /******************************/
    group.get('total_value_displacement').valueChanges.subscribe(value => {
      let total_value_ordinary = group.get('total_value_ordinary');
      let total_value_festive = group.get('total_value_festive');
      let result = (value + total_value_ordinary.value + total_value_festive.value)
      group.patchValue({ salary_value: Math.round(result) })
    });
    group.get('total_value_ordinary').valueChanges.subscribe(value => {
      let total_value_displacement = group.get('total_value_displacement');
      let total_value_festive = group.get('total_value_festive');
      let result = (total_value_displacement.value + value + total_value_festive.value)
      group.patchValue({ salary_value: Math.round(result) })
    })
    group.get('total_value_festive').valueChanges.subscribe(value => {
      let total_value_displacement = group.get('total_value_displacement');
      let total_value_ordinary = group.get('total_value_ordinary');
      let result = (total_value_displacement.value + total_value_ordinary.value + value)
      group.patchValue({ salary_value: Math.round(result) })
    });
    group.get('workind_day_displacement').valueChanges.subscribe(value => {
      let profile = group.get('apu_profile_id');
      let data = profiles.find(p => p.id == profile.value);
      if (value == 'Diurna') {
        group.patchValue({ hours_value_displacement: data.value_time_daytime_displacement });
      } else if (value == 'Nocturna') {
        group.patchValue({ hours_value_displacement: data.value_time_night_displacement });
      }
    });
    group.get('working_day_ordinary').valueChanges.subscribe(value => {
      let profile = group.get('apu_profile_id');
      let data = profiles.find(p => p.id == profile.value);
      if (value == 'Diurna') {
        group.patchValue({ hours_value_ordinary: data.daytime_ordinary_hour_value });
      } else if (value == 'Nocturna') {
        group.patchValue({ hours_value_ordinary: data.night_ordinary_hour_value });
      }
    });
    group.get('working_day_festive').valueChanges.subscribe(value => {
      let profile = group.get('apu_profile_id');
      let data = profiles.find(p => p.id == profile.value);
      if (value == 'Diurna') {
        group.patchValue({ hours_value_festive: data.sunday_daytime_value });
      } else if (value == 'Nocturna') {
        group.patchValue({ hours_value_festive: data.sunday_night_time_value });
      }
    });

    group.get('salary_value').valueChanges.subscribe(value => {
      this.subtotalLabor(list, form);
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
      form.patchValue({ subtotal_travel_expense: total })
    }, 100);
  },

  subtotalLabor(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total = list.value.reduce((a, b) => { return a + b.salary_value }, 0);
      form.patchValue({ subtotal_labor: total })
    }, 100);
  }
};
