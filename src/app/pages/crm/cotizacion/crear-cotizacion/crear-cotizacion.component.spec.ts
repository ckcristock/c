import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCotizacionComponent } from './crear-cotizacion.component';

describe('CrearCotizacionComponent', () => {
  let component: CrearCotizacionComponent;
  let fixture: ComponentFixture<CrearCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearCotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
