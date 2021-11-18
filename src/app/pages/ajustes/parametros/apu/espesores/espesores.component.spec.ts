import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspesoresComponent } from './espesores.component';

describe('EspesoresComponent', () => {
  let component: EspesoresComponent;
  let fixture: ComponentFixture<EspesoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspesoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
