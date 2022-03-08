import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialNegocioComponent } from './historial-negocio.component';

describe('HistorialNegocioComponent', () => {
  let component: HistorialNegocioComponent;
  let fixture: ComponentFixture<HistorialNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialNegocioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
