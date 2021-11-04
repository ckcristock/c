import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearApuConjuntoComponent } from './crear-apu-conjunto.component';

describe('CrearApuConjuntoComponent', () => {
  let component: CrearApuConjuntoComponent;
  let fixture: ComponentFixture<CrearApuConjuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearApuConjuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearApuConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
