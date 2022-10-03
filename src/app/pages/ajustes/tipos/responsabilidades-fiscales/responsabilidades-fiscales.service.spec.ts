/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ResponsabilidadesFiscalesService } from './responsabilidades-fiscales.service';

describe('Service: ResponsabilidadesFiscales', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResponsabilidadesFiscalesService]
    });
  });

  it('should ...', inject([ResponsabilidadesFiscalesService], (service: ResponsabilidadesFiscalesService) => {
    expect(service).toBeTruthy();
  }));
});
