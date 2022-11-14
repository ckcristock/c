import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosNominaComponent } from './parametros-nomina.component';

describe('ParametrosNominaComponent', () => {
  let component: ParametrosNominaComponent;
  let fixture: ComponentFixture<ParametrosNominaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrosNominaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosNominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
