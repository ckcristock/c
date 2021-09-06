import { TestBed } from '@angular/core/testing';

import { TiposRechazoService } from './tipos-rechazo.service';

describe('TiposRechazoService', () => {
  let service: TiposRechazoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposRechazoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
