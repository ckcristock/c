import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosConjuntoComponent } from './otros-conjunto.component';

describe('OtrosConjuntoComponent', () => {
  let component: OtrosConjuntoComponent;
  let fixture: ComponentFixture<OtrosConjuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtrosConjuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrosConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
