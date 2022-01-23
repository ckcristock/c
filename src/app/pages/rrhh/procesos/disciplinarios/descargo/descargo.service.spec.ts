import { TestBed } from '@angular/core/testing';

import { DescargoService } from './descargo.service';

describe('DescargoService', () => {
  let service: DescargoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescargoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
