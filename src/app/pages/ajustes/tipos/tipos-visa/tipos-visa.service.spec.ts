import { TestBed } from '@angular/core/testing';

import { TiposVisaService } from './tipos-visa.service';

describe('TiposVisaService', () => {
  let service: TiposVisaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposVisaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
