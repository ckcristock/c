import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBusinessComponent } from './get-business.component';

describe('GetBusinessComponent', () => {
  let component: GetBusinessComponent;
  let fixture: ComponentFixture<GetBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetBusinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
