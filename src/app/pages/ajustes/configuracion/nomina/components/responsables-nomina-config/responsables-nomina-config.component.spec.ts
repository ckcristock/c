import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsablesNominaConfigComponent } from './responsables-nomina-config.component';

describe('ResponsablesNominaConfigComponent', () => {
  let component: ResponsablesNominaConfigComponent;
  let fixture: ComponentFixture<ResponsablesNominaConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsablesNominaConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsablesNominaConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
