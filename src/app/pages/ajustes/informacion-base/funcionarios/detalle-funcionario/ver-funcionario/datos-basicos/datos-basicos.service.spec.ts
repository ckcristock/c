import { TestBed } from '@angular/core/testing';

import { DatosBasicosService } from './datos-basicos.service';

describe('DatosBasicosService', () => {
  let service: DatosBasicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosBasicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
