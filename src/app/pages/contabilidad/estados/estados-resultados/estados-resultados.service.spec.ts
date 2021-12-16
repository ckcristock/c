import { TestBed } from '@angular/core/testing';

import { EstadosResultadosService } from './estados-resultados.service';

describe('EstadosResultadosService', () => {
  let service: EstadosResultadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadosResultadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
