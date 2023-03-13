import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CesantiaCurrentComponent } from './cesantia-current.component';

describe('CesantiaCurrentComponent', () => {
  let component: CesantiaCurrentComponent;
  let fixture: ComponentFixture<CesantiaCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CesantiaCurrentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CesantiaCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
