import { functionsApu} from './helper';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const externalProccessesHelper = {
  consts: {},
  createExternalProccessesGroup(fb: FormBuilder) {
    return fb.group({
      material_id: [''],
      unit_id: [''],
    });
  },

};