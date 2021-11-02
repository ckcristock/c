import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const materiaHelper = {
  consts: {},
  
  createFillInMateria(){
    
  },

  createMateriaGroup(form:FormGroup, fb: FormBuilder, geometriesList: Array<any>) {
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
    materia.get('geometry_id').valueChanges.subscribe(value => {
      let data = geometriesList.find(m => m.id == value);
      materia.patchValue({
        image: data.image,
        weight_formula: data.weight_formula
      })
      let measure =  materia.get('measures') as FormArray;
      measure.clear();
      data.measures.forEach(element => {
        measure.push(this.createMeasuresGroup(element, fb, materia));
      }); 
    });
    this.subscribeMateria(materia, list, form);
    return materia;
  },

  createMeasuresGroup(element, fb: FormBuilder, materia: FormGroup) {
    let group = fb.group({
      measure_id: element.id,
      value: [0],
      name: [element.name],
      measure: [element.measure]
    });
    group.get('value').valueChanges.subscribe(r => {
      let abuelo:any = group.parent.parent.controls;
      let padre:any = group.parent;
      let weight_formula = abuelo.weight_formula.value;
      let formula = weight_formula;
      padre.controls.forEach(element => {
        let measure = element.controls.measure.value;
        let value = element.controls.value.value;
        formula = formula.replace( '{'+ measure + '}',  value );
      });  
      let result = eval(formula);
      materia.patchValue({
        weight_kg: result
      })
    })
    return group;
  },

  subscribeMateria(group: FormGroup, list: FormArray, form: FormGroup){
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
    group.get('total_value').valueChanges.subscribe(value => {
      this.subtotalMateria(list, form)
    })
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
        materia_prima_subtotal: total
      }) 
    }, 100);
  },
  

};
