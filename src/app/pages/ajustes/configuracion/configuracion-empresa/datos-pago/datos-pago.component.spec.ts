import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPagoComponent } from './datos-pago.component';

describe('DatosPagoComponent', () => {
  let component: DatosPagoComponent;
  let fixture: ComponentFixture<DatosPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
