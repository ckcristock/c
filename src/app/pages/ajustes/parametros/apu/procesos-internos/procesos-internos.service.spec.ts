import { TestBed } from '@angular/core/testing';

import { ProcesosInternosService } from './procesos-internos.service';

describe('ProcesosInternosService', () => {
  let service: ProcesosInternosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcesosInternosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
