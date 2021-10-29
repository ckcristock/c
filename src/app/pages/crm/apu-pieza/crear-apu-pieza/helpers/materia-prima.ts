
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

  createMateriaGroup(fb: FormBuilder, geometriesList: Array<any>) {
    let materia = fb.group({
      geometry_id: [''],
      image: [''],
      material_id: [''],
      peso_kg: [''],
      measures: fb.array([])
    });
    materia.get('geometry_id').valueChanges.subscribe(value => {
      let data = geometriesList.find(m => m.id == value);
      materia.patchValue({
        image: data.image,
        measures: ['']
      })
      let measure =  materia.get('measures') as FormArray;
      data.measures.forEach(element => {
        measure.push(this.createMeasuresGroup(element, fb));
      }); 
    });
    return materia;
  },

  createMeasuresGroup(element, fb: FormBuilder) {
    return fb.group({
      measure_id: element.id,
      value: [0],
      name: [element.name],
      measure: [element.measure]
    });
  },

};
