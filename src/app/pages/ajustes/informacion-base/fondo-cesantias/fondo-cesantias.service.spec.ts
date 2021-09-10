import { TestBed } from '@angular/core/testing';

import { FondoCesantiasService } from './fondo-cesantias.service';

describe('FondoCesantiasService', () => {
  let service: FondoCesantiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FondoCesantiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
