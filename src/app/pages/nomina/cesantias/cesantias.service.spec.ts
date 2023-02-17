import { TestBed } from '@angular/core/testing';

import { CesantiasService } from './cesantias.service';

describe('CesantiasService', () => {
  let service: CesantiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CesantiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
