import { TestBed } from '@angular/core/testing';

import { AlertasComunService } from './alertas-comun.service';

describe('AlertasComunService', () => {
  let service: AlertasComunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertasComunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
