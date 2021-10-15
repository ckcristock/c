import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimasComponent } from './primas.component';

describe('PrimasComponent', () => {
  let component: PrimasComponent;
  let fixture: ComponentFixture<PrimasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
