import { TestBed } from '@angular/core/testing';

import { LiquidadosService } from './liquidados.service';

describe('LiquidadosService', () => {
  let service: LiquidadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiquidadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
