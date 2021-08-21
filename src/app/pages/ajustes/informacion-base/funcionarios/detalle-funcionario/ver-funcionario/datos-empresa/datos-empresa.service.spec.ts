import { TestBed } from '@angular/core/testing';

import { DatosEmpresaService } from './datos-empresa.service';

describe('DatosEmpresaService', () => {
  let service: DatosEmpresaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosEmpresaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
