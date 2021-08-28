import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliquidadosComponent } from './preliquidados.component';

describe('PreliquidadosComponent', () => {
  let component: PreliquidadosComponent;
  let fixture: ComponentFixture<PreliquidadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreliquidadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreliquidadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
