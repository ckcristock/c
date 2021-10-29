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
      measures: fb.array([]),
      prueba: ['']
    });
    materia.get('geometry_id').valueChanges.subscribe(value => {
      let data = geometriesList.find(m => m.id == value);
      materia.patchValue({
        image: data.image
      })
      /* data.measures.forEach(element => {
        materia.patchValue({
          prueba: element.name
        })
      }); */
      this.createMeasuresGroup(fb);
    });
    return materia;
  },

  createMeasuresGroup(fb: FormBuilder) {
    return fb.group({
      measure_id: [0],
      value: [0]
    });
  },

};
