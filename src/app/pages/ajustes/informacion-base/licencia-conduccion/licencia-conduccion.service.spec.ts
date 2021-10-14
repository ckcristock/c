import { TestBed } from '@angular/core/testing';

import { LicenciaConduccionService } from './licencia-conduccion.service';

describe('LicenciaConduccionService', () => {
  let service: LicenciaConduccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenciaConduccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
