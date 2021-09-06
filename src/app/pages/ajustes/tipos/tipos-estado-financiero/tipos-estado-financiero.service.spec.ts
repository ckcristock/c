import { TestBed } from '@angular/core/testing';

import { TiposEstadoFinancieroService } from './tipos-estado-financiero.service';

describe('TiposEstadoFinancieroService', () => {
  let service: TiposEstadoFinancieroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposEstadoFinancieroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
