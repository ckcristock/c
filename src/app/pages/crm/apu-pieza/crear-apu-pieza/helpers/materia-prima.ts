import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

export const materiaHelper = {

  createFillInMateria(form: FormGroup, fb: FormBuilder, data, geometriesList: Array<any>, materials:Array<any>) {
    if (data.rawmaterial) {
      let materia_prima = form.get('materia_prima') as FormArray;
      data.rawmaterial.forEach((r) => {
        let measuress = fb.array([]);
        r.measures.forEach(m => {
          let measure = fb.group({
            measure_id: [m.measure_id],
            value: [m.value],
            name: [m.name],
            measure: [m.measure]
          });
          this.operation(measure);
          measuress.push(measure);
        });
        let group = fb.group({
          geometry_id: [r.geometry_id],
          image: [r.geometry.image],
          material_id: [r.material_id],
          measures: measuress,
          weight_formula: [r.geometry.weight_formula],
          weight_kg: [r.weight_kg],
          q: [r.q],
          weight_total: [r.weight_total],
          value_kg: [r.value_kg],
          total_value: [r.total_value]
        });
        this.subscribeMateria(group, materia_prima, form, geometriesList, fb, materials);
        materia_prima.push(group);
      });
    }
  },

  createMateriaGroup(form:FormGroup, fb: FormBuilder, geometriesList: Array<any>, materials:Array<any>) {
    let materia = fb.group({
      geometry_id: [''],
      image: [''],
      material_id: [''],
      measures: fb.array([]),
      weight_formula: [''],
      weight_kg: [0],
      q: [0],
      weight_total: [0],
      value_kg: [0],
      total_value: [0]
    });
    let list = form.get('materia_prima') as FormArray;
    this.subscribeMateria(materia, list, form, geometriesList, fb, materials);
    return materia;
  },

  createMeasuresGroup(element, fb: FormBuilder, materia: FormGroup) {
    let group = fb.group({
      measure_id: element.id,
      value: [0],
      name: [element.name],
      measure: [element.measure]
    });
    this.operation(group, materia);
    return group;
  },

  operation(group: FormGroup){
    group.get('value').valueChanges.subscribe(r => {
      let materia:any = group.parent.parent;
      let materiaControl:any = group.parent.parent.controls;
      let measureGroup:any = group.parent;
      let weight_formula = materiaControl.weight_formula.value;
      let formula = weight_formula;
      measureGroup.controls.forEach(element => {
        let measure = element.controls.measure.value;
        let value = element.controls.value.value;
        console.log(formula);
        formula = formula.replace( '{' + measure + '}',  value );
      });  
      let result = eval(formula);
      materia.patchValue({
        weight_kg: result
      })
    })
  },

  subscribeMateria(group: FormGroup, list: FormArray, form: FormGroup, geometriesList: Array<any>, fb: FormBuilder, materials:Array<any>){
    group.get('q').valueChanges.subscribe(value => {
      let weight_kg = group.get('weight_kg').value;
      group.patchValue({
        weight_total: weight_kg * value
      });
    });
    group.get('weight_kg').valueChanges.subscribe(value => {
      let q = group.get('q').value;
      group.patchValue({
        weight_total: q * value
      });
    });
    group.get('value_kg').valueChanges.subscribe(value => {
      let weight_total = group.get('weight_total').value;
      group.patchValue({
        total_value: weight_total * value
      });
    });
    form.get('amount').valueChanges.subscribe(value => {
      group.patchValue({
        q: value
      });
    });
    group.get('total_value').valueChanges.subscribe(value => {
      this.subtotalMateria(list, form)
    });
    group.get('geometry_id').valueChanges.subscribe(value => {
      let data = geometriesList.find(m => m.id == value);
      group.patchValue({
        image: data.image,
        weight_formula: data.weight_formula
      })
      let measure =  group.get('measures') as FormArray;
      measure.clear();
      data.measures.forEach(element => {
        measure.push(this.createMeasuresGroup(element, fb, group));
      }); 
    });
    group.get('material_id').valueChanges.subscribe(value => {
      let data = materials.find(m => m.id == value);
      group.patchValue({
        value_kg: data.kg_value
      })
    });
    group.get('value_kg').valueChanges.subscribe(value => {
      let weight_total = group.get('weight_total').value;
      group.patchValue({
        total_value: weight_total * value
      });
    });
    group.get('weight_total').valueChanges.subscribe(value => {
      let value_kg = group.get('value_kg').value;
      group.patchValue({
        total_value: value * value_kg
      });
    });
  },

  subtotalMateria(list: FormArray, form:FormGroup) {
    setTimeout(() => {
      let total = 
      list.value.reduce(
        (a, b) => {
          return  a + b.total_value
        },0
      );
      form.patchValue({
        subtotal_raw_material: total
      }) 
    }, 130);
  },
  

};
