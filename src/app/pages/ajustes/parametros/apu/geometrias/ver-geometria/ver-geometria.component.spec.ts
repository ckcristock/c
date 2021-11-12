import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerGeometriaComponent } from './ver-geometria.component';

describe('VerGeometriaComponent', () => {
  let component: VerGeometriaComponent;
  let fixture: ComponentFixture<VerGeometriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerGeometriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerGeometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
