import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavItemsDynamicComponent } from './nav-items-dynamic.component';

describe('NavItemsDynamicComponent', () => {
  let component: NavItemsDynamicComponent;
  let fixture: ComponentFixture<NavItemsDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavItemsDynamicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavItemsDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
