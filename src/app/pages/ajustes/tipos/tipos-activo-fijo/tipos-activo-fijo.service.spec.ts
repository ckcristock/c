import { TestBed } from '@angular/core/testing';

import { TiposActivoFijoService } from './tipos-activo-fijo.service';

describe('TiposActivoFijoService', () => {
  let service: TiposActivoFijoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposActivoFijoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
