import { TestBed } from '@angular/core/testing';

import { CerrarProcesoService } from './cerrar-proceso.service';

describe('CerrarProcesoService', () => {
  let service: CerrarProcesoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CerrarProcesoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
