import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariosConfigComponent } from './salarios-config.component';

describe('SalariosConfigComponent', () => {
  let component: SalariosConfigComponent;
  let fixture: ComponentFixture<SalariosConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalariosConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariosConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
