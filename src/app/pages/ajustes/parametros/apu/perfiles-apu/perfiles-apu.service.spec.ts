import { TestBed } from '@angular/core/testing';

import { PerfilesApuService } from './perfiles-apu.service';

describe('PerfilesApuService', () => {
  let service: PerfilesApuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilesApuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
