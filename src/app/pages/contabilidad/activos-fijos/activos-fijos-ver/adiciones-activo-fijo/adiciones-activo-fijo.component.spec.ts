import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionesActivoFijoComponent } from './adiciones-activo-fijo.component';

describe('AdicionesActivoFijoComponent', () => {
  let component: AdicionesActivoFijoComponent;
  let fixture: ComponentFixture<AdicionesActivoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdicionesActivoFijoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionesActivoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
