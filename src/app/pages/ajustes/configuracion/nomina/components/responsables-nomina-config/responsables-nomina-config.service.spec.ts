import { TestBed } from '@angular/core/testing';

import { ResponsablesNominaConfigService } from './responsables-nomina-config.service';

describe('ResponsablesNominaConfigService', () => {
  let service: ResponsablesNominaConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsablesNominaConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
