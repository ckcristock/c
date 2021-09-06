import { TestBed } from '@angular/core/testing';

import { TiposAnulacionService } from './tipos-anulacion.service';

describe('TiposAnulacionService', () => {
  let service: TiposAnulacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposAnulacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
