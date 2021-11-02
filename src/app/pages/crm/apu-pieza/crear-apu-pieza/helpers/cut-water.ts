import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const cutWaterHelper = {
  consts: {},
  createCutWaterGroup(form:FormGroup, fb: FormBuilder) {
    let cut_water = fb.group({
      material_id: [''],
      thickness: [''],
      amount: [0],
      long: [0],
      width: [0],
      total_length: [0],
      amount_cut: [0],
      diameter: [0],
      total_hole_perimeter: [0],
      time: [0],
      minute_value: [0],
      value: [0]
    });
    let list = form.get('cut_water') as FormArray;
    this.subscribesCutWater(cut_water, list, form);
    return cut_water;
  },

  subscribesCutWater( cut_water:FormGroup, list: FormArray , form: FormGroup){
    cut_water.get('amount').valueChanges.subscribe(value => {
      let long = cut_water.get('long').value;
      let width = cut_water.get('width').value;
      if (long > 0 && width > 0) {
        let result = (value * ((long * 2) + (width * 2)));
         cut_water.patchValue({
          total_length: result
         })
      } else {
        let result = long * value;
        cut_water.patchValue({
          total_length: result
        })
      }
    });
    cut_water.get('long').valueChanges.subscribe(value => {
      let amount = cut_water.get('amount').value;
      let width = cut_water.get('width').value;
      if (value > 0 && width > 0) {
        let result = (amount * ((value * 2) + (width * 2)));
        cut_water.patchValue({
          total_length: result
        })
      } else {
        let result = value * amount;
        cut_water.patchValue({
          total_length: result
        })
      }
    });
    cut_water.get('width').valueChanges.subscribe(value => {
      let amount = cut_water.get('amount').value;
      let long = cut_water.get('long').value;
      if (long > 0 && value > 0) {
        let result = (amount * ((long * 2) + (value * 2)));
        cut_water.patchValue({
          total_length: result
        })
      } else {
        let result = long * amount;
        cut_water.patchValue({
          total_length: result
        })
      }
    });
    cut_water.get('amount_cut').valueChanges.subscribe(value => {
      let pi = Math.PI;
      let diameter = cut_water.get('diameter').value;
      let result = (diameter/2) * pi * 2 * value;
      cut_water.patchValue({
        total_hole_perimeter: result.toFixed(8)
      })
    });
    cut_water.get('diameter').valueChanges.subscribe(value => {
      let pi = Math.PI;
      let amount_cut = cut_water.get('amount_cut').value;
      let result = (value/2) * pi * 2 * amount_cut;
      cut_water.patchValue({
        total_hole_perimeter: result.toFixed(8)
      });
    });
    cut_water.get('time').valueChanges.subscribe(value => {
      let minute_value = cut_water.get('minute_value').value;
      let result = minute_value * value;
      cut_water.patchValue({
        value: result
      })
    });
    cut_water.get('minute_value').valueChanges.subscribe(value => {
      let time = cut_water.get('time').value;
      let result = value * time;
      cut_water.patchValue({
        value: result
      })
    });
    cut_water.get('value').valueChanges.subscribe(value => {
      this.subtotalUnit(list, form);
    });
    form.get('cut_water_unit_subtotal').valueChanges.subscribe(value => {
      this.subtotal(form)
    });
  },

  subtotalUnit(list: FormArray, form:FormGroup){
    setTimeout(() => {
      let total = 
      list.value.reduce(
        (a, b) => {
          return  a + b.value
        },0
      );
      form.patchValue({
        cut_water_unit_subtotal: total
      }) 
    }, 100);
  },

  subtotal(form:FormGroup){
    let subTotalUnit = form.get('cut_water_unit_subtotal').value;
    let cut_water_total_amount = form.get('cut_water_total_amount').value;
    form.get('cut_water_total_amount').valueChanges.subscribe(value => {
      let result = value + subTotalUnit;
      form.patchValue({
        cut_water_subtotal: result
      }) 
    });
    form.get('cut_water_unit_subtotal').valueChanges.subscribe(value => {
      let result = value + cut_water_total_amount;
      form.patchValue({
        cut_water_subtotal: result
      }) 
    });
  }

};