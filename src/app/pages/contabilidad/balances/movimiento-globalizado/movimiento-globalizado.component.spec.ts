import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoGlobalizadoComponent } from './movimiento-globalizado.component';

describe('MovimientoGlobalizadoComponent', () => {
  let component: MovimientoGlobalizadoComponent;
  let fixture: ComponentFixture<MovimientoGlobalizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimientoGlobalizadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientoGlobalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
