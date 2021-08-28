import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidadosComponent } from './liquidados.component';

describe('LiquidadosComponent', () => {
  let component: LiquidadosComponent;
  let fixture: ComponentFixture<LiquidadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
