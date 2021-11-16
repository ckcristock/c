import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinasHerramientasConjuntoComponent } from './maquinas-herramientas-conjunto.component';

describe('MaquinasHerramientasConjuntoComponent', () => {
  let component: MaquinasHerramientasConjuntoComponent;
  let fixture: ComponentFixture<MaquinasHerramientasConjuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaquinasHerramientasConjuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinasHerramientasConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
