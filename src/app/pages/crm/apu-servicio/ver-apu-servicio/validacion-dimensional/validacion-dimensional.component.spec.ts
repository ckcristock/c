import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionDimensionalComponent } from './validacion-dimensional.component';

describe('ValidacionDimensionalComponent', () => {
  let component: ValidacionDimensionalComponent;
  let fixture: ComponentFixture<ValidacionDimensionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidacionDimensionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacionDimensionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
