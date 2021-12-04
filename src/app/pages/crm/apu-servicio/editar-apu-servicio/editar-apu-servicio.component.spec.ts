import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarApuServicioComponent } from './editar-apu-servicio.component';

describe('EditarApuServicioComponent', () => {
  let component: EditarApuServicioComponent;
  let fixture: ComponentFixture<EditarApuServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarApuServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarApuServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
