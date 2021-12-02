import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimacionViaticosValuesComponent } from './estimacion-viaticos-values.component';

describe('EstimacionViaticosValuesComponent', () => {
  let component: EstimacionViaticosValuesComponent;
  let fixture: ComponentFixture<EstimacionViaticosValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimacionViaticosValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimacionViaticosValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
