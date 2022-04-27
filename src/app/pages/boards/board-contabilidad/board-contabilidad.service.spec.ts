/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BoardContabilidadService } from './board-contabilidad.service';

describe('Service: BoardContabilidad', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardContabilidadService]
    });
  });

  it('should ...', inject([BoardContabilidadService], (service: BoardContabilidadService) => {
    expect(service).toBeTruthy();
  }));
});
