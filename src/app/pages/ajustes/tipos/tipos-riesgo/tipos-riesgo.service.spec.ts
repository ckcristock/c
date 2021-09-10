import { TestBed } from '@angular/core/testing';

import { TiposRiesgoService } from './tipos-riesgo.service';

describe('TiposRiesgoService', () => {
  let service: TiposRiesgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposRiesgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
