import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearGeometriaComponent } from './crear-geometria.component';

describe('CrearGeometriaComponent', () => {
  let component: CrearGeometriaComponent;
  let fixture: ComponentFixture<CrearGeometriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearGeometriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearGeometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
