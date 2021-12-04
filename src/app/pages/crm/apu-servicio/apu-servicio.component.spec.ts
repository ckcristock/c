import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuServicioComponent } from './apu-servicio.component';

describe('ApuServicioComponent', () => {
  let component: ApuServicioComponent;
  let fixture: ComponentFixture<ApuServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApuServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
