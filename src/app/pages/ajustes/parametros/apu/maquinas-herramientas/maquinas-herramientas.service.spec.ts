import { TestBed } from '@angular/core/testing';

import { MaquinasHerramientasService } from './maquinas-herramientas.service';

describe('MaquinasHerramientasService', () => {
  let service: MaquinasHerramientasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaquinasHerramientasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
