import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosNominaComponent } from './datos-nomina.component';

describe('DatosNominaComponent', () => {
  let component: DatosNominaComponent;
  let fixture: ComponentFixture<DatosNominaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosNominaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosNominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
