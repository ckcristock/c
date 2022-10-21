import { TestBed } from '@angular/core/testing';

import { TiposTerminosService } from './tipos-terminos.service';

describe('TiposTerminosService', () => {
  let service: TiposTerminosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposTerminosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
