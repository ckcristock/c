import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontajePuestaMarchaComponent } from './montaje-puesta-marcha.component';

describe('MontajePuestaMarchaComponent', () => {
  let component: MontajePuestaMarchaComponent;
  let fixture: ComponentFixture<MontajePuestaMarchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MontajePuestaMarchaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MontajePuestaMarchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
