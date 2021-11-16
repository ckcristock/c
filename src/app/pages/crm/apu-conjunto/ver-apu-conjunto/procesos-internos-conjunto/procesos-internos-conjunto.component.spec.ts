import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosInternosConjuntoComponent } from './procesos-internos-conjunto.component';

describe('ProcesosInternosConjuntoComponent', () => {
  let component: ProcesosInternosConjuntoComponent;
  let fixture: ComponentFixture<ProcesosInternosConjuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosInternosConjuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosInternosConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
