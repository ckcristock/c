import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorAlmuerzosComponent } from './valor-almuerzos.component';

describe('ValorAlmuerzosComponent', () => {
  let component: ValorAlmuerzosComponent;
  let fixture: ComponentFixture<ValorAlmuerzosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValorAlmuerzosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValorAlmuerzosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
