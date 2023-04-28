import { functionsApu } from './helper';
import { FormControl } from '@angular/forms';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const cutLaserHelper = {

  createFillInCutLaser(form: FormGroup, fb: FormBuilder, data, materials: Array<any>) {
    if (data.cutlaser) {
      let cut_laser = form.get('cut_laser') as FormArray;
      data.cutlaser.forEach((r) => {
        let group = fb.group({
          cut_laser_material_id: [r?.cut_laser_material_id],
          cut_laser_material_value_id: [r?.cut_laser_material_value_id],
          thicknessSelected: [r?.cut_laser_material_value_id],
          thickness: [r?.thickness],
          thicknesses: [r?.cut_laser_material?.cut_laser_material_value],
          sheets_amount: [r?.sheets_amount],
          long: [r?.long],
          width: [r?.width],
          total_length: [r?.total_length],
          amount_holes: [r?.amount_holes],
          diameter: [r?.diameter],
          total_hole_perimeter: [r?.total_hole_perimeter],
          formula: [r?.cut_laser_material?.formula],
          time: [r?.time],
          minute_value: [r?.minute_value],
          value: [r?.value],
          unit_value: [r?.cut_laser_material_value?.unit_value],
          actual_speed: [r?.cut_laser_material_value?.actual_speed],
          seconds_percing: [r?.cut_laser_material_value?.seconds_percing]
        });
        this.subscribesCutLaser(group, cut_laser, form, materials);
        cut_laser.push(group);
      });
    }
  },

  createCutLaserGroup(form: FormGroup, fb: FormBuilder, materials: Array<any>) {
    let cut_laser = fb.group({
      cut_laser_material_id: [''],
      cut_laser_material_value_id: [''],
      thicknesses: [''],
      thickness: [''],
      thicknessSelected: [''],
      sheets_amount: [0],
      long: [0],
      width: [0],
      total_length: [0],
      amount_holes: [0],
      diameter: [0],
      total_hole_perimeter: [0],
      time: [0],
      minute_value: [form.get('minute_value_laser').value],
      value: [0],
      formula: [''],
      unit_value: [0],
      actual_speed: [0],
      seconds_percing: [0]
    });
    let list = form.get('cut_laser') as FormArray;
    this.subscribesCutLaser(cut_laser, list, form, materials);
    return cut_laser;
  },

  operation(cut_laser: FormGroup, list: FormArray, materials) {
    let formu = cut_laser.controls.formula.value;
    let formula = formu;
    let material_id = cut_laser.get('cut_laser_material_id').value;
    let thickness_id = cut_laser.get('thicknessSelected').value;
    let material = materials.find(m => m.id == material_id);
    let data = material.cut_laser_material_value.find(c => c.id == thickness_id);
    cut_laser.patchValue({ thickness: data.thickness })
    list.controls.forEach((element: FormControl) => {
      let el = element.value;
      for (const key in el) {
        if (formula.includes(key)) {
          formula = formula.replaceAll('{' + key + '}', el[key]);
        }
      }
    });
    let result = eval(formula);
    cut_laser.patchValue({
      time: (result / 60).toFixed(7)
    });
  },

  subscribesCutLaser(cut_laser: FormGroup, list: FormArray, form: FormGroup, materials: Array<any>) {
    cut_laser.get('cut_laser_material_id').valueChanges.subscribe(value => {
      let data = materials.find(m => m.id == value);
      cut_laser.patchValue({
        formula: data.formula,
        thicknesses: data.cut_laser_material_value
      });
    });
    cut_laser.get('thicknessSelected').valueChanges.subscribe(r => {
      let material_id = cut_laser.get('cut_laser_material_id').value;
      let material = materials.find(m => m.id == material_id);
      let data = material.cut_laser_material_value.find(c => c.id == r);
      cut_laser.patchValue({
        unit_value: data.unit_value,
        actual_speed: data.actual_speed,
        seconds_percing: data.seconds_percing,
        cut_laser_material_value_id: r
      })
      this.operation(cut_laser, list, materials);
    });
    cut_laser.get('sheets_amount').valueChanges.subscribe(value => {
      let long = cut_laser.get('long');
      let width = cut_laser.get('width');
      if (long.value > 0 && width.value > 0) {
        let result = (value * ((long.value * 2) + (width.value * 2)));
        cut_laser.patchValue({
          total_length: result
        })
      } else {
        let result = long.value * value;
        cut_laser.patchValue({
          total_length: result
        })
      }
    });
    cut_laser.get('long').valueChanges.subscribe(value => {
      let sheets_amount = cut_laser.get('sheets_amount');
      let width = cut_laser.get('width');
      if (value > 0 && width.value > 0) {
        let result = (sheets_amount.value * ((value * 2) + (width.value * 2)));
        cut_laser.patchValue({
          total_length: result
        })
      } else {
        let result = value * sheets_amount.value;
        cut_laser.patchValue({
          total_length: result
        })
      }
    });
    cut_laser.get('total_length').valueChanges.subscribe(value => {
      this.operation(cut_laser, list, materials);
    })
    cut_laser.get('total_hole_perimeter').valueChanges.subscribe(value => {
      this.operation(cut_laser, list, materials);
    })
    cut_laser.get('width').valueChanges.subscribe(value => {
      let sheets_amount = cut_laser.get('sheets_amount');
      let long = cut_laser.get('long');
      if (long.value > 0 && value > 0) {
        let result = (sheets_amount.value * ((long.value * 2) + (value * 2)));
        cut_laser.patchValue({
          total_length: result
        })
      } else {
        let result = long.value * sheets_amount.value;
        cut_laser.patchValue({
          total_length: result
        })
      }
    });
    cut_laser.get('amount_holes').valueChanges.subscribe(value => {
      let pi = Math.PI;
      let diameter = cut_laser.get('diameter');
      let result = (diameter.value / 2) * pi * 2 * value;
      cut_laser.patchValue({
        total_hole_perimeter: result.toFixed(8)
      })
    });
    cut_laser.get('diameter').valueChanges.subscribe(value => {
      let pi = Math.PI;
      let amount_holes = cut_laser.get('amount_holes');
      let result = (value / 2) * pi * 2 * amount_holes.value;
      cut_laser.patchValue({
        total_hole_perimeter: result.toFixed(8)
      });
    });
    cut_laser.get('time').valueChanges.subscribe(value => {
      let minute_value = cut_laser.get('minute_value');
      let result = minute_value.value * Number(value);
      cut_laser.patchValue({
        value: result
      })
    });
    cut_laser.get('minute_value').valueChanges.subscribe(value => {
      let time = cut_laser.get('time');
      let result = value * time.value;
      cut_laser.patchValue({
        value: Math.round(result)
      })
    });
    cut_laser.get('value').valueChanges.subscribe(value => {
      this.subtotalUnit(list, form);
    });
    this.subtotal(form);
  },

  subtotalUnit(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total = list.value.reduce((a, b) => { return a + b.value }, 0);
      form.patchValue({
        cut_laser_unit_subtotal: total
      })
    }, 100);
  },

  subtotal(form: FormGroup) {
    let subTotalUnit = form.get('cut_laser_unit_subtotal');
    let cut_laser_total_amount = form.get('cut_laser_total_amount');
    cut_laser_total_amount.valueChanges.subscribe(value => {
      let result = value * subTotalUnit.value;
      form.patchValue({
        cut_laser_subtotal: result
      })
    });
    subTotalUnit.valueChanges.subscribe(value => {
      let result = value * cut_laser_total_amount.value;
      form.patchValue({
        cut_laser_subtotal: result
      })
    });
  }

};
