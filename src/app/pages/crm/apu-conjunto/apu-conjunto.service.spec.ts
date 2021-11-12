import { TestBed } from '@angular/core/testing';

import { ApuConjuntoService } from './apu-conjunto.service';

describe('ApuConjuntoService', () => {
  let service: ApuConjuntoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApuConjuntoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
