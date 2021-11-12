import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColillaPagoComponent } from './colilla-pago.component';

describe('ColillaPagoComponent', () => {
  let component: ColillaPagoComponent;
  let fixture: ComponentFixture<ColillaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColillaPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColillaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
