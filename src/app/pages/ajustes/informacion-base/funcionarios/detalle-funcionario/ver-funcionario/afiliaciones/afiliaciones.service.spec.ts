import { TestBed } from '@angular/core/testing';

import { AfiliacionesService } from './afiliaciones.service';

describe('AfiliacionesService', () => {
  let service: AfiliacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfiliacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
