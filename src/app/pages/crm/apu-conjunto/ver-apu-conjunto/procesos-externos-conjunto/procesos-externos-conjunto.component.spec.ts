import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosExternosConjuntoComponent } from './procesos-externos-conjunto.component';

describe('ProcesosExternosConjuntoComponent', () => {
  let component: ProcesosExternosConjuntoComponent;
  let fixture: ComponentFixture<ProcesosExternosConjuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosExternosConjuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosExternosConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
