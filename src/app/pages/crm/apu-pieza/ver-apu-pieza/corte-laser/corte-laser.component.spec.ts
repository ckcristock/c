import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteLaserComponent } from './corte-laser.component';

describe('CorteLaserComponent', () => {
  let component: CorteLaserComponent;
  let fixture: ComponentFixture<CorteLaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorteLaserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteLaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
