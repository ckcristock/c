import {
    FormGroup,
    FormBuilder,
    FormArray
  } from '@angular/forms';
  
  export const cmoHelper = {
  
    createFillIncmo(form: FormGroup, fb: FormBuilder, data) {
      if (data.calculate_labor) {
        let list = form.get('calculate_labor') as FormArray;
        data.other.forEach((r) => {
          let group = fb.group({
            description: [r.description],
            unit: [r.unit],
            amount: [r.amount],
            unit_cost: [r.unit_cost],
            total: [r.total]
          });
          this.subscribecmo(group, form, list);
          list.push(group);
        });
      }
    },
  
    createcmoGroup(form: FormGroup, fb: FormBuilder) {
      let group = fb.group({
        profile: [''],
        displacement_type: [''],
        people_number: [0],
        days_number_displacement: [0],
        workind_day_displacement: [''],
        hours_displacement: [0],
        hours_value_displacement: [0],
        total_value_displacement: [0],
        days_number_ordinary: [0],
        working_day_ordinary: [0],
        hours_ordinary: [0],
        hours_value_ordinary: [0],
        total_value_ordinary: [0],
        days_number_festive: [0],
        working_day_festive: [0],
        hours_festive: [0],
        hours_value_festive: [0],
        total_value_festive: [0],
        salary_value: [0],
        viatic_estimation: fb.group({
          profile: [''],
          viactic_estimation_values: fb.array([])
        })
      });
      let list = form.get('calculate_labor') as FormArray;
      let viact = group.get('viatic_estimation').get('viactic_estimation_values') as FormArray;
      console.log(viact);
      
      this.subscribecmo(group, form, list);
      viact.push(this.viaticEstimationControl(group, fb));
      return group;
    },

    viaticEstimationControl(form: FormGroup, fb: FormBuilder){
      let group = fb.group({
        description: [''],
        unit: [''],
        unit_value: [0],
        total_value: [0]
      });
      this.viaticEstimationSubscribe(form, group);
      return group;
    },

    viaticEstimationSubscribe(form:FormGroup, group: FormGroup){
      form.get('profile').valueChanges.subscribe(value => {
        // form.get('viatic_estimation').patchValue({ profile: value });
      })
    },
    
    subscribecmo( group: FormGroup, form:FormGroup, list: FormArray){
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
          total_value_festive:  Math.round(resultFestive)
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
        group.patchValue({salary_value: Math.round(result)})
      })
      group.get('total_value_festive').valueChanges.subscribe(value => {
        let total_value_displacement = group.get('total_value_displacement');
        let total_value_ordinary = group.get('total_value_ordinary');
        let result = (total_value_displacement.value + total_value_ordinary.value + value)
        group.patchValue({salary_value: Math.round(result)})
      });
      group.get('salary_value').valueChanges.subscribe(value => {
        this.subtotalLabor(list, form);
      })
    },
  
    subtotalLabor(list: FormArray, form: FormGroup){
      setTimeout(() => {
        let total = list.value.reduce((a, b) => { return  a + b.salary_value }, 0);
        form.patchValue({ subtotal_labor: total }) 
      }, 100);
    }
  };