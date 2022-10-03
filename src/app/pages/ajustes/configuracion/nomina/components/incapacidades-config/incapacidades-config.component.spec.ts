import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadesConfigComponent } from './incapacidades-config.component';

describe('IncapacidadesConfigComponent', () => {
  let component: IncapacidadesConfigComponent;
  let fixture: ComponentFixture<IncapacidadesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncapacidadesConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapacidadesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
