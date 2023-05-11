import {
  FormGroup,
  FormBuilder,
  FormArray,
} from '@angular/forms';

export const materialsHelper = {
  consts: {},

  createFillInMaterials(form: FormGroup, fb: FormBuilder, data) {
    if (data?.commercial) {
      let commercial_materials = form?.get('commercial_materials') as FormArray;
      data?.commercial?.forEach((r) => {
        let group = fb?.group({
          material_id: [r?.material_id],
          unit_id: [r?.unit_id],
          q_unit: [r?.q_unit],
          q_total: [r?.q_total],
          unit_cost: [r?.unit_cost],
          total: [r?.total]
        });
        this?.subscribesMaterials(group, form);
        // this?.subtotalMaterials(commercial_materials, form);
        commercial_materials?.push(group);
      });
    }
  },

  createMaterialsGroup(form: FormGroup, fb: FormBuilder) {
    let amount = form?.get('amount')?.value;
    let materials = fb?.group({
      material_id: [''],
      unit_id: [''],
      q_unit: [0],
      q_total: [amount],
      unit_cost: [0],
      total: [0]
    });
    this?.subscribesMaterials(materials, form);
    return materials;
  },

  subscribesMaterials(materials: FormGroup, form: FormGroup) {
    let list = form?.get('commercial_materials') as FormArray;
    materials?.get('q_unit')?.valueChanges?.subscribe(value => {
      let q_total = materials?.get('q_total')?.value;
      let unit_cost = materials?.get('unit_cost')?.value;
      let result = value * unit_cost * q_total;
      materials?.patchValue({
        total: Math?.round(result)
      })
    });
    materials?.get('q_total')?.valueChanges?.subscribe(value => {
      let q_unit = materials?.get('q_unit')?.value;
      let unit_cost = materials?.get('unit_cost')?.value;
      let result = q_unit * unit_cost * value;
      materials?.patchValue({
        total: Math?.round(result)
      })
    });
    materials?.get('unit_cost')?.valueChanges?.subscribe(value => {
      let q_unit = materials?.get('q_unit')?.value;
      let q_total = materials?.get('q_total')?.value;
      let result = q_total * value * q_unit;
      materials?.patchValue({
        total: Math?.round(result)
      })
    });
    materials?.get('unit_cost')?.valueChanges?.subscribe(value => {
      let q_unit = materials?.get('q_unit')?.value;
      let q_total = materials?.get('q_total')?.value;
      let result = q_total * value * q_unit;
      materials?.patchValue({
        total: Math?.round(result)
      })
    });
    materials?.get('total')?.valueChanges?.subscribe(value => {
      this?.subtotalMaterials(list, form);
    });
    form?.get('amount')?.valueChanges?.subscribe(value => {
      materials?.patchValue({
        q_total: value
      })
    });
    /* materials?.get('unit_cost')?.valueChanges?.subscribe(value => { // Hace lo mismo solo que realiza la acción cuando cambia el costo unitario
  let q_unit = materials?.get('q_unit')?.value;
  let q_total = materials?.get('q_total')?.value;
  let result = q_unit * value * q_total;
  materials?.patchValue({
    total: result
  })
}) */
  },

  subtotalMaterials(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total =
        list?.value?.reduce(
          (a, b) => {
            return a + b?.total
          }, 0
        );
      form?.patchValue({
        commercial_materials_subtotal: total
      })
    }, 100);
  }

};
