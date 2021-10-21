import { TestBed } from '@angular/core/testing';

import { CamposTercerosService } from './campos-terceros.service';

describe('CamposTercerosService', () => {
  let service: CamposTercerosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamposTercerosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
