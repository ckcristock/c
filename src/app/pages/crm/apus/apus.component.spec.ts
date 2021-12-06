import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApusComponent } from './apus.component';

describe('ApusComponent', () => {
  let component: ApusComponent;
  let fixture: ComponentFixture<ApusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
