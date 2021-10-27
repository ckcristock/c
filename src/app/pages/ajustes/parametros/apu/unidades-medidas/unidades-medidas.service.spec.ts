import { TestBed } from '@angular/core/testing';

import { UnidadesMedidasService } from './unidades-medidas.service';

describe('UnidadesMedidasService', () => {
  let service: UnidadesMedidasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnidadesMedidasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
