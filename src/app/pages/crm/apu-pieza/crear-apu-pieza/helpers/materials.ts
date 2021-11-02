import { functionsApu} from './helper';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const materialsHelper = {
  consts: {},
  createMaterialsGroup(form: FormGroup, fb: FormBuilder) {
    let materials = fb.group({
      material_id: [''],
      unit_id: [''],
      q_unit: [0],
      q_total: [0],
      unit_cost: [0],
      total: [0]
    });
    let list = form.get('commercial_materials') as FormArray;
    materials.get('q_unit').valueChanges.subscribe(value => {
      let q_total = materials.get('q_total').value;
      let unit_cost = materials.get('unit_cost').value;
      let result = value * unit_cost * q_total;
      materials.patchValue({
        total: result
      })
    })
    materials.get('q_total').valueChanges.subscribe(value => {
      let q_unit = materials.get('q_unit').value;
      let unit_cost = materials.get('unit_cost').value;
      let result = q_unit * unit_cost * value;
      materials.patchValue({
        total: result
      })
    })
    materials.get('unit_cost').valueChanges.subscribe(value => {
      let q_unit = materials.get('q_unit').value;
      let q_total = materials.get('q_total').value;
      let result =  q_total * value * q_unit;
      materials.patchValue({
        total: result
      })
    })
    materials.get('total').valueChanges.subscribe(value => {
      this.subtotalMaterials(list, form)
    })
    /* materials.get('unit_cost').valueChanges.subscribe(value => { // Hace lo mismo solo que realiza la acción cuando cambia el costo unitario
      let q_unit = materials.get('q_unit').value;
      let q_total = materials.get('q_total').value;
      let result = q_unit * value * q_total;
      materials.patchValue({
        total: result
      })
    }) */
    return materials;
  },

  subtotalMaterials(list: FormArray, form:FormGroup){
    setTimeout(() => {
      let total = 
      list.value.reduce(
        (a, b) => {
          return  a + b.total
        },0
      );
      form.patchValue({
        commercial_materials_subtotal: total
      }) 
    }, 100);
  }

};