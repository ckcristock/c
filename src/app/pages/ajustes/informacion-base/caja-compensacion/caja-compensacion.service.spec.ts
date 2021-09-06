import { TestBed } from '@angular/core/testing';

import { CajaCompensacionService } from './caja-compensacion.service';

describe('CajaCompensacionService', () => {
  let service: CajaCompensacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CajaCompensacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
