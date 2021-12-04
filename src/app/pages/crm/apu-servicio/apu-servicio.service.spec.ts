import { TestBed } from '@angular/core/testing';

import { ApuServicioService } from './apu-servicio.service';

describe('ApuServicioService', () => {
  let service: ApuServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApuServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
