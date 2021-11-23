import { TestBed } from '@angular/core/testing';

import { CorteLaserMaterialService } from './corte-laser-material.service';

describe('CorteLaserMaterialService', () => {
  let service: CorteLaserMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorteLaserMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
