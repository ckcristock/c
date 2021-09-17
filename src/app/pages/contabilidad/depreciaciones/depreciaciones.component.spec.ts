import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciacionesComponent } from './depreciaciones.component';

describe('DepreciacionesComponent', () => {
  let component: DepreciacionesComponent;
  let fixture: ComponentFixture<DepreciacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
