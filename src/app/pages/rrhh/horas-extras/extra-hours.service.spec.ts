import { TestBed } from '@angular/core/testing';

import { ExtraHoursService } from './extra-hours.service';

describe('ExtraHoursService', () => {
  let service: ExtraHoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtraHoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
