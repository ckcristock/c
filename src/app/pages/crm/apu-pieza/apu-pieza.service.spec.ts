import { TestBed } from '@angular/core/testing';

import { ApuPiezaService } from './apu-pieza.service';

describe('ApuPiezaService', () => {
  let service: ApuPiezaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApuPiezaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
