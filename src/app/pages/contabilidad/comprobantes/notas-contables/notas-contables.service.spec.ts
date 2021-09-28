import { TestBed } from '@angular/core/testing';

import { NotasContablesService } from './notas-contables.service';

describe('NotasContablesService', () => {
  let service: NotasContablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotasContablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
