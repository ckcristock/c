import { TestBed } from '@angular/core/testing';

import { CentroCostosService } from './centro-costos.service';

describe('CentroCostosService', () => {
  let service: CentroCostosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentroCostosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
