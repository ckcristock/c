import { TestBed } from '@angular/core/testing';

import { TiposEgresoService } from './tipos-egreso.service';

describe('TiposEgresoService', () => {
  let service: TiposEgresoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposEgresoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
