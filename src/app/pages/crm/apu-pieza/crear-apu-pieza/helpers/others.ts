import { functionsApu} from './helper';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const othersHelper = {
  consts: {},
  createOthersGroup(fb: FormBuilder) {
    return fb.group({
      material_id: [''],
      unit_id: [''],
    });
  },

};