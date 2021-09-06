import { TestBed } from '@angular/core/testing';

import { TiposGlosaService } from './tipos-glosa.service';

describe('TiposGlosaService', () => {
  let service: TiposGlosaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposGlosaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
