import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArlComponent } from './arl.component';

describe('ArlComponent', () => {
  let component: ArlComponent;
  let fixture: ComponentFixture<ArlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
