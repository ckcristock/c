import { TestBed } from '@angular/core/testing';

import { TiposIngresoService } from './tipos-ingreso.service';

describe('TiposIngresoService', () => {
  let service: TiposIngresoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposIngresoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
