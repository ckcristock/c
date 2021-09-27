import { TestBed } from '@angular/core/testing';

import { ProfesionesService } from './profesiones.service';

describe('ProfesionesService', () => {
  let service: ProfesionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
