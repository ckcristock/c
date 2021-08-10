import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestacionesSocialesComponent } from './prestaciones-sociales.component';

describe('PrestacionesSocialesComponent', () => {
  let component: PrestacionesSocialesComponent;
  let fixture: ComponentFixture<PrestacionesSocialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestacionesSocialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestacionesSocialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
