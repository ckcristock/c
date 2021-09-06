import { TestBed } from '@angular/core/testing';

import { ArlService } from './arl.service';

describe('ArlService', () => {
  let service: ArlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
