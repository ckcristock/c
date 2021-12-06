import { TestBed } from '@angular/core/testing';

import { ApusService } from './apus.service';

describe('ApusService', () => {
  let service: ApusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
