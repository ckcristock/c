import { TestBed } from '@angular/core/testing';

import { GeometriasService } from './geometrias.service';

describe('GeometriasService', () => {
  let service: GeometriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeometriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
