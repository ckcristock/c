import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuConjuntoComponent } from './apu-conjunto.component';

describe('ApuConjuntoComponent', () => {
  let component: ApuConjuntoComponent;
  let fixture: ComponentFixture<ApuConjuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApuConjuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
