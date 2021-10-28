import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoPrestacionalComponent } from './ingreso-prestacional.component';

describe('IngresoPrestacionalComponent', () => {
  let component: IngresoPrestacionalComponent;
  let fixture: ComponentFixture<IngresoPrestacionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoPrestacionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoPrestacionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
