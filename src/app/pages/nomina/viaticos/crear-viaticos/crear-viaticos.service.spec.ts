import { TestBed } from '@angular/core/testing';

import { CrearViaticosService } from './crear-viaticos.service';

describe('CrearViaticosService', () => {
  let service: CrearViaticosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearViaticosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
