import { TestBed } from '@angular/core/testing';

import { TiposNovedadesService } from './tipos-novedades.service';

describe('TiposNovedadesService', () => {
  let service: TiposNovedadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposNovedadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
