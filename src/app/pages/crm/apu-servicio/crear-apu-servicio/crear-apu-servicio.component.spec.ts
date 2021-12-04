import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearApuServicioComponent } from './crear-apu-servicio.component';

describe('CrearApuServicioComponent', () => {
  let component: CrearApuServicioComponent;
  let fixture: ComponentFixture<CrearApuServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearApuServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearApuServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
