import { TestBed } from '@angular/core/testing';

import { ValorAlmuerzosService } from './valor-almuerzos.service';

describe('ValorAlmuerzosService', () => {
  let service: ValorAlmuerzosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValorAlmuerzosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
