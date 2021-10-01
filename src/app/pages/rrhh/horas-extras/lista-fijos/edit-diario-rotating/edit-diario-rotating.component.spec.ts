import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiarioRotatingComponent } from './edit-diario-rotating.component';

describe('EditDiarioRotatingComponent', () => {
  let component: EditDiarioRotatingComponent;
  let fixture: ComponentFixture<EditDiarioRotatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDiarioRotatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDiarioRotatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
