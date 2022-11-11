import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionConfigComponent } from './liquidacion-config.component';

describe('LiquidacionConfigComponent', () => {
  let component: LiquidacionConfigComponent;
  let fixture: ComponentFixture<LiquidacionConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidacionConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
