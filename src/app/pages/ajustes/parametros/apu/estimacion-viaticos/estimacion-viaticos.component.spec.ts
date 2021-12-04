import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimacionViaticosComponent } from './estimacion-viaticos.component';

describe('EstimacionViaticosComponent', () => {
  let component: EstimacionViaticosComponent;
  let fixture: ComponentFixture<EstimacionViaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimacionViaticosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimacionViaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
