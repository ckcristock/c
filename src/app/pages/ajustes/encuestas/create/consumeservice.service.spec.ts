import { TestBed } from '@angular/core/testing';

import { ConsumeserviceService } from './consumeservice.service';

describe('ConsumeserviceService', () => {
  let service: ConsumeserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumeserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
