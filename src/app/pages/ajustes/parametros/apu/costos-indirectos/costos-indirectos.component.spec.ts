import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosIndirectosComponent } from './costos-indirectos.component';

describe('CostosIndirectosComponent', () => {
  let component: CostosIndirectosComponent;
  let fixture: ComponentFixture<CostosIndirectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostosIndirectosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosIndirectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
