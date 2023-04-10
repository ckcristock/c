import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBudgetsComponent } from './get-budgets.component';

describe('GetBudgetsComponent', () => {
  let component: GetBudgetsComponent;
  let fixture: ComponentFixture<GetBudgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetBudgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetBudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
