import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconteoEstibaComponent } from './reconteo-estiba.component';

describe('ReconteoEstibaComponent', () => {
  let component: ReconteoEstibaComponent;
  let fixture: ComponentFixture<ReconteoEstibaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconteoEstibaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconteoEstibaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
