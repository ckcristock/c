import { TestBed } from '@angular/core/testing';

import { EspesoresService } from './espesores.service';

describe('EspesoresService', () => {
  let service: EspesoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspesoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
