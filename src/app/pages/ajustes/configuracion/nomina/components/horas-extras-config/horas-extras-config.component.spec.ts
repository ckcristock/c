import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorasExtrasConfigComponent } from './horas-extras-config.component';

describe('HorasExtrasConfigComponent', () => {
  let component: HorasExtrasConfigComponent;
  let fixture: ComponentFixture<HorasExtrasConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorasExtrasConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorasExtrasConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
