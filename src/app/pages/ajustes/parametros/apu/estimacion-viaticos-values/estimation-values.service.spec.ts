import { TestBed } from '@angular/core/testing';

import { EstimationValuesService } from './estimation-values.service';

describe('EstimationValuesService', () => {
  let service: EstimationValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimationValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
