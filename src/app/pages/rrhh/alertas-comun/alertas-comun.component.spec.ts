import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasComunComponent } from './alertas-comun.component';

describe('AlertasComunComponent', () => {
  let component: AlertasComunComponent;
  let fixture: ComponentFixture<AlertasComunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertasComunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertasComunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
