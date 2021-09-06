import { TestBed } from '@angular/core/testing';

import { TiposRetencionesService } from './tipos-retenciones.service';

describe('TiposRetencionesService', () => {
  let service: TiposRetencionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposRetencionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
