import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';
import * as math from 'mathjs';
import { angularMath } from 'angular-ts-math/dist/angular-ts-math/angular-ts-math';
export const cutWaterHelper = {
  consts: {},

  createFillInCutWater(form: FormGroup, fb: FormBuilder, data, materials: Array<any>) {
    if (data.cutwater) {
      let cut_water = form.get('cut_water') as FormArray;
      data.cutwater.forEach((r) => {
        let group = fb.group({
          material_id: [r?.material_id],
          thickness_id: [r?.thickness?.id],
          thickness_value: [r?.thickness_value],
          amount: [r?.amount],
          long: [r?.long],
          width: [r?.width],
          total_length: [r?.total_length],
          amount_cut: [r?.amount_cut],
          diameter: [r?.diameter],
          total_hole_perimeter: [r?.total_hole_perimeter],
          time: [r?.time],
          minute_value: [r?.minute_value],
          value: [r?.value]
        });
        this.subscribesCutWater(group, cut_water, form, materials);
        cut_water.push(group);
      });
    }
  },

  createCutWaterGroup(form: FormGroup, fb: FormBuilder, materials: Array<any>) {
    let cut_water = fb.group({
      material_id: [''],
      thickness_id: [''],
      thickness_value: [0],
      amount: [0],
      long: [0],
      width: [0],
      total_length: [0],
      amount_cut: [0],
      diameter: [0],
      total_hole_perimeter: [0],
      time: [0],
      minute_value: [form.get('minute_value_water').value],
      value: [0]
    });
    let list = form.get('cut_water') as FormArray;
    this.subscribesCutWater(cut_water, list, form, materials);
    return cut_water;
  },

  subscribesCutWater(cut_water: FormGroup, list: FormArray, form: FormGroup, materials: Array<any>) {

    cut_water.get('thickness_id').valueChanges.subscribe(value => {
      let material_id = cut_water.get('material_id').value;
      let data = materials.find(m => m.id == material_id);
      let thickness = data.material_thickness.find(t => t.thickness_id == value);
      cut_water.patchValue({
        thickness_value: thickness.value
      })
    });

    cut_water.get('thickness_value').valueChanges.subscribe(value => {
      let total_length = cut_water.controls.total_length.value;
      let total_hole_perimeter = cut_water.controls.total_hole_perimeter.value;
      let result = ((Number(total_hole_perimeter) + Number(total_length)) * Number(value)) / (60 * 100);
      cut_water.patchValue({
        time: result.toFixed(7)
      })
    });

    cut_water.get('total_length').valueChanges.subscribe(value => {
      let thickness_value = cut_water.get('thickness_value').value;
      let total_hole_perimeter = cut_water.get('total_hole_perimeter').value;
      let result = ((Number(total_hole_perimeter) + Number(value)) * Number(thickness_value)) / (60 * 100);
      console.log('cambiando total')
      cut_water.patchValue({
        time: result.toFixed(7)
      })
    });

    cut_water.get('total_hole_perimeter').valueChanges.subscribe(value => {
      let thickness_value = cut_water.get('thickness_value').value;
      let total_length = cut_water.get('total_length').value;
      let result = ((Number(value) + Number(total_length)) * Number(thickness_value)) / (60 * 100);
      cut_water.patchValue({
        time: result.toFixed(7)
      })

    });

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
      let pi = angularMath.getPi();
      let diameter = cut_water.get('diameter').value;
      let result = (diameter / 2) * pi * 2 * value;
      cut_water.patchValue({
        total_hole_perimeter: result.toFixed(8)
      })
    });

    cut_water.get('diameter').valueChanges.subscribe(value => {
      let pi = angularMath.getPi();
      let amount_cut = cut_water.get('amount_cut').value;
      let result = (value / 2) * pi * 2 * amount_cut;
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
        value: Math.round(result)
      })
    });

    cut_water.get('value').valueChanges.subscribe(value => {
      this.subtotalUnit(list, form);
    });
    form.get('cut_water_unit_subtotal').valueChanges.subscribe(value => {
      this.subtotal(form)
    });
  },

  subtotalUnit(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total =
        list.value.reduce(
          (a, b) => {
            return a + b.value
          }, 0
        );
      form.patchValue({
        cut_water_unit_subtotal: total
      })
    }, 100);
  },

  subtotal(form: FormGroup) {
    let subTotalUnit = form.get('cut_water_unit_subtotal').value;
    let cut_water_total_amount = form.get('cut_water_total_amount').value;
    form.get('cut_water_total_amount').valueChanges.subscribe(value => {
      let result = value * subTotalUnit;
      form.patchValue({
        cut_water_subtotal: result
      })
    });
    form.get('cut_water_unit_subtotal').valueChanges.subscribe(value => {
      let result = value * cut_water_total_amount;
      form.patchValue({
        cut_water_subtotal: result
      })
    });
  }

};
