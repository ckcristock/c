import { TestBed } from '@angular/core/testing';

import { TipoActividadesService } from './tipo-actividades.service';

describe('TipoActividadesService', () => {
  let service: TipoActividadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoActividadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
