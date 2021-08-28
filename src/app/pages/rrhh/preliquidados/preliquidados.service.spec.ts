import { TestBed } from '@angular/core/testing';

import { PreliquidadosService } from './preliquidados.service';

describe('PreliquidadosService', () => {
  let service: PreliquidadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreliquidadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
