import { TestBed } from '@angular/core/testing';

import { DisciplinariosService } from './disciplinarios.service';

describe('DisciplinariosService', () => {
  let service: DisciplinariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisciplinariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
