import { functionsApu} from './helper';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormGroupName,
} from '@angular/forms';

export const measuresHelper = {
  consts: {},
  createMeasuresGroup(fb: FormBuilder) {
    return fb.group({
      measure_id: [0],
      value: [0]
    });
  },

};