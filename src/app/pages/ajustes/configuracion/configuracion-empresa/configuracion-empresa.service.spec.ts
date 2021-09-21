import { TestBed } from '@angular/core/testing';

import { ConfiguracionEmpresaService } from './configuracion-empresa.service';

describe('ConfiguracionEmpresaService', () => {
  let service: ConfiguracionEmpresaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracionEmpresaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
