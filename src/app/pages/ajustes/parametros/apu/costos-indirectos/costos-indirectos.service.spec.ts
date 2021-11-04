import { TestBed } from '@angular/core/testing';

import { CostosIndirectosService } from './costos-indirectos.service';

describe('CostosIndirectosService', () => {
  let service: CostosIndirectosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostosIndirectosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
