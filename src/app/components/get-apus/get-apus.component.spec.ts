import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetApusComponent } from './get-apus.component';

describe('GetApusComponent', () => {
  let component: GetApusComponent;
  let fixture: ComponentFixture<GetApusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetApusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetApusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
