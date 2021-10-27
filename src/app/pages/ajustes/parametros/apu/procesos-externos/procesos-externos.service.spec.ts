import { TestBed } from '@angular/core/testing';

import { ProcesosExternosService } from './procesos-externos.service';

describe('ProcesosExternosService', () => {
  let service: ProcesosExternosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcesosExternosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
