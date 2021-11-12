import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearApuPiezaComponent } from './crear-apu-pieza.component';

describe('CrearApuPiezaComponent', () => {
  let component: CrearApuPiezaComponent;
  let fixture: ComponentFixture<CrearApuPiezaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearApuPiezaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearApuPiezaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
