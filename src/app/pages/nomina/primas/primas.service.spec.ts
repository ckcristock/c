import { TestBed } from '@angular/core/testing';

import { PrimasService } from './primas.service';

describe('PrimasService', () => {
  let service: PrimasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrimasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
