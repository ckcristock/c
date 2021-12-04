import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerApuServicioComponent } from './ver-apu-servicio.component';

describe('VerApuServicioComponent', () => {
  let component: VerApuServicioComponent;
  let fixture: ComponentFixture<VerApuServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerApuServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerApuServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
