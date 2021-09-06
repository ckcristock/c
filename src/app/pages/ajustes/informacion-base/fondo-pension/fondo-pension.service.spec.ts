import { TestBed } from '@angular/core/testing';

import { FondoPensionService } from './fondo-pension.service';

describe('FondoPensionService', () => {
  let service: FondoPensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FondoPensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
