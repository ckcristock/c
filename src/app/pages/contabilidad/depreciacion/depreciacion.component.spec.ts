import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciacionComponent } from './depreciacion.component';

describe('DepreciacionComponent', () => {
  let component: DepreciacionComponent;
  let fixture: ComponentFixture<DepreciacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
