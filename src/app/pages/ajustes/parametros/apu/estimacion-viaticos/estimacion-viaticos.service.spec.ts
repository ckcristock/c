import { TestBed } from '@angular/core/testing';

import { EstimacionViaticosService } from './estimacion-viaticos.service';

describe('EstimacionViaticosService', () => {
  let service: EstimacionViaticosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimacionViaticosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
