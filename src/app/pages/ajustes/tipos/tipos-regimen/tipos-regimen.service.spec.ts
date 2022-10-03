/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TiposRegimenService } from './tipos-regimen.service';

describe('Service: TiposRegimen', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TiposRegimenService]
    });
  });

  it('should ...', inject([TiposRegimenService], (service: TiposRegimenService) => {
    expect(service).toBeTruthy();
  }));
});
