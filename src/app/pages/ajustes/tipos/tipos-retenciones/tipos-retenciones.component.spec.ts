import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposRetencionesComponent } from './tipos-retenciones.component';

describe('TiposRetencionesComponent', () => {
  let component: TiposRetencionesComponent;
  let fixture: ComponentFixture<TiposRetencionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposRetencionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposRetencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
