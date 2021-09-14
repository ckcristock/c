import { TestBed } from '@angular/core/testing';

import { PlanCuentasService } from './plan-cuentas.service';

describe('PlanCuentasService', () => {
  let service: PlanCuentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanCuentasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
